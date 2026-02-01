from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class PaymentMethod(BaseModel):
    method: str  # cash, qris, gopay, ovo, dana, shopeepay
    amount: float
    reference: Optional[str] = None  # Transaction reference number

class TransactionItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    subtotal: float

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[TransactionItem]
    subtotal: Optional[float] = None  # Optional for backward compatibility
    discount_amount: float = 0.0
    discount_type: Optional[str] = None  # percentage, nominal, none
    total: float  # After discount
    payment_methods: Optional[List[PaymentMethod]] = None  # Support split payment, optional for old data
    payment_method: Optional[str] = None  # Old field for backward compatibility
    cash_received: Optional[float] = None  # For backward compatibility
    change: Optional[float] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    cashier_name: str = "Kasir"
    customer_id: Optional[str] = None  # For member
    customer_name: Optional[str] = None

class TransactionCreate(BaseModel):
    items: List[TransactionItem]
    subtotal: float
    discount_amount: float = 0.0
    discount_type: Optional[str] = None
    total: float
    payment_methods: List[PaymentMethod]
    cash_received: Optional[float] = None
    change: Optional[float] = None
    cashier_name: str = "Kasir"
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None