from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class TransactionItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    subtotal: float

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[TransactionItem]
    total: float
    payment_method: str = "cash"
    cash_received: Optional[float] = None
    change: Optional[float] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    cashier_name: str = "Kasir"

class TransactionCreate(BaseModel):
    items: List[TransactionItem]
    total: float
    payment_method: str = "cash"
    cash_received: Optional[float] = None
    change: Optional[float] = None
    cashier_name: str = "Kasir"