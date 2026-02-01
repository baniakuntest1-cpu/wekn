from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.user import User, UserCreate, UserLogin, UserResponse, Token
from utils.auth import hash_password, verify_password, create_access_token, get_current_user, require_role
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["authentication"])

def setup_auth_routes(db: AsyncIOMotorDatabase):
    @router.post("/register", response_model=UserResponse)
    async def register_user(
        user_data: UserCreate,
        current_user: dict = Depends(require_role(["super_admin"]))
    ):
        """Register new user - Only super_admin can register users"""
        # Check if email already exists
        existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Validate role
        if user_data.role not in ["super_admin", "kasir"]:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'super_admin' or 'kasir'")
        
        # Create user
        user = User(
            email=user_data.email,
            name=user_data.name,
            role=user_data.role,
            hashed_password=hash_password(user_data.password)
        )
        
        doc = user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        
        return UserResponse(**user.model_dump())
    
    @router.post("/login", response_model=Token)
    async def login(login_data: UserLogin):
        """Login user"""
        user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(login_data.password, user['hashed_password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not user.get('is_active', True):
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user['id'], "email": user['email'], "role": user['role'], "name": user['name']}
        )
        
        # Parse datetime
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(**user)
        )
    
    @router.get("/me", response_model=UserResponse)
    async def get_current_user_info(current_user: dict = Depends(get_current_user)):
        """Get current user info from token"""
        user = await db.users.find_one({"id": current_user['sub']}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
        
        return UserResponse(**user)
    
    @router.get("/users", response_model=List[UserResponse])
    async def get_all_users(current_user: dict = Depends(require_role(["super_admin"]))):
        """Get all users - Only super_admin"""
        users = await db.users.find({}, {"_id": 0}).to_list(1000)
        
        for user in users:
            if isinstance(user.get('created_at'), str):
                user['created_at'] = datetime.fromisoformat(user['created_at'])
        
        return [UserResponse(**user) for user in users]
    
    @router.post("/init-admin")
    async def initialize_admin():
        """Initialize first super admin - only works if no users exist"""
        existing_users = await db.users.count_documents({})
        if existing_users > 0:
            raise HTTPException(status_code=400, detail="Admin already exists")
        
        # Create default super admin
        admin = User(
            email="admin@weekn.com",
            name="Super Admin",
            role="super_admin",
            hashed_password=hash_password("admin123")
        )
        
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
        
        return {
            "message": "Super admin created successfully",
            "email": "admin@weekn.com",
            "password": "admin123",
            "note": "Please change password after first login"
        }
    
    return router
