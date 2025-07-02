import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  files?: ProjectFile[];
  chat_messages?: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface UseProjectReturn {
  // State
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  generateCode: (prompt: string, userId: Id<'users'>) => Promise<void>;
  createProject: (name: string, description: string | undefined, files: ProjectFile[] | undefined, userId: Id<'users'>) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  loadUserProjects: (userId: Id<'users'>) => void;
  updateFiles: (projectId: string, files: ProjectFile[]) => Promise<void>;
  sendChatMessage: (projectId: string, message: string, userId: Id<'users'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearError: () => void;
}

export const useProject = (): UseProjectReturn => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIdForQuery, setUserIdForQuery] = useState<Id<'users'> | undefined>(undefined);

  // Convex mutations
  const createProjectMutation = useMutation(api.projects.createProject);
  const updateProjectFilesMutation = useMutation(api.projects.updateProjectFiles);
  const addChatMessageMutation = useMutation(api.projects.addChatMessage);
  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  const generateCodeMutation = useMutation(api.projects.generateCode);

  // Convex queries
  const userProjects = useQuery(api.projects.getUserProjects, userIdForQuery ? { userId: userIdForQuery } : 'skip');
  const projects = userProjects || [];

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateCode = useCallback(async (prompt: string, userId: Id<'users'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateCodeMutation({ prompt, userId });
      // Load the generated project
      const newProject: Project = {
        id: response.project_id,
        name: response.name,
        description: response.description,
        files: response.files,
        chat_messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCurrentProject(newProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  }, [generateCodeMutation]);

  const createProject = useCallback(async (name: string, description: string | undefined, files: ProjectFile[] | undefined, userId: Id<'users'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const projectId = await createProjectMutation({ name, description, files, userId });
      const newProject: Project = {
        id: projectId,
        name,
        description,
        files: files || [],
        chat_messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCurrentProject(newProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  }, [createProjectMutation]);

  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Find project in the loaded projects
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [projects]);

  const loadUserProjects = useCallback((userId: Id<'users'>) => {
    setUserIdForQuery(userId);
  }, []);

  const updateFiles = useCallback(async (projectId: string, files: ProjectFile[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateProjectFilesMutation({ projectId: projectId as Id<'projects'>, files });
      // Update current project if it matches
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject({
          ...currentProject,
          files,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update files');
    } finally {
      setIsLoading(false);
    }
  }, [updateProjectFilesMutation, currentProject]);

  const sendChatMessage = useCallback(async (projectId: string, message: string, userId: Id<'users'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Add user message
      await addChatMessageMutation({
        projectId: projectId as Id<'projects'>,
        role: 'user',
        content: message,
        userId,
      });

      // Add AI response (mock for now)
      await addChatMessageMutation({
        projectId: projectId as Id<'projects'>,
        role: 'assistant',
        content: 'I understand your request. Let me help you with that.',
        userId: undefined,
      });

      // Update current project with new messages
      if (currentProject && currentProject.id === projectId) {
        const newMessages: ChatMessage[] = [
          {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: 'I understand your request. Let me help you with that.',
            timestamp: new Date().toISOString(),
          },
        ];
        setCurrentProject({
          ...currentProject,
          chat_messages: [...(currentProject.chat_messages || []), ...newMessages],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [addChatMessageMutation, currentProject]);

  const deleteProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProjectMutation({ projectId: projectId as Id<'projects'> });
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  }, [deleteProjectMutation, currentProject]);

  return {
    currentProject,
    projects,
    isLoading,
    error,
    generateCode,
    createProject,
    loadProject,
    loadUserProjects,
    updateFiles,
    sendChatMessage,
    deleteProject,
    clearError,
  };
};