"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export function UserSync() {
  const { clerkUser, isClerkLoaded, isSignedIn, syncUser } = useUser();

  useEffect(() => {
    const handleUserSync = async () => {
      if (isClerkLoaded && isSignedIn && clerkUser) {
        try {
          await syncUser({
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            imageUrl: clerkUser.imageUrl || undefined,
          });
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      }
    };

    handleUserSync();
  }, [isClerkLoaded, isSignedIn, clerkUser, syncUser]);

  // This component doesn't render anything visible
  return null;
}