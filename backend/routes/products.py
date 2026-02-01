from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])

def setup_product_routes(db: AsyncIOMotorDatabase):
    @router.get("", response_model=List[Product])
    async def get_all_products():
        products = await db.products.find({}, {"_id": 0}).to_list(1000)
        return products
    
    @router.get("/{product_id}", response_model=Product)
    async def get_product(product_id: str):
        product = await db.products.find_one({"id": product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    
    @router.post("", response_model=Product)
    async def create_product(product_data: ProductCreate):
        product = Product(**product_data.model_dump())
        await db.products.insert_one(product.model_dump())
        return product
    
    @router.put("/{product_id}", response_model=Product)
    async def update_product(product_id: str, product_data: ProductUpdate):
        existing = await db.products.find_one({"id": product_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        update_data = {k: v for k, v in product_data.model_dump().items() if v is not None}
        
        if update_data:
            await db.products.update_one({"id": product_id}, {"$set": update_data})
        
        updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
        return updated_product
    
    @router.delete("/{product_id}")
    async def delete_product(product_id: str):
        result = await db.products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    
    @router.get("/category/{category}", response_model=List[Product])
    async def get_products_by_category(category: str):
        products = await db.products.find({"category": category}, {"_id": 0}).to_list(1000)
        return products
    
    return router