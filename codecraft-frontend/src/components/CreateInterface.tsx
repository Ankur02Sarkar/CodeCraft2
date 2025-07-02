"use client";

import { motion } from "framer-motion";
import { Send, Code, Play, Download, Settings, Sparkles, MessageSquare, Save } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useBackendProject } from "@/hooks/useBackendProject";
import { ProjectFile } from "@/services/backendApi";
import { useUser } from "@/hooks/useUser";
import Prompt from "@/context/Prompt";
import Lookup from "@/context/Lookup";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const CreateInterface = () => {
  const { user } = useUser();
  const {
    currentProject,
    isLoading,
    error,
    createProject,
    sendChatMessage,
    updateFiles,
    clearError
  } = useBackendProject();
  
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sandpackFiles, setSandpackFiles] = useState<Record<string, string>>(() => {
    const defaultFiles: Record<string, string> = {};
    Object.entries(Lookup.DEFAULT_FILE).forEach(([path, fileData]) => {
      defaultFiles[path] = fileData.code;
    });
    // Add default App.js if not present
    if (!defaultFiles["/App.js"]) {
      defaultFiles["/App.js"] = `export default function App() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to CodeCraft</h1>
      <p className="text-gray-600">Start chatting to generate your website!</p>
    </div>
  );
}`;
    }
    return defaultFiles;
  });

  // Convert project files to sandpack format
  useEffect(() => {
    if (currentProject?.files) {
      const files: Record<string, string> = {};
      Object.entries(currentProject.files).forEach(([filename, file]) => {
        files[`/${filename}`] = (file as ProjectFile).content;
      });
      setSandpackFiles(files);
    }
  }, [currentProject?.files]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    
    try {
      if (!currentProject) {
        // Create new project with initial prompt
        await createProject(
          "New Website",
          inputValue,
          "react",
          user.id
        );
      } else {
        // Send chat message to existing project
        await sendChatMessage(
          currentProject.id,
          inputValue,
          user.id
        );
      }
      setInputValue("");
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleFilesChange = useCallback(async (files: Record<string, string>) => {
    if (!currentProject) return;
    
    // Convert sandpack files back to ProjectFile format
    const projectFiles: Record<string, ProjectFile> = {};
    Object.entries(files).forEach(([path, content]) => {
      const filename = path.startsWith('/') ? path.slice(1) : path;
      const extension = filename.split('.').pop() || 'js';
      const languageMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'css': 'css',
        'html': 'html',
        'json': 'json'
      };
      
      projectFiles[filename] = {
        name: filename,
        content,
        language: languageMap[extension] || 'javascript'
      };
    });
    
    try {
      await updateFiles(currentProject.id, Object.values(projectFiles));
    } catch (err) {
      console.error('Failed to update files:', err);
    }
  }, [currentProject, updateFiles]);

  // Get messages from current project
  const messages = currentProject?.chat_history?.map((message: any) => ({
    id: message.id || Math.random().toString(),
    content: message.content,
    sender: message.sender as "user" | "ai",
    timestamp: new Date(message.timestamp)
  })) || [
    {
      id: "1",
      content: "Hello! I'm CodeCraft AI. I can help you build amazing websites. What would you like to create today?",
      sender: "ai" as const,
      timestamp: new Date(),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex"
    >
      {/* Chat Panel */}
      <motion.div
        variants={itemVariants}
        className="w-1/3 border-r border-gray-200/50 bg-white/80 backdrop-blur-sm flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">CodeCraft AI</h2>
              <p className="text-sm text-gray-600">Your AI coding assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 opacity-70`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                  />
                  <span className="text-sm text-gray-600">Generating code...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="p-6 border-t border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Start Ideas:</h3>
            <div className="grid grid-cols-1 gap-2">
              {Lookup.SUGGESTIONS.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInputValue(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-200/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.trim()) {
                  setShowSuggestions(false);
                }
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Code Editor Panel */}
      <motion.div
        variants={itemVariants}
        className="w-2/3 bg-gray-50/80 backdrop-blur-sm flex flex-col"
      >
        {/* Editor Header */}
        <div className="p-6 border-b border-gray-200/50 bg-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg"
              >
                <Code className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Code Editor</h2>
                <p className="text-sm text-gray-600">Live preview & editing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sandpack Code Editor */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full rounded-xl overflow-hidden shadow-xl"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 text-xs mt-2 underline"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            <Sandpack
              template="react"
              files={sandpackFiles}
              theme="dark"
              options={{
                showNavigator: true,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: 400,
                autorun: true,
                autoReload: true,
                bundlerURL: undefined
              }}
              customSetup={{
                dependencies: {
                  ...Lookup.DEPENDENCY,
                  "react": "^18.0.0",
                  "react-dom": "^18.0.0"
                }
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { CreateInterface };