// ... imports
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/lib/api-client";

/**
 * Complete user profile interface matching backend schema
 */
export interface User {
  // Core identifiers
  userId: string;
  clerkUserId: string;

  // Personal information
  firstName?: string;
  lastName?: string;
  email: string;
  imageUrl?: string;

  // Account details
  isActive: boolean;

  // Timestamps
  createdAt: string;
  updatedAt?: string;
}

/**
 * User store state interface
 */
interface UserStore {
  // Auth state
  isSignedIn: boolean;
  isLoaded: boolean;

  // Backend User data
  user: User | null;

  // Loading and error states
  isLoading: boolean; // General loading
  isSyncing: boolean; // Specific to backend sync
  error: string | null;

  // Actions
  setAuth: (isSignedIn: boolean, isLoaded: boolean) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  logoutUser: () => void;
  syncUser: (clerkUser: any) => Promise<void>;
}

/**
 * Zustand store for user profile management
 */
const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isSignedIn: false,
      isLoaded: false,
      user: null,
      isLoading: false,
      isSyncing: false,
      error: null,

      // Set auth state
      setAuth: (isSignedIn, isLoaded) => set({ isSignedIn, isLoaded }),

      // Set user data
      setUser: (user) => set({ user, error: null }),

      // Clear user data (internal usage)
      clearUser: () => set({ user: null, isSignedIn: false, error: null }),

      // Logout action
      logoutUser: () => {
        set({
          user: null,
          isSignedIn: false,
          error: null
        });
      },

      // Sync user profile with backend (called after login)
      syncUser: async (clerkUser: any) => {
        // Prevent complex types in args if possible, but clerkUser is needed for payload
        if (get().isSyncing) return;

        // If we already have a user and the IDs match, we might not need to sync immediately,
        // but for now we'll always sync to ensure freshness.

        console.log('🔄 Starting user sync...', {
          clerkUserId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress
        });

        set({ isSyncing: true, error: null });

        try {
          const payload = {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
          };

          console.log('📤 Sending sync request to:', API_ENDPOINTS.users.sync);
          console.log('📦 Payload:', payload);

          // Note: Token is handled by the Axios interceptor via apiClient
          const response = await apiClient.post(API_ENDPOINTS.users.sync, payload);

          console.log('✅ Sync successful:', response.data);

          const data = response.data;
          // output format from backend: { success: true, message: '...', data: { ...user } }

          const userData = data.data;

          // Transform backend response to match User interface
          const user: User = {
            userId: userData.user_id,
            clerkUserId: userData.clerk_user_id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            imageUrl: userData.image_url,
            isActive: userData.is_active,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
          };

          console.log('💾 User data saved to store:', user);

          set({ user, isSyncing: false, error: null });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to sync user profile';
          console.error('❌ Sync failed:', error);
          console.error('📛 Error message:', errorMessage);
          console.error('📛 Error response:', error.response?.data);

          // Don't block the UI - just log the error and set state
          // The user can still use the app with Clerk authentication
          set({ isSyncing: false, error: errorMessage });

          // Error toast is already handled by apiClient interceptor
          // We don't need to show another toast here
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isSignedIn: state.isSignedIn,
      }),
    }
  )
);

export default useUserStore;
