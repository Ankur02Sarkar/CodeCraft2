import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from models.ai_model import GenAICodeClass
from models.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, 
    GenerateCodeRequest, GenerateCodeResponse,
    ChatRequest, ChatResponse, ProjectFile, ChatMessage
)

class ProjectService:
    """Service for handling project operations"""
    
    def __init__(self):
        self.ai_model = GenAICodeClass()
        
    async def generate_code(self, request: GenerateCodeRequest) -> GenerateCodeResponse:
        """Generate code using AI based on user prompt"""
        try:
            # Send message to AI model
            ai_response = self.ai_model.send_message(request.prompt)
            
            # Parse the JSON response from AI
            response_data = json.loads(ai_response)
            
            # Extract project information
            project_title = response_data.get("project_title", "Untitled Project")
            explanation = response_data.get("explanation", "")
            files_data = response_data.get("files", {})
            
            # Convert files to the expected format
            files = {}
            generated_files = []
            
            for filename, file_info in files_data.items():
                if isinstance(file_info, dict) and "code" in file_info:
                    files[filename] = {"code": file_info["code"]}
                    generated_files.append(filename)
                elif isinstance(file_info, str):
                    files[filename] = {"code": file_info}
                    generated_files.append(filename)
            
            return GenerateCodeResponse(
                project_title=project_title,
                explanation=explanation,
                files=files,
                generated_files=generated_files
            )
            
        except json.JSONDecodeError as e:
            # Fallback if AI doesn't return valid JSON
            return GenerateCodeResponse(
                project_title="Generated Project",
                explanation=f"Generated code based on: {request.prompt}",
                files={
                    "App.js": {"code": "// Generated code will appear here\nexport default function App() {\n  return <div>Hello World</div>;\n}"}
                },
                generated_files=["App.js"]
            )
        except Exception as e:
            raise Exception(f"Error generating code: {str(e)}")
    
    async def chat_with_ai(self, request: ChatRequest, current_files: Dict[str, ProjectFile]) -> ChatResponse:
        """Chat with AI about project modifications"""
        try:
            # Prepare context with current files
            files_context = "\n\nCurrent project files:\n"
            for filename, file_obj in current_files.items():
                files_context += f"\n{filename}:\n```{file_obj.language}\n{file_obj.content}\n```\n"
            
            # Create prompt with context
            full_prompt = f"{request.message}{files_context}\n\nPlease provide your response and any updated files in the same JSON format."
            
            # Send to AI
            ai_response = self.ai_model.send_message(full_prompt)
            
            # Parse response
            try:
                response_data = json.loads(ai_response)
                explanation = response_data.get("explanation", ai_response)
                files_data = response_data.get("files", {})
                
                # Convert updated files
                updated_files = {}
                for filename, file_info in files_data.items():
                    if isinstance(file_info, dict) and "code" in file_info:
                        # Determine language from file extension
                        language = self._get_language_from_filename(filename)
                        updated_files[filename] = ProjectFile(
                            name=filename,
                            content=file_info["code"],
                            language=language
                        )
                
                return ChatResponse(
                    message=explanation,
                    sender="ai",
                    timestamp=datetime.now(),
                    updated_files=updated_files if updated_files else None
                )
                
            except json.JSONDecodeError:
                # If not JSON, treat as plain text response
                return ChatResponse(
                    message=ai_response,
                    sender="ai",
                    timestamp=datetime.now(),
                    updated_files=None
                )
                
        except Exception as e:
            raise Exception(f"Error in chat: {str(e)}")
    
    def _get_language_from_filename(self, filename: str) -> str:
        """Determine programming language from file extension"""
        extension_map = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.css': 'css',
            '.html': 'html',
            '.json': 'json',
            '.md': 'markdown',
            '.py': 'python',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c'
        }
        
        for ext, lang in extension_map.items():
            if filename.endswith(ext):
                return lang
        
        return 'javascript'  # default
    
    def convert_ai_files_to_project_files(self, ai_files: Dict[str, Dict[str, str]]) -> Dict[str, ProjectFile]:
        """Convert AI response files to ProjectFile objects"""
        project_files = {}
        
        for filename, file_data in ai_files.items():
            if isinstance(file_data, dict) and "code" in file_data:
                language = self._get_language_from_filename(filename)
                project_files[filename] = ProjectFile(
                    name=filename,
                    content=file_data["code"],
                    language=language
                )
        
        return project_files