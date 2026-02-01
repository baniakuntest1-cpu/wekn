from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime
from models.transaction import Transaction, TransactionCreate

router = APIRouter(prefix="/transactions", tags=["transactions"])

def setup_transaction_routes(db: AsyncIOMotorDatabase):
    @router.post("", response_model=Transaction)
    async def create_transaction(transaction_data: TransactionCreate):
        transaction = Transaction(**transaction_data.model_dump())
        
        # Update stock for each item
        for item in transaction.items:
            product = await db.products.find_one({"id": item.product_id})
            if product:
                new_stock = product["stock"] - item.quantity
                await db.products.update_one(
                    {"id": item.product_id},
                    {"$set": {"stock": new_stock}}
                )
        
        # Update customer stats if customer_id provided
        if transaction.customer_id:
            await db.customers.update_one(
                {"id": transaction.customer_id},
                {
                    "$inc": {
                        "total_transactions": 1,
                        "total_spent": transaction.total
                    }
                }
            )
        
        # Save transaction
        doc = transaction.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        # Convert payment_methods to list of dicts
        doc['payment_methods'] = [pm.dict() if hasattr(pm, 'dict') else pm for pm in doc['payment_methods']]
        await db.transactions.insert_one(doc)
        
        return transaction
    
    @router.get("", response_model=List[Transaction])
    async def get_all_transactions():
        transactions = await db.transactions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
        for trans in transactions:
            if isinstance(trans['timestamp'], str):
                trans['timestamp'] = datetime.fromisoformat(trans['timestamp'])
        return transactions
    
    @router.get("/{transaction_id}", response_model=Transaction)
    async def get_transaction(transaction_id: str):
        transaction = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        if isinstance(transaction['timestamp'], str):
            transaction['timestamp'] = datetime.fromisoformat(transaction['timestamp'])
        return transaction
    
    return router