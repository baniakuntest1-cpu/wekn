from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.customer import Customer, CustomerCreate, CustomerUpdate

router = APIRouter(prefix="/customers", tags=["customers"])

def setup_customer_routes(db: AsyncIOMotorDatabase):
    @router.get("", response_model=List[Customer])
    async def get_all_customers():
        customers = await db.customers.find({}, {"_id": 0}).to_list(1000)
        for customer in customers:
            if isinstance(customer.get('registered_date'), str):
                from datetime import datetime
                customer['registered_date'] = datetime.fromisoformat(customer['registered_date'])
        return customers
    
    @router.get("/search", response_model=List[Customer])
    async def search_customers(q: str):
        # Search by name or phone
        customers = await db.customers.find({
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"phone": {"$regex": q, "$options": "i"}}
            ]
        }, {"_id": 0}).to_list(100)
        
        for customer in customers:
            if isinstance(customer.get('registered_date'), str):
                from datetime import datetime
                customer['registered_date'] = datetime.fromisoformat(customer['registered_date'])
        return customers
    
    @router.get("/{customer_id}", response_model=Customer)
    async def get_customer(customer_id: str):
        customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        if isinstance(customer.get('registered_date'), str):
            from datetime import datetime
            customer['registered_date'] = datetime.fromisoformat(customer['registered_date'])
        return customer
    
    @router.post("", response_model=Customer)
    async def create_customer(customer_data: CustomerCreate):
        # Check if phone already exists
        existing = await db.customers.find_one({"phone": customer_data.phone})
        if existing:
            raise HTTPException(status_code=400, detail="Phone number already registered")
        
        customer = Customer(**customer_data.model_dump())
        doc = customer.model_dump()
        doc['registered_date'] = doc['registered_date'].isoformat()
        await db.customers.insert_one(doc)
        return customer
    
    @router.put("/{customer_id}", response_model=Customer)
    async def update_customer(customer_id: str, customer_data: CustomerUpdate):
        existing = await db.customers.find_one({"id": customer_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        update_data = {k: v for k, v in customer_data.model_dump().items() if v is not None}
        
        if update_data:
            await db.customers.update_one({"id": customer_id}, {"$set": update_data})
        
        updated_customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
        if isinstance(updated_customer.get('registered_date'), str):
            from datetime import datetime
            updated_customer['registered_date'] = datetime.fromisoformat(updated_customer['registered_date'])
        return updated_customer
    
    @router.delete("/{customer_id}")
    async def delete_customer(customer_id: str):
        result = await db.customers.delete_one({"id": customer_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        return {"message": "Customer deleted successfully"}
    
    return router
