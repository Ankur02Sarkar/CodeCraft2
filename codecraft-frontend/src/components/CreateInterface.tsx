"use client";

import { motion } from "framer-motion";
import { Send, Code, Play, Download, Settings, Sparkles, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const CreateInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm CodeCraft AI. I can help you build amazing websites. What would you like to create today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you create that! Let me generate the code for you. This might take a few moments...",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

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
          
          {isGenerating && (
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

        {/* Input */}
        <div className="p-6 border-t border-gray-200/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Describe what you want to build..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
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

        {/* Code Content */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-gray-900 rounded-xl overflow-hidden shadow-xl"
          >
            {/* Code Editor Mockup */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm ml-4">index.html</span>
            </div>
            
            <div className="p-6 text-gray-300 font-mono text-sm leading-relaxed">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="text-blue-400">&lt;!DOCTYPE html&gt;</div>
                <div className="text-blue-400">&lt;html lang="en"&gt;</div>
                <div className="ml-4">
                  <div className="text-blue-400">&lt;head&gt;</div>
                  <div className="ml-4 text-green-400">// Generated by CodeCraft AI</div>
                  <div className="ml-4 text-blue-400">&lt;title&gt;<span className="text-yellow-400">My Awesome Website</span>&lt;/title&gt;</div>
                  <div className="text-blue-400">&lt;/head&gt;</div>
                </div>
                <div className="ml-4">
                  <div className="text-blue-400">&lt;body&gt;</div>
                  <div className="ml-8 text-purple-400">&lt;div className="container"&gt;</div>
                  <div className="ml-12 text-blue-400">&lt;h1&gt;<span className="text-yellow-400">Welcome to the Future</span>&lt;/h1&gt;</div>
                  <div className="ml-12 text-blue-400">&lt;p&gt;<span className="text-yellow-400">Built with CodeCraft AI</span>&lt;/p&gt;</div>
                  <div className="ml-8 text-purple-400">&lt;/div&gt;</div>
                  <div className="text-blue-400">&lt;/body&gt;</div>
                </div>
                <div className="text-blue-400">&lt;/html&gt;</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Preview Section */}
        <div className="p-6 border-t border-gray-200/50 bg-white/80">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Preview</span>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                Welcome to the Future
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-gray-600"
              >
                Built with CodeCraft AI
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { CreateInterface };