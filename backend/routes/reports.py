from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, timedelta
from typing import Dict, List

router = APIRouter(prefix="/reports", tags=["reports"])

def setup_report_routes(db: AsyncIOMotorDatabase):
    @router.get("/daily")
    async def get_daily_report():
        # Get today's date range
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)
        
        # Get all transactions today
        transactions = await db.transactions.find({}, {"_id": 0}).to_list(10000)
        
        today_transactions = []
        for trans in transactions:
            trans_date = trans['timestamp']
            if isinstance(trans_date, str):
                trans_date = datetime.fromisoformat(trans_date)
            
            if today <= trans_date < tomorrow:
                today_transactions.append(trans)
        
        # Calculate statistics
        total_sales = sum(t['total'] for t in today_transactions)
        total_transactions = len(today_transactions)
        
        # Product sales summary
        product_sales = {}
        for trans in today_transactions:
            for item in trans['items']:
                product_id = item['product_id']
                if product_id not in product_sales:
                    product_sales[product_id] = {
                        "product_name": item['product_name'],
                        "quantity": 0,
                        "revenue": 0
                    }
                product_sales[product_id]['quantity'] += item['quantity']
                product_sales[product_id]['revenue'] += item['subtotal']
        
        return {
            "date": today.isoformat(),
            "total_sales": total_sales,
            "total_transactions": total_transactions,
            "average_transaction": total_sales / total_transactions if total_transactions > 0 else 0,
            "product_sales": list(product_sales.values()),
            "transactions": today_transactions
        }
    
    @router.get("/products/low-stock")
    async def get_low_stock_products(threshold: int = 10):
        products = await db.products.find(
            {"stock": {"$lte": threshold}},
            {"_id": 0}
        ).to_list(1000)
        return products
    
    return router