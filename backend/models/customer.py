from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
import uuid

class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    registered_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total_transactions: int = 0
    total_spent: float = 0.0

class CustomerCreate(BaseModel):
    name: str
    phone: str

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
