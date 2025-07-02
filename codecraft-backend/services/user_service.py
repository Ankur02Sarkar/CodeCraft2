import httpx
import os
from typing import Optional, Dict, Any
from datetime import datetime
from models.user import UserCreate, UserUpdate, UserResponse

class ConvexUserService:
    def __init__(self):
        self.convex_url = os.getenv("CONVEX_URL", "https://rare-greyhound-374.convex.cloud")
        self.convex_deployment = os.getenv("CONVEX_DEPLOYMENT", "dev:rare-greyhound-374")
    
    async def create_or_update_user(self, user_data: UserCreate) -> Dict[str, Any]:
        """Create or update user in Convex database"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "path": "users:createOrUpdateUser",
                    "args": {
                        "clerkId": user_data.clerk_id,
                        "email": user_data.email,
                        "firstName": user_data.first_name,
                        "lastName": user_data.last_name,
                        "imageUrl": user_data.image_url,
                    }
                }
                
                response = await client.post(
                    f"{self.convex_url}/api/mutation",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "user_id": result.get("value"),
                        "message": "User created/updated successfully"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Convex API error: {response.status_code}",
                        "message": "Failed to create/update user"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Internal server error"
            }
    
    async def get_user_by_clerk_id(self, clerk_id: str) -> Dict[str, Any]:
        """Get user by Clerk ID from Convex database"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "path": "users:getUserByClerkId",
                    "args": {"clerkId": clerk_id}
                }
                
                response = await client.post(
                    f"{self.convex_url}/api/query",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    user_data = result.get("value")
                    
                    if user_data:
                        return {
                            "success": True,
                            "user": {
                                "id": user_data.get("_id"),
                                "clerk_id": user_data.get("clerkId"),
                                "email": user_data.get("email"),
                                "first_name": user_data.get("firstName"),
                                "last_name": user_data.get("lastName"),
                                "image_url": user_data.get("imageUrl"),
                                "created_at": datetime.fromtimestamp(user_data.get("createdAt", 0) / 1000),
                                "updated_at": datetime.fromtimestamp(user_data.get("updatedAt", 0) / 1000),
                            }
                        }
                    else:
                        return {
                            "success": False,
                            "error": "User not found",
                            "message": "User with provided Clerk ID does not exist"
                        }
                else:
                    return {
                        "success": False,
                        "error": f"Convex API error: {response.status_code}",
                        "message": "Failed to fetch user"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Internal server error"
            }
    
    async def get_all_users(self) -> Dict[str, Any]:
        """Get all users from Convex database"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "path": "users:getAllUsers",
                    "args": {}
                }
                
                response = await client.post(
                    f"{self.convex_url}/api/query",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    users_data = result.get("value", [])
                    
                    users = []
                    for user_data in users_data:
                        users.append({
                            "id": user_data.get("_id"),
                            "clerk_id": user_data.get("clerkId"),
                            "email": user_data.get("email"),
                            "first_name": user_data.get("firstName"),
                            "last_name": user_data.get("lastName"),
                            "image_url": user_data.get("imageUrl"),
                            "created_at": datetime.fromtimestamp(user_data.get("createdAt", 0) / 1000),
                            "updated_at": datetime.fromtimestamp(user_data.get("updatedAt", 0) / 1000),
                        })
                    
                    return {
                        "success": True,
                        "users": users,
                        "count": len(users)
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Convex API error: {response.status_code}",
                        "message": "Failed to fetch users"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Internal server error"
            }
    
    async def delete_user(self, clerk_id: str) -> Dict[str, Any]:
        """Delete user from Convex database"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "path": "users:deleteUser",
                    "args": {"clerkId": clerk_id}
                }
                
                response = await client.post(
                    f"{self.convex_url}/api/mutation",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": result.get("value", {}).get("success", False),
                        "message": "User deleted successfully" if result.get("value", {}).get("success") else "User not found"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Convex API error: {response.status_code}",
                        "message": "Failed to delete user"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Internal server error"
            }