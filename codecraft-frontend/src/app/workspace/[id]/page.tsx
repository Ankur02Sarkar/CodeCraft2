"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Code, Save, Play, Settings, Download } from "lucide-react";
import Link from "next/link";
import { 
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import { useBackendProject } from "@/hooks/useBackendProject";
import { Project, ChatMessage } from "@/services/backendApi";
import { useUser } from "@/hooks/useUser";
import Lookup from "@/context/Lookup";
import JSZip from "jszip";

interface SandpackFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

interface SandpackFiles {
  [key: string]: SandpackFile | string;
}

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { currentProject, loadProject, updateFiles, sendChatMessage, isLoading, error } = useBackendProject();
  const [chatInput, setChatInput] = useState("");
  const [sandpackFiles, setSandpackFiles] = useState<SandpackFiles>({});
  const [isChatLoading, setIsChatLoading] = useState(false);

  const projectId = params.id as string;

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  // Convert project files to Sandpack format
  useEffect(() => {
    if (currentProject?.files) {
      const files: SandpackFiles = {};
      Object.entries(currentProject.files).forEach(([filename, file]) => {
        // Normalize filename - ensure it starts with / for sandpack
        const normalizedPath = filename.startsWith('/') ? filename : `/${filename}`;
        files[normalizedPath] = {
          code: file.content,
          hidden: normalizedPath.includes('node_modules') || normalizedPath.includes('.git'),
        };
      });
      setSandpackFiles(files);
    }
  }, [currentProject]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !currentProject || !user) return;

    setIsChatLoading(true);
    try {
      await sendChatMessage(currentProject.id, chatInput);
      setChatInput("");
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFilesChange = async (files: SandpackFiles) => {
    if (!currentProject || !user) return;

    // Convert Sandpack files back to ProjectFile format
    const projectFiles = Object.entries(files).map(([path, file]) => {
      // Normalize filename by removing leading slash for consistency
      const filename = path.startsWith('/') ? path.slice(1) : path;
      return {
        name: filename,
        content: typeof file === 'string' ? file : file.code,
        language: getFileLanguage(path),
      };
    });

    try {
      await updateFiles(currentProject.id, projectFiles);
      setSandpackFiles(files);
    } catch (error) {
      console.error('Error updating files:', error);
    }
  };

  // Export function to download files as zip
  const handleExport = async () => {
    try {
      const zip = new JSZip();
      
      // Add all files from sandpackFiles to the zip
      Object.entries(sandpackFiles).forEach(([filePath, content]) => {
        // Remove leading slash for cleaner file structure in zip
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fileContent = typeof content === 'string' ? content : content.code;
        zip.file(cleanPath, fileContent);
      });
      
      // Add package.json if it doesn't exist
      if (!sandpackFiles['/package.json'] && !sandpackFiles['package.json']) {
        const packageJson = {
          "name": currentProject?.title?.toLowerCase().replace(/\s+/g, '-') || "codecraft-project",
          "version": "1.0.0",
          "private": true,
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.303.0"
          },
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
          },
          "devDependencies": {
            "react-scripts": "5.0.1"
          },
          "browserslist": {
            "production": [
              ">0.2%",
              "not dead",
              "not op_mini all"
            ],
            "development": [
              "last 1 chrome version",
              "last 1 firefox version",
              "last 1 safari version"
            ]
          }
        };
        zip.file('package.json', JSON.stringify(packageJson, null, 2));
      }
      
      // Add README.md
      const readmeContent = `# ${currentProject?.title || 'CodeCraft Project'}

This project was generated using CodeCraft AI.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

${Object.keys(sandpackFiles).map(file => `- ${file}`).join('\n')}

Enjoy coding! 🚀
`;
      zip.file('README.md', readmeContent);
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject?.title?.toLowerCase().replace(/\s+/g, '-') || 'codecraft-project'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export project:', error);
    }
  };

  const getFileLanguage = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
    };
    return languageMap[extension || ''] || 'text';
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
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50/40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Link href="/workspace" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/workspace" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{currentProject.title}</h1>
              <p className="text-sm text-gray-600">
                Last modified {formatTimeAgo(currentProject.updated_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </motion.button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Play size={16} />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Chat History
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentProject.chat_history?.map((message: ChatMessage, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTimeAgo(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for changes or improvements..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isChatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Code className="mr-2" size={20} />
                Code Editor
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {Object.keys(sandpackFiles).length} files
                </span>
                <button
                  onClick={() => handleFilesChange(sandpackFiles)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sandpack Editor */}
          <div className="flex-1">
            {Object.keys(sandpackFiles).length > 0 ? (
              <SandpackProvider
                template="react"
                theme="dark"
                files={sandpackFiles}
                options={{
                  autorun: true,
                  autoReload: true,
                  bundlerURL: undefined,
                  visibleFiles: Object.keys(sandpackFiles),
                  activeFile: Object.keys(sandpackFiles)[0] || "/App.js"
                }}
                customSetup={{
                  dependencies: {
                    ...Lookup.DEPENDENCY,
                    "react": "^18.0.0",
                    "react-dom": "^18.0.0"
                  }
                }}
              >
                <SandpackLayout style={{width:"100%"}}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', width:"50%", overflow:"scroll" }}>
                    <SandpackFileExplorer style={{ height: '200px', borderBottom: '1px solid #333' }} />
                    <SandpackCodeEditor
                      style={{ flex: 1, overflowY : "scroll" }}
                      showTabs={true}
                      closableTabs={true}
                      showLineNumbers={true}
                      showInlineErrors={true}
                      wrapContent={true}
                    />
                  </div>
                  <SandpackPreview
                    style={{height:"80vh", width:"50%"}}
                    showNavigator={true}
                    showRefreshButton={true}
                  />
                </SandpackLayout>
              </SandpackProvider>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Files Found</h3>
                  <p className="text-gray-600">This project doesn&apos;t have any files yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;