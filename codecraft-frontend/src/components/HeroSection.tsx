"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Paperclip, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const gradientAnimation = {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
  };

  const gradientTransition = {
    rotate: {
      duration: 20,
      repeat: Infinity,
      ease: "linear" as const,
    },
    scale: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 text-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Gradients */}
      <motion.div
        animate={gradientAnimation}
        transition={gradientTransition}
        className="absolute top-[-20rem] right-[-20rem] w-[40rem] h-[40rem] bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={gradientAnimation}
        transition={{
          ...gradientTransition,
          delay: 2,
        }}
        className="absolute bottom-[-20rem] left-[-20rem] w-[40rem] h-[40rem] bg-gradient-to-tr from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={gradientAnimation}
        transition={{
          ...gradientTransition,
          delay: 4,
        }}
        className="absolute top-[10rem] left-[10rem] w-[30rem] h-[30rem] bg-gradient-to-br from-pink-400/15 via-violet-400/15 to-blue-400/15 rounded-full blur-2xl"
      />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-10 blur-sm"
      />
      <motion.div
        animate={{
          y: [10, -10, 10],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-sm"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full"
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.span>
              <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Introducing CodeCraft
              </span>
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Build Stunning
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              websites effortlessly
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            CodeCraft can create amazing websites with just a few lines of prompt.
            Experience the future of web development.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl overflow-hidden group shadow-xl"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Creating
                </span>
              </motion.button>
            </Link>
            <Link href="/workspace">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 font-semibold rounded-2xl hover:bg-white hover:shadow-lg transition-all"
              >
                View Workspace
              </motion.button>
            </Link>
          </motion.div>

          {/* Suggestion pills */}
          {/* <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mt-16 max-w-4xl mx-auto"
          >
            {[
              "Create a portfolio website",
              "Build an e-commerce store",
              "Design a landing page",
              "Make a restaurant website",
              "Create a ToDo App",
            ].map((text, index) => (
              <motion.button
                key={text}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md rounded-full px-6 py-3 text-sm font-medium text-gray-700 transition-all"
              >
                {text}
              </motion.button>
            ))}
          </motion.div> */}
        </motion.div>
      </main>
    </div>
  );
};

export { HeroSection };
