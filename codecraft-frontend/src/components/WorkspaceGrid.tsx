"use client";

import { motion } from "framer-motion";
import { Plus, Globe, Code, Calendar, MoreVertical, MessageSquare, FileCode } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useBackendProject } from "@/hooks/useBackendProject";
import { Project } from "@/services/backendApi";
import { Id } from "../../convex/_generated/dataModel";

interface ProjectStats {
  total: number;
  thisWeek: number;
  published: number;
}

const WorkspaceGrid = () => {
  const { user } = useUser();
  const { projects, loadUserProjects, isLoading, error } = useBackendProject();
  const [stats, setStats] = useState<ProjectStats>({ total: 0, thisWeek: 0, published: 0 });

  // Load user projects on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserProjects(user.id as Id<'users'>);
    }
  }, [user?.id, loadUserProjects]);

  // Calculate stats when projects change
  useEffect(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekCount = projects.filter((project: Project) => {
      const createdAt = new Date(project.created_at);
      return createdAt >= oneWeekAgo;
    }).length;
    
    setStats({
      total: projects.length,
      thisWeek: thisWeekCount,
      published: projects.length // For now, consider all projects as published
    });
  }, [projects]);

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {/* Create New Project Card */}
        <motion.div variants={itemVariants}>
          <Link href="/create">
            <div className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer h-64 flex flex-col items-center justify-center">
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                <Plus size={48} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                Create New Project
              </h3>
              <p className="mt-2 text-sm text-gray-500 text-center px-4">
                Start building your next amazing website
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Project Cards */}
        {projects.map((project: Project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <Link href={`/workspace/${project.id}`}>
              <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-64 overflow-hidden">
                {/* Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <FileCode className="text-blue-400" size={24} />
                    <span className="text-sm text-blue-600 font-medium">
                      {Object.keys(project.files || {}).length} files
                    </span>
                  </div>
                  {project.chat_history && project.chat_history.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="text-green-400" size={16} />
                      <span className="text-xs text-green-600">
                        {project.chat_history.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-700 border-green-200">
                      Active
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Project Info */}
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description || 'No description available'}
                  </p>

                  {/* Last Modified */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    {formatTimeAgo(project.updated_at)}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export { WorkspaceGrid };