import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { UserSync } from "@/components/UserSync";
import { ConvexClientProvider } from "@/providers/ConvexProvider";
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
      <ConvexClientProvider>
        <UserSync />
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 min-h-screen`}
          >
            <Header />
            {children}
          </body>
        </html>
      </ConvexClientProvider>
      </ClerkProvider>
    );
  }
