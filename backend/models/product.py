from pydantic import BaseModel, Field
from typing import Optional
import uuid

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    category: str
    stock: int
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    stock: int = 0
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None