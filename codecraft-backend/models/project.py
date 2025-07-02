from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

class ProjectFile(BaseModel):
    """Model for individual project files"""
    name: str
    content: str
    language: str = "javascript"

class ChatMessage(BaseModel):
    """Model for chat messages"""
    id: str
    content: str
    sender: str  # "user" or "ai"
    timestamp: datetime

class ProjectBase(BaseModel):
    """Base project model"""
    title: str
    description: Optional[str] = None
    template: str = "react"
    
class ProjectCreate(BaseModel):
    """Model for creating a new project"""
    title: str
    description: Optional[str] = None
    template: str = "react"
    user_clerk_id: str
    initial_prompt: Optional[str] = None

class ProjectUpdate(BaseModel):
    """Model for updating project files"""
    files: Dict[str, ProjectFile]
    
class ProjectResponse(BaseModel):
    """Model for project response"""
    id: str
    title: str
    description: Optional[str] = None
    template: str
    files: Dict[str, ProjectFile]
    chat_history: List[ChatMessage]
    user_clerk_id: str
    created_at: datetime
    updated_at: datetime
    
class GenerateCodeRequest(BaseModel):
    """Model for code generation request"""
    prompt: str
    project_id: Optional[str] = None
    template: str = "react"
    
class GenerateCodeResponse(BaseModel):
    """Model for code generation response"""
    project_title: str
    explanation: str
    files: Dict[str, Dict[str, str]]  # {filename: {"code": "..."}}
    generated_files: List[str]
    
class ChatRequest(BaseModel):
    """Model for chat request"""
    message: str
    project_id: str
    
class ChatResponse(BaseModel):
    """Model for chat response"""
    message: str
    sender: str
    timestamp: datetime
    updated_files: Optional[Dict[str, ProjectFile]] = None