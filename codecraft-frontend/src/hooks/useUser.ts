import { useUser as useClerkUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useUser = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useClerkUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const getUserByClerkId = useQuery(
    api.users.getUserByClerkId,
    isSignedIn && clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  // Auto-sync user data when Clerk user is loaded
  useEffect(() => {
    const syncUser = async () => {
      if (isClerkLoaded && isSignedIn && clerkUser) {
        try {
          await createOrUpdateUser({
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

    syncUser();
  }, [isClerkLoaded, isSignedIn, clerkUser, createOrUpdateUser]);

  return {
    // Clerk user data
    clerkUser,
    isClerkLoaded,
    isSignedIn,
    
    // Convex user data
    convexUser: getUserByClerkId,
    isConvexUserLoading: getUserByClerkId === undefined,
    
    // Combined user data
    user: getUserByClerkId ? {
      id: getUserByClerkId._id,
      clerkId: getUserByClerkId.clerkId,
      email: getUserByClerkId.email,
      firstName: getUserByClerkId.firstName,
      lastName: getUserByClerkId.lastName,
      imageUrl: getUserByClerkId.imageUrl,
      createdAt: new Date(getUserByClerkId.createdAt),
      updatedAt: new Date(getUserByClerkId.updatedAt),
    } as User : null,
    
    // Loading states
    isLoading: !isClerkLoaded || (isSignedIn && getUserByClerkId === undefined),
    
    // Actions
    syncUser: createOrUpdateUser,
  };
};