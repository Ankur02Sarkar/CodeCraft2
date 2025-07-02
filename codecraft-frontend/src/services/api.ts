const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  template: string;
  files: Record<string, ProjectFile>;
  chat_history: ChatMessage[];
  user_clerk_id: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateCodeRequest {
  prompt: string;
  project_id?: string;
  template?: string;
}

export interface GenerateCodeResponse {
  project_title: string;
  explanation: string;
  files: Record<string, { code: string }>;
  generated_files: string[];
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  template: string;
  user_clerk_id: string;
  initial_prompt?: string;
}

export interface ChatRequest {
  message: string;
  project_id: string;
}

export interface ChatResponse {
  message: string;
  sender: string;
  timestamp: string;
  updated_files?: Record<string, ProjectFile>;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Code generation
  async generateCode(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    return this.request<GenerateCodeResponse>('/api/projects/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Project management
  async createProject(request: CreateProjectRequest): Promise<Project> {
    return this.request<Project>('/api/projects/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getProject(projectId: string): Promise<Project> {
    return this.request<Project>(`/api/projects/${projectId}`);
  }

  async getUserProjects(userClerkId: string): Promise<Project[]> {
    return this.request<Project[]>(`/api/projects/user/${userClerkId}`);
  }

  async updateProjectFiles(projectId: string, files: Record<string, ProjectFile>): Promise<Project> {
    return this.request<Project>(`/api/projects/${projectId}/files`, {
      method: 'PUT',
      body: JSON.stringify({ files }),
    });
  }

  async deleteProject(projectId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Chat
  async chatWithProject(projectId: string, message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/api/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, project_id: projectId }),
    });
  }
}

export const apiService = new ApiService();