"use client";

import { motion } from "framer-motion";
import { Plus, Globe, Code, Calendar, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: "published" | "draft" | "building";
  thumbnail?: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Dashboard",
    description: "Modern admin dashboard for online store management",
    lastModified: "2 hours ago",
    status: "published",
  },
  {
    id: "2",
    name: "Portfolio Website",
    description: "Personal portfolio with dark mode and animations",
    lastModified: "1 day ago",
    status: "draft",
  },
  {
    id: "3",
    name: "Blog Platform",
    description: "Full-stack blog with CMS and comment system",
    lastModified: "3 days ago",
    status: "building",
  },
  {
    id: "4",
    name: "Landing Page",
    description: "SaaS product landing page with pricing tiers",
    lastModified: "1 week ago",
    status: "published",
  },
];

const WorkspaceGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "building":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Your Workspace
          </h1>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              New Project
            </motion.button>
          </Link>
        </div>
        <p className="text-gray-600 text-lg">
          Manage and view all your created websites in one place
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-gray-600">Total Projects</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-gray-600">Published</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-gray-600">This Week</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          >
            {/* Project Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg"
                >
                  <Globe className="w-8 h-8 text-gray-700" />
                </motion.div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Modified {project.lastModified}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View →
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Project Card */}
        <Link href="/create">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl h-full min-h-[320px] flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full mb-4 group-hover:shadow-lg transition-all"
            >
              <Plus className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
            <p className="text-center px-6">
              Start building your next amazing website with CodeCraft AI
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export { WorkspaceGrid };