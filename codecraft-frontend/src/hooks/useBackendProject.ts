import { useState, useCallback } from 'react';
import { backendApi, Project, ProjectFile, ChatMessage } from '@/services/backendApi';

export interface UseBackendProjectReturn {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  createProject: (title: string, initialPrompt?: string, template?: string, userClerkId?: string) => Promise<void>;
  loadUserProjects: (userClerkId: string) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  sendChatMessage: (projectId: string, message: string, userClerkId?: string) => Promise<void>;
  updateFiles: (projectId: string, files: ProjectFile[]) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearError: () => void;
}

export function useBackendProject(): UseBackendProjectReturn {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createProject = useCallback(async (
    title: string,
    initialPrompt?: string,
    template: string = 'react',
    userClerkId?: string
  ) => {
    if (!userClerkId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const project = await backendApi.createProject({
        title,
        description: initialPrompt ? `Generated from: ${initialPrompt}` : undefined,
        template,
        user_clerk_id: userClerkId,
        initial_prompt: initialPrompt,
      });

      setCurrentProject(project);
      
      // Refresh projects list
      await loadUserProjects(userClerkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserProjects = useCallback(async (userClerkId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userProjects = await backendApi.getUserProjects(userClerkId);
      setProjects(userProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const project = await backendApi.getProject(projectId);
      setCurrentProject(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (
    projectId: string,
    message: string,
    userClerkId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const chatResponse = await backendApi.chatWithProject(projectId, message);
      
      // If there are updated files in the response, update the current project immediately
      if (chatResponse.updated_files && currentProject) {
        const updatedProject = {
          ...currentProject,
          files: {
            ...currentProject.files,
            ...chatResponse.updated_files
          },
          chat_history: [
            ...currentProject.chat_history,
            {
              id: Date.now().toString(),
              content: message,
              sender: 'user' as const,
              timestamp: new Date().toISOString()
            },
            {
              id: (Date.now() + 1).toString(),
              content: chatResponse.message,
              sender: 'ai' as const,
              timestamp: chatResponse.timestamp
            }
          ],
          updated_at: new Date().toISOString()
        };
        setCurrentProject(updatedProject);
      } else {
        // Reload the project to get updated chat history
        await loadProject(projectId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [loadProject, currentProject]);

  const updateFiles = useCallback(async (projectId: string, files: ProjectFile[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert array to object format expected by backend
      const filesObject: Record<string, ProjectFile> = {};
      files.forEach(file => {
        filesObject[file.name] = file;
      });

      const updatedProject = await backendApi.updateProjectFiles(projectId, filesObject);
      setCurrentProject(updatedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await backendApi.deleteProject(projectId);
      
      // Remove from projects list
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Clear current project if it was deleted
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  return {
    currentProject,
    projects,
    isLoading,
    error,
    createProject,
    loadUserProjects,
    loadProject,
    sendChatMessage,
    updateFiles,
    deleteProject,
    clearError,
  };
}