from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
import uuid

class Shift(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cashier_name: str
    opening_cash: float
    opening_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    closing_cash: Optional[float] = None
    closing_time: Optional[datetime] = None
    expected_cash: Optional[float] = None
    actual_cash: Optional[float] = None
    discrepancy: Optional[float] = None
    total_sales: float = 0.0
    total_transactions: int = 0
    status: str = "open"  # open, closed

class ShiftCreate(BaseModel):
    cashier_name: str
    opening_cash: float

class ShiftClose(BaseModel):
    actual_cash: float
