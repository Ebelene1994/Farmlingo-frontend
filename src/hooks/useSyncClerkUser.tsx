import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import useUserStore from "@/store/userStore";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/constants/api";

import type { ReactNode } from 'react';

export const useSyncClerkUser = () => {
  const { user } = useUser(); 
  const setUserStore = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!user) return;

    const userData = {
      userId: user.id,
      clerkUserId: user.id,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      email:
        (user as any).primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        '',
      imageUrl: (user as any).profileImageUrl || (user as any).imageUrl || undefined,
      isActive: true, // or map from user if available
      createdAt: (user as any).createdAt ? new Date((user as any).createdAt).toISOString() : new Date().toISOString(),
      updatedAt: (user as any).updatedAt ? new Date((user as any).updatedAt).toISOString() : undefined,
    };

    setUserStore(userData);

    apiClient.post(API_ENDPOINTS.users.sync, userData).catch((err) => {
      console.error("Error syncing user:", err);
    });
  }, [user, setUserStore]);
};

export function AppWrapper({ children }: { children: ReactNode }) {
  useSyncClerkUser();
  return <>{children}</>;
}
