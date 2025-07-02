"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfile() {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const convexUser = useQuery(
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

  if (!isClerkLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = clerkUser?.firstName && clerkUser?.lastName 
    ? `${clerkUser.firstName} ${clerkUser.lastName}`
    : clerkUser?.firstName || clerkUser?.lastName || "User";

  const initials = displayName
    .split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Profile
          <div className="flex gap-2">
            <Badge variant="secondary">Clerk</Badge>
            {convexUser && <Badge variant="default">Convex</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={clerkUser?.imageUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              {clerkUser?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Clerk ID:</span>
            <span className="font-mono text-xs">{clerkUser?.id}</span>
          </div>
          
          {convexUser && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Convex ID:</span>
                <span className="font-mono text-xs">{convexUser._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-xs">
                  {new Date(convexUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated:</span>
                <span className="text-xs">
                  {new Date(convexUser.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </>
          )}
          
          {!convexUser && (
            <div className="text-sm text-muted-foreground">
              Syncing with database...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}