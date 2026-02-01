from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, timezone
from models.shift import Shift, ShiftCreate, ShiftClose

router = APIRouter(prefix="/shifts", tags=["shifts"])

def setup_shift_routes(db: AsyncIOMotorDatabase):
    @router.get("/active", response_model=Optional[Shift])
    async def get_active_shift():
        shift = await db.shifts.find_one({"status": "open"}, {"_id": 0})
        if shift:
            if isinstance(shift.get('opening_time'), str):
                shift['opening_time'] = datetime.fromisoformat(shift['opening_time'])
            if shift.get('closing_time') and isinstance(shift['closing_time'], str):
                shift['closing_time'] = datetime.fromisoformat(shift['closing_time'])
        return shift
    
    @router.post("/open", response_model=Shift)
    async def open_shift(shift_data: ShiftCreate):
        # Check if there's already an open shift
        existing = await db.shifts.find_one({"status": "open"})
        if existing:
            raise HTTPException(status_code=400, detail="Ada shift yang masih aktif. Tutup shift terlebih dahulu.")
        
        shift = Shift(**shift_data.model_dump())
        doc = shift.model_dump()
        doc['opening_time'] = doc['opening_time'].isoformat()
        await db.shifts.insert_one(doc)
        
        return shift
    
    @router.post("/{shift_id}/close", response_model=Shift)
    async def close_shift(shift_id: str, close_data: ShiftClose):
        shift = await db.shifts.find_one({"id": shift_id}, {"_id": 0})
        if not shift:
            raise HTTPException(status_code=404, detail="Shift tidak ditemukan")
        
        if shift['status'] == 'closed':
            raise HTTPException(status_code=400, detail="Shift sudah ditutup")
        
        # Get all transactions for this shift
        transactions = await db.transactions.find({"cashier_name": shift['cashier_name']}, {"_id": 0}).to_list(10000)
        
        # Filter transactions during shift time
        shift_start = datetime.fromisoformat(shift['opening_time']) if isinstance(shift['opening_time'], str) else shift['opening_time']
        shift_transactions = []
        total_sales = 0
        
        for trans in transactions:
            trans_time = trans['timestamp']
            if isinstance(trans_time, str):
                trans_time = datetime.fromisoformat(trans_time)
            
            if trans_time >= shift_start:
                shift_transactions.append(trans)
                total_sales += trans['total']
        
        # Calculate cash payments only
        cash_sales = 0
        for trans in shift_transactions:
            if trans.get('payment_methods'):
                for pm in trans['payment_methods']:
                    if pm['method'] == 'cash':
                        cash_sales += pm['amount']
            elif trans.get('payment_method') == 'cash':
                cash_sales += trans['total']
        
        expected_cash = shift['opening_cash'] + cash_sales
        actual_cash = close_data.actual_cash
        discrepancy = actual_cash - expected_cash
        
        # Update shift
        closing_time = datetime.now(timezone.utc)
        await db.shifts.update_one(
            {"id": shift_id},
            {
                "$set": {
                    "status": "closed",
                    "closing_time": closing_time.isoformat(),
                    "expected_cash": expected_cash,
                    "actual_cash": actual_cash,
                    "discrepancy": discrepancy,
                    "total_sales": total_sales,
                    "total_transactions": len(shift_transactions)
                }
            }
        )
        
        updated_shift = await db.shifts.find_one({"id": shift_id}, {"_id": 0})
        if isinstance(updated_shift.get('opening_time'), str):
            updated_shift['opening_time'] = datetime.fromisoformat(updated_shift['opening_time'])
        if updated_shift.get('closing_time') and isinstance(updated_shift['closing_time'], str):
            updated_shift['closing_time'] = datetime.fromisoformat(updated_shift['closing_time'])
        
        return updated_shift
    
    @router.get("", response_model=List[Shift])
    async def get_all_shifts():
        shifts = await db.shifts.find({}, {"_id": 0}).sort("opening_time", -1).to_list(1000)
        for shift in shifts:
            if isinstance(shift.get('opening_time'), str):
                shift['opening_time'] = datetime.fromisoformat(shift['opening_time'])
            if shift.get('closing_time') and isinstance(shift['closing_time'], str):
                shift['closing_time'] = datetime.fromisoformat(shift['closing_time'])
        return shifts
    
    @router.get("/{shift_id}", response_model=Shift)
    async def get_shift(shift_id: str):
        shift = await db.shifts.find_one({"id": shift_id}, {"_id": 0})
        if not shift:
            raise HTTPException(status_code=404, detail="Shift tidak ditemukan")
        
        if isinstance(shift.get('opening_time'), str):
            shift['opening_time'] = datetime.fromisoformat(shift['opening_time'])
        if shift.get('closing_time') and isinstance(shift['closing_time'], str):
            shift['closing_time'] = datetime.fromisoformat(shift['closing_time'])
        
        return shift
    
    return router
