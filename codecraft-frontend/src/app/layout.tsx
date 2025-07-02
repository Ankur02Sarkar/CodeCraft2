import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeCraft",
  description: "AI-powered code generation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="border-b">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-bold hover:opacity-80">
                  CodeCraft
                </Link>
                <SignedIn>
                  <nav className="flex items-center gap-4">
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="#"
                      className="text-sm font-medium hover:text-blue-600 transition-colors"
                    >
                      Projects
                    </Link>
                    <Link
                      href="#"
                      className="text-sm font-medium hover:text-blue-600 transition-colors"
                    >
                      Templates
                    </Link>
                  </nav>
                </SignedIn>
              </div>
              <div className="flex items-center gap-2">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
