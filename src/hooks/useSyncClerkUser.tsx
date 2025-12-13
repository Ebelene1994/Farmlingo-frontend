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
      id: user.id,
      email:
        
        (user as any).primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        undefined,
      name:
        (user as any).fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        undefined,
      avatarUrl:
       
        (user as any).profileImageUrl || (user as any).imageUrl || undefined,
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
