from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from typing import List
from models.user import UserCreate, UserUpdate, UserResponse, UserCreateResponse, UserErrorResponse
from services.user_service import ConvexUserService

router = APIRouter(prefix="/api/users", tags=["users"])

# Dependency to get user service
def get_user_service() -> ConvexUserService:
    return ConvexUserService()

@router.post(
    "/register",
    response_model=UserCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create or update a user in the Convex database using Clerk data"
)
async def register_user(
    user_data: UserCreate,
    user_service: ConvexUserService = Depends(get_user_service)
):
    """Register a new user or update existing user"""
    try:
        result = await user_service.create_or_update_user(user_data)
        
        if result["success"]:
            # Fetch the created/updated user data
            user_result = await user_service.get_user_by_clerk_id(user_data.clerk_id)
            
            if user_result["success"]:
                return UserCreateResponse(
                    message=result["message"],
                    user=UserResponse(**user_result["user"])
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User created but failed to fetch user data"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get(
    "/{clerk_id}",
    response_model=UserResponse,
    summary="Get user by Clerk ID",
    description="Retrieve a user from the database using their Clerk ID"
)
async def get_user(
    clerk_id: str,
    user_service: ConvexUserService = Depends(get_user_service)
):
    """Get user by Clerk ID"""
    try:
        result = await user_service.get_user_by_clerk_id(clerk_id)
        
        if result["success"]:
            return UserResponse(**result["user"])
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get(
    "/",
    response_model=List[UserResponse],
    summary="Get all users",
    description="Retrieve all users from the database (Admin function)"
)
async def get_all_users(
    user_service: ConvexUserService = Depends(get_user_service)
):
    """Get all users (Admin function)"""
    try:
        result = await user_service.get_all_users()
        
        if result["success"]:
            return [UserResponse(**user) for user in result["users"]]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.delete(
    "/{clerk_id}",
    summary="Delete user",
    description="Delete a user from the database using their Clerk ID"
)
async def delete_user(
    clerk_id: str,
    user_service: ConvexUserService = Depends(get_user_service)
):
    """Delete user by Clerk ID"""
    try:
        result = await user_service.delete_user(clerk_id)
        
        if result["success"]:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": result["message"], "success": True}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result["message"]
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get(
    "/health/check",
    summary="User service health check",
    description="Check if the user service is working properly"
)
async def user_service_health_check():
    """Health check for user service"""
    return {
        "service": "user_service",
        "status": "healthy",
        "message": "User service is running properly"
    }