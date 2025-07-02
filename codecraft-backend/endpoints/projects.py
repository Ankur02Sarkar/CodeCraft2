from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import uuid
from datetime import datetime

from models.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse,
    GenerateCodeRequest, GenerateCodeResponse,
    ChatRequest, ChatResponse, ProjectFile, ChatMessage
)
from services.project_service import ProjectService

router = APIRouter(prefix="/api/projects", tags=["projects"])
project_service = ProjectService()

# In-memory storage for demo (replace with Convex DB integration)
projects_db: Dict[str, Dict[str, Any]] = {}

@router.post("/generate", response_model=GenerateCodeResponse)
async def generate_code(request: GenerateCodeRequest):
    """Generate code based on user prompt"""
    try:
        response = await project_service.generate_code(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create", response_model=ProjectResponse)
async def create_project(request: ProjectCreate):
    """Create a new project"""
    try:
        project_id = str(uuid.uuid4())
        
        # Generate initial code if prompt provided
        initial_files = {}
        initial_chat = []
        
        if request.initial_prompt:
            # Generate code based on initial prompt
            gen_request = GenerateCodeRequest(
                prompt=request.initial_prompt,
                template=request.template
            )
            gen_response = await project_service.generate_code(gen_request)
            
            # Convert generated files to ProjectFile objects
            initial_files = project_service.convert_ai_files_to_project_files(gen_response.files)
            
            # Add initial chat messages
            initial_chat = [
                ChatMessage(
                    id=str(uuid.uuid4()),
                    content=request.initial_prompt,
                    sender="user",
                    timestamp=datetime.now()
                ),
                ChatMessage(
                    id=str(uuid.uuid4()),
                    content=gen_response.explanation,
                    sender="ai",
                    timestamp=datetime.now()
                )
            ]
        else:
            # Create default files for the template
            if request.template == "react":
                initial_files = {
                    "App.js": ProjectFile(
                        name="App.js",
                        content="export default function App() {\n  return <div>Hello World</div>;\n}",
                        language="javascript"
                    ),
                    "index.js": ProjectFile(
                        name="index.js",
                        content="import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);",
                        language="javascript"
                    )
                }
        
        # Create project
        project_data = {
            "id": project_id,
            "title": request.title,
            "description": request.description,
            "template": request.template,
            "files": {name: file.dict() for name, file in initial_files.items()},
            "chat_history": [msg.dict() for msg in initial_chat],
            "user_clerk_id": request.user_clerk_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        projects_db[project_id] = project_data
        
        return ProjectResponse(
            id=project_id,
            title=request.title,
            description=request.description,
            template=request.template,
            files=initial_files,
            chat_history=initial_chat,
            user_clerk_id=request.user_clerk_id,
            created_at=project_data["created_at"],
            updated_at=project_data["updated_at"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_clerk_id}", response_model=List[ProjectResponse])
async def get_user_projects(user_clerk_id: str):
    """Get all projects for a user"""
    try:
        user_projects = []
        for project_data in projects_db.values():
            if project_data["user_clerk_id"] == user_clerk_id:
                # Convert stored data back to response format
                files = {}
                for name, file_data in project_data["files"].items():
                    files[name] = ProjectFile(**file_data)
                
                chat_history = []
                for msg_data in project_data["chat_history"]:
                    chat_history.append(ChatMessage(**msg_data))
                
                user_projects.append(ProjectResponse(
                    id=project_data["id"],
                    title=project_data["title"],
                    description=project_data["description"],
                    template=project_data["template"],
                    files=files,
                    chat_history=chat_history,
                    user_clerk_id=project_data["user_clerk_id"],
                    created_at=project_data["created_at"],
                    updated_at=project_data["updated_at"]
                ))
        
        return user_projects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get a specific project"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = projects_db[project_id]
        
        # Convert stored data back to response format
        files = {}
        for name, file_data in project_data["files"].items():
            files[name] = ProjectFile(**file_data)
        
        chat_history = []
        for msg_data in project_data["chat_history"]:
            chat_history.append(ChatMessage(**msg_data))
        
        return ProjectResponse(
            id=project_data["id"],
            title=project_data["title"],
            description=project_data["description"],
            template=project_data["template"],
            files=files,
            chat_history=chat_history,
            user_clerk_id=project_data["user_clerk_id"],
            created_at=project_data["created_at"],
            updated_at=project_data["updated_at"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}/files", response_model=ProjectResponse)
async def update_project_files(project_id: str, request: ProjectUpdate):
    """Update project files"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = projects_db[project_id]
        
        # Update files
        for name, file in request.files.items():
            project_data["files"][name] = file.dict()
        
        project_data["updated_at"] = datetime.now()
        
        # Convert back to response format
        files = {}
        for name, file_data in project_data["files"].items():
            files[name] = ProjectFile(**file_data)
        
        chat_history = []
        for msg_data in project_data["chat_history"]:
            chat_history.append(ChatMessage(**msg_data))
        
        return ProjectResponse(
            id=project_data["id"],
            title=project_data["title"],
            description=project_data["description"],
            template=project_data["template"],
            files=files,
            chat_history=chat_history,
            user_clerk_id=project_data["user_clerk_id"],
            created_at=project_data["created_at"],
            updated_at=project_data["updated_at"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{project_id}/chat", response_model=ChatResponse)
async def chat_with_project(project_id: str, request: ChatRequest):
    """Chat about a project and potentially update files"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = projects_db[project_id]
        
        # Convert current files to ProjectFile objects
        current_files = {}
        for name, file_data in project_data["files"].items():
            current_files[name] = ProjectFile(**file_data)
        
        # Chat with AI
        chat_response = await project_service.chat_with_ai(request, current_files)
        
        # Add user message to chat history
        user_message = ChatMessage(
            id=str(uuid.uuid4()),
            content=request.message,
            sender="user",
            timestamp=datetime.now()
        )
        project_data["chat_history"].append(user_message.dict())
        
        # Add AI response to chat history
        ai_message = ChatMessage(
            id=str(uuid.uuid4()),
            content=chat_response.message,
            sender="ai",
            timestamp=chat_response.timestamp
        )
        project_data["chat_history"].append(ai_message.dict())
        
        # Update files if AI provided updates
        if chat_response.updated_files:
            for name, file in chat_response.updated_files.items():
                project_data["files"][name] = file.dict()
        
        project_data["updated_at"] = datetime.now()
        
        return chat_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        del projects_db[project_id]
        return {"message": "Project deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))