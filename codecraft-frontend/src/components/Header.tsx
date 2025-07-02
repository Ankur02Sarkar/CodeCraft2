"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Sparkles, Code2 } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-sm opacity-75"
                />
                <div className="relative bg-white p-2 rounded-lg">
                  <Code2 className="w-6 h-6 text-gray-800" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeCraft
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <SignedIn>
            <nav className="hidden md:flex items-center gap-8">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  href="/workspace"
                  className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors group"
                >
                  Workspace
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  href="/create"
                  className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors group"
                >
                  Create
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            </nav>
          </SignedIn>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignInButton>
                  <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignUpButton>
                  <button className="relative px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium rounded-full overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get Started
                    </span>
                  </button>
                </SignUpButton>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <UserButton />
              </motion.div>
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export { Header };