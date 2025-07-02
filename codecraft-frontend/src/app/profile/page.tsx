"use client";

import { UserProfile } from "@/components/UserProfile";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            User Management Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            This page demonstrates the integration between Clerk authentication and Convex database.
          </p>
        </div>

        <div className="flex justify-center">
          {isSignedIn ? (
            <SignOutButton>
              <Button variant="outline">Sign Out</Button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>

        <div className="flex justify-center">
          <UserProfile />
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">How it works:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">1. Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Users sign in through Clerk, which provides secure authentication
                and user management.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">2. Database Sync</h3>
              <p className="text-sm text-muted-foreground">
                When a user signs in, their data is automatically synced to the
                Convex database for application-specific storage.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">3. Backend API</h3>
              <p className="text-sm text-muted-foreground">
                FastAPI backend provides RESTful endpoints for user management
                operations that interact with the Convex database.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">4. Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Convex provides real-time updates, so user data changes are
                immediately reflected across the application.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            API Endpoints Available:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="font-mono bg-white p-2 rounded border">
              <span className="text-green-600 font-semibold">POST</span>{" "}
              /api/users/register - Register/update user
            </div>
            <div className="font-mono bg-white p-2 rounded border">
              <span className="text-blue-600 font-semibold">GET</span>{" "}
              /api/users/{'{clerk_id}'} - Get user by Clerk ID
            </div>
            <div className="font-mono bg-white p-2 rounded border">
              <span className="text-blue-600 font-semibold">GET</span>{" "}
              /api/users/ - Get all users
            </div>
            <div className="font-mono bg-white p-2 rounded border">
              <span className="text-red-600 font-semibold">DELETE</span>{" "}
              /api/users/{'{clerk_id}'} - Delete user
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}