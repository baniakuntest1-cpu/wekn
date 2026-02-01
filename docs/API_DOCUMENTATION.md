# 🌐 WEEKN API Documentation

## Overview

Dokumentasi lengkap untuk semua API endpoints dalam sistem WEEKN.

**Base URL**: `{REACT_APP_BACKEND_URL}/api`

**Authentication**: Bearer Token (JWT) in Authorization header (kecuali login & setup)

---

## 📑 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Stores](#stores-phase-1)
- [Products](#products)
- [Transactions](#transactions)
- [Customers](#customers)
- [Shifts](#shifts)
- [Raw Materials](#raw-materials-phase-2)
- [Recipes](#recipes-phase-2)
- [Production Orders](#production-orders-phase-2)
- [Stock Orders](#stock-orders-phase-3)
- [Customer POs](#customer-pos-phase-4b)
- [Delivery](#delivery-phase-4a)
- [Returns](#returns-phase-6)
- [Damaged Goods](#damaged-goods-phase-2)
- [Reports](#reports)

---

## Authentication

### Setup Initial Admin

**Endpoint**: `POST /api/auth/setup`

**Description**: Create initial super admin user (one-time only)

**Authentication**: None

**Request Body**: None

**Response**:
```json
{
  "message": "Super admin created successfully",
  "user": {
    "id": "user-001",
    "email": "admin@weekn.com",
    "name": "Super Admin",
    "role": "Super Admin"
  },
  "credentials": {
    "email": "admin@weekn.com",
    "password": "admin123"
  }
}
```

---

### Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and get JWT token

**Authentication**: None

**Request Body**:
```json
{
  "email": "admin@weekn.com",
  "password": "admin123"
}
```

**Response** (Success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-001",
    "email": "admin@weekn.com",
    "name": "Super Admin",
    "role": "Super Admin",
    "store_id": "store-001"
  }
}
```

**Response** (Error):
```json
{
  "detail": "Invalid credentials"
}
```

**Example (curl)**:
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@weekn.com","password":"admin123"}'
```

---

### Verify Token

**Endpoint**: `GET /api/auth/verify`

**Description**: Verify if JWT token is valid

**Authentication**: Required

**Response**:
```json
{
  "valid": true,
  "user": {
    "id": "user-001",
    "email": "admin@weekn.com",
    "role": "Super Admin"
  }
}
```

---

## Users

### List Users

**Endpoint**: `GET /api/users`

**Description**: Get all users

**Authentication**: Required (Super Admin only)

**Response**:
```json
[
  {
    "id": "user-001",
    "email": "admin@weekn.com",
    "name": "Super Admin",
    "role": "Super Admin",
    "store_id": null,
    "created_at": "2025-12-01T10:00:00Z"
  },
  {
    "id": "user-002",
    "email": "kasir@weekn.com",
    "name": "Jane Doe",
    "role": "Kasir",
    "store_id": "store-001",
    "created_at": "2025-12-02T09:00:00Z"
  }
]
```

---

### Create User

**Endpoint**: `POST /api/users`

**Description**: Create new user

**Authentication**: Required (Super Admin only)

**Request Body**:
```json
{
  "email": "newuser@weekn.com",
  "password": "password123",
  "name": "New User",
  "role": "Kasir",
  "store_id": "store-001"
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-003",
    "email": "newuser@weekn.com",
    "name": "New User",
    "role": "Kasir",
    "store_id": "store-001"
  }
}
```

---

### Delete User

**Endpoint**: `DELETE /api/users/:id`

**Description**: Delete user by ID

**Authentication**: Required (Super Admin only)

**Response**:
```json
{
  "message": "User deleted successfully"
}
```

---

## Stores [PHASE 1]

### List Stores

**Endpoint**: `GET /api/stores`

**Description**: Get all stores/factories

**Authentication**: Required

**Query Parameters**:
- `type` (optional): Filter by type ("toko" or "pabrik")

**Response**:
```json
[
  {
    "id": "store-001",
    "name": "WEEKN Sudirman",
    "type": "toko",
    "address": "Jl. Sudirman No. 123",
    "phone": "021-12345678",
    "coordinates": {
      "lat": -6.2088,
      "lng": 106.8456
    },
    "is_active": true,
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

**Example**:
```bash
curl -X GET http://localhost:8001/api/stores?type=toko \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create Store

**Endpoint**: `POST /api/stores`

**Description**: Create new store/factory

**Authentication**: Required (Super Admin only)

**Request Body**:
```json
{
  "name": "WEEKN Menteng",
  "type": "toko",
  "address": "Jl. Menteng Raya No. 45",
  "phone": "021-98765432",
  "coordinates": {
    "lat": -6.1950,
    "lng": 106.8305
  }
}
```

**Response**:
```json
{
  "message": "Store created successfully",
  "store": {
    "id": "store-002",
    "name": "WEEKN Menteng",
    "type": "toko",
    "is_active": true
  }
}
```

---

### Update Store

**Endpoint**: `PUT /api/stores/:id`

**Description**: Update store information

**Authentication**: Required (Super Admin only)

**Request Body**:
```json
{
  "phone": "021-11111111",
  "is_active": false
}
```

**Response**:
```json
{
  "message": "Store updated successfully"
}
```

---

## Products

### List Products

**Endpoint**: `GET /api/products`

**Description**: Get all products

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store [PHASE 1]
- `category` (optional): Filter by category

**Response**:
```json
[
  {
    "id": "prod-001",
    "name": "Kue Ulang Tahun",
    "price": 250000,
    "category": "Cake",
    "stock": 10,
    "image_url": "https://example.com/cake.jpg",
    "barcode": "1234567890",
    "description": "Kue ulang tahun dengan krim butter",
    "store_id": "store-001",
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Create Product

**Endpoint**: `POST /api/products`

**Description**: Create new product

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Roti Coklat",
  "price": 15000,
  "category": "Bread",
  "stock": 50,
  "image_url": "https://example.com/bread.jpg",
  "barcode": "0987654321",
  "description": "Roti dengan isian coklat",
  "store_id": "store-001"
}
```

**Response**:
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "prod-002",
    "name": "Roti Coklat"
  }
}
```

---

### Update Product

**Endpoint**: `PUT /api/products/:id`

**Description**: Update product information

**Authentication**: Required

**Request Body**:
```json
{
  "price": 17000,
  "stock": 45
}
```

**Response**:
```json
{
  "message": "Product updated successfully"
}
```

---

### Delete Product

**Endpoint**: `DELETE /api/products/:id`

**Description**: Delete product (soft delete)

**Authentication**: Required

**Response**:
```json
{
  "message": "Product deleted successfully"
}
```

---

## Transactions

### List Transactions

**Endpoint**: `GET /api/transactions`

**Description**: Get all transactions

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store [PHASE 1]
- `shift_id` (optional): Filter by shift
- `start_date` (optional): Filter start date
- `end_date` (optional): Filter end date

**Response**:
```json
[
  {
    "id": "txn-20251201-001",
    "store_id": "store-001",
    "items": [
      {
        "product_id": "prod-001",
        "product_name": "Kue Ulang Tahun",
        "quantity": 2,
        "price": 250000,
        "subtotal": 500000
      }
    ],
    "subtotal": 500000,
    "discount": {
      "type": "percentage",
      "value": 10,
      "amount": 50000
    },
    "total": 465000,
    "payment_methods": [
      {
        "method": "cash",
        "amount": 465000
      }
    ],
    "customer_id": "cust-001",
    "customer_name": "John Doe",
    "cashier_name": "Jane",
    "shift_id": "shift-001",
    "delivery_enabled": true,
    "delivery_cost": 15000,
    "delivery_method": "kurir_weekn",
    "timestamp": "2025-12-01T14:30:00Z"
  }
]
```

---

### Create Transaction

**Endpoint**: `POST /api/transactions`

**Description**: Create new transaction (STRUK)

**Authentication**: Required

**Request Body**:
```json
{
  "store_id": "store-001",
  "items": [
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun",
      "quantity": 1,
      "price": 250000
    }
  ],
  "discount": {
    "type": "fixed",
    "value": 10000
  },
  "payment_methods": [
    {
      "method": "cash",
      "amount": 200000
    },
    {
      "method": "digital",
      "amount": 40000
    }
  ],
  "customer_id": "cust-001",
  "shift_id": "shift-001",
  "delivery_enabled": true,
  "delivery_address": "Jl. Merdeka No. 10",
  "delivery_coordinates": {
    "start": {"lat": -6.2088, "lng": 106.8456},
    "end": {"lat": -6.2000, "lng": 106.8200}
  },
  "delivery_distance_km": 5.2,
  "delivery_method": "kurir_weekn",
  "delivery_cost": 15600,
  "courier_name": "Budi",
  "courier_phone": "081234567890"
}
```

**Response**:
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "txn-20251201-002",
    "total": 255600
  }
}
```

---

### Get Transaction Detail

**Endpoint**: `GET /api/transactions/:id`

**Description**: Get transaction by ID

**Authentication**: Required

**Response**: Same as transaction object in list

---

## Customers

### List Customers

**Endpoint**: `GET /api/customers`

**Description**: Get all customers

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "cust-001",
    "name": "John Doe",
    "phone": "081234567890",
    "email": "john@example.com",
    "address": "Jl. Merdeka No. 10",
    "created_at": "2025-12-01T10:00:00Z",
    "total_spent": 5000000,
    "transaction_count": 15
  }
]
```

---

### Create Customer

**Endpoint**: `POST /api/customers`

**Description**: Create new customer

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Jane Smith",
  "phone": "081987654321",
  "email": "jane@example.com",
  "address": "Jl. Sudirman No. 99"
}
```

**Response**:
```json
{
  "message": "Customer created successfully",
  "customer": {
    "id": "cust-002",
    "name": "Jane Smith"
  }
}
```

---

### Update Customer

**Endpoint**: `PUT /api/customers/:id`

**Description**: Update customer information

**Authentication**: Required

**Request Body**:
```json
{
  "phone": "081111111111",
  "address": "New address"
}
```

---

### Delete Customer

**Endpoint**: `DELETE /api/customers/:id`

**Description**: Delete customer

**Authentication**: Required

**Response**:
```json
{
  "message": "Customer deleted successfully"
}
```

---

## Shifts

### Open Shift

**Endpoint**: `POST /api/shifts/open`

**Description**: Open new cashier shift

**Authentication**: Required

**Request Body**:
```json
{
  "store_id": "store-001",
  "kasir_name": "Jane",
  "opening_cash": 1000000
}
```

**Response**:
```json
{
  "message": "Shift opened successfully",
  "shift": {
    "id": "shift-001",
    "start_time": "2025-12-01T08:00:00Z",
    "status": "active"
  }
}
```

---

### Close Shift

**Endpoint**: `POST /api/shifts/:id/close`

**Description**: Close active shift

**Authentication**: Required

**Request Body**:
```json
{
  "closing_cash": 2500000
}
```

**Response**:
```json
{
  "message": "Shift closed successfully",
  "shift": {
    "id": "shift-001",
    "end_time": "2025-12-01T16:00:00Z",
    "opening_cash": 1000000,
    "closing_cash": 2500000,
    "expected_cash": 2450000,
    "difference": 50000,
    "total_sales": 1450000,
    "status": "closed"
  }
}
```

---

### Get Active Shift

**Endpoint**: `GET /api/shifts/active`

**Description**: Get currently active shift

**Authentication**: Required

**Query Parameters**:
- `store_id` (required): Store ID

**Response**:
```json
{
  "id": "shift-001",
  "store_id": "store-001",
  "kasir_name": "Jane",
  "start_time": "2025-12-01T08:00:00Z",
  "opening_cash": 1000000,
  "status": "active",
  "total_sales": 350000
}
```

---

### Get Shift History

**Endpoint**: `GET /api/shifts/history`

**Description**: Get shift history

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store [PHASE 1]
- `start_date` (optional): Filter start date
- `end_date` (optional): Filter end date

**Response**: Array of shift objects

---

## Raw Materials [PHASE 2]

### List Raw Materials

**Endpoint**: `GET /api/raw-materials`

**Description**: Get all raw materials

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "raw-001",
    "name": "Tepung Terigu",
    "stock": 50,
    "unit": "kg",
    "cost": 12000,
    "supplier": "PT. Supplier A",
    "min_stock": 10,
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Create Raw Material

**Endpoint**: `POST /api/raw-materials`

**Description**: Create new raw material

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "name": "Gula Pasir",
  "stock": 100,
  "unit": "kg",
  "cost": 15000,
  "supplier": "PT. Supplier B",
  "min_stock": 20
}
```

---

### Update Raw Material

**Endpoint**: `PUT /api/raw-materials/:id`

**Description**: Update raw material (typically for stock updates)

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "stock": 150,
  "cost": 16000
}
```

---

## Recipes [PHASE 2]

### List Recipes

**Endpoint**: `GET /api/recipes`

**Description**: Get all recipes

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "recipe-001",
    "product_id": "prod-001",
    "product_name": "Kue Ulang Tahun",
    "ingredients": [
      {
        "raw_material_id": "raw-001",
        "raw_material_name": "Tepung Terigu",
        "quantity": 2,
        "unit": "kg"
      },
      {
        "raw_material_id": "raw-002",
        "raw_material_name": "Gula Pasir",
        "quantity": 1,
        "unit": "kg"
      }
    ],
    "yield_quantity": 1,
    "yield_unit": "pcs",
    "notes": "Panggang 180C 30 menit",
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Get Recipe by Product

**Endpoint**: `GET /api/recipes/by-product/:product_id`

**Description**: Get recipe for specific product

**Authentication**: Required

**Response**: Single recipe object

---

### Create Recipe

**Endpoint**: `POST /api/recipes`

**Description**: Create new recipe

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "product_id": "prod-002",
  "ingredients": [
    {
      "raw_material_id": "raw-001",
      "quantity": 0.5,
      "unit": "kg"
    }
  ],
  "yield_quantity": 10,
  "yield_unit": "pcs",
  "notes": "Panggang 180C 15 menit"
}
```

---

## Production Orders [PHASE 2]

### List Production Orders

**Endpoint**: `GET /api/production-orders`

**Description**: Get all production orders

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status
- `packing_status` (optional): Filter by packing status

**Response**:
```json
[
  {
    "id": "prod-order-001",
    "product_id": "prod-001",
    "product_name": "Kue Ulang Tahun",
    "quantity_target": 100,
    "quantity_produced": 95,
    "quantity_damaged": 5,
    "quantity_good": 95,
    "status": "completed",
    "packing_status": "packed",
    "production_date": "2025-12-01T08:00:00Z",
    "completed_date": "2025-12-01T14:00:00Z"
  }
]
```

---

### Create Production Order

**Endpoint**: `POST /api/production-orders`

**Description**: Create new production order

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "product_id": "prod-001",
  "quantity_target": 100,
  "notes": "Produksi untuk stok"
}
```

**Response**:
```json
{
  "message": "Production order created successfully",
  "production_order": {
    "id": "prod-order-002",
    "status": "pending"
  }
}
```

---

### Complete Production Order

**Endpoint**: `POST /api/production-orders/:id/complete`

**Description**: Mark production as complete and input results

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "quantity_produced": 95,
  "quantity_damaged": 5
}
```

**Response**:
```json
{
  "message": "Production completed successfully",
  "production_order": {
    "quantity_good": 95,
    "status": "quality_check"
  }
}
```

**Backend Actions**:
- Deduct raw materials based on quantity_good
- Add product stock (quantity_good only)
- Create damaged_goods record if quantity_damaged > 0

---

### Update Production Status

**Endpoint**: `PUT /api/production-orders/:id/status`

**Description**: Update production order status

**Authentication**: Required (Factory Admin)

**Request Body**:
```json
{
  "status": "packing",
  "packing_status": "packed",
  "packed_by": "Team Packing"
}
```

---

### Get Packing Slip

**Endpoint**: `GET /api/production-orders/:id/packing-slip`

**Description**: Generate packing slip for printing

**Authentication**: Required

**Response**:
```json
{
  "production_order_id": "prod-order-001",
  "product_name": "Kue Ulang Tahun",
  "quantity": 95,
  "production_date": "2025-12-01",
  "packing_items": [
    {
      "product": "Kue Ulang Tahun",
      "quantity": 95,
      "unit": "pcs"
    }
  ]
}
```

---

## Stock Orders [PHASE 3]

### List Stock Orders

**Endpoint**: `GET /api/stock-orders`

**Description**: Get all stock orders

**Authentication**: Required

**Query Parameters**:
- `from_store_id` (optional): Filter by source store
- `to_store_id` (optional): Filter by destination (factory)
- `status` (optional): Filter by status

**Response**:
```json
[
  {
    "id": "stock-order-001",
    "order_number": "SO-20251201-001",
    "from_store_id": "store-001",
    "from_store_name": "WEEKN Sudirman",
    "to_store_id": "factory-001",
    "items": [
      {
        "product_id": "prod-001",
        "product_name": "Kue Ulang Tahun",
        "quantity": 20
      }
    ],
    "delivery_date": "2025-12-03",
    "status": "pending",
    "packing_status": "not_packed",
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Create Stock Order

**Endpoint**: `POST /api/stock-orders`

**Description**: Store creates stock order to factory

**Authentication**: Required

**Request Body**:
```json
{
  "from_store_id": "store-001",
  "to_store_id": "factory-001",
  "items": [
    {
      "product_id": "prod-001",
      "quantity": 20
    },
    {
      "product_id": "prod-002",
      "quantity": 50
    }
  ],
  "delivery_date": "2025-12-03",
  "notes": "Untuk stok weekend"
}
```

**Validation**:
- delivery_date must be at least 2 days from now

---

### Update Stock Order Status

**Endpoint**: `PUT /api/stock-orders/:id/status`

**Description**: Update stock order status

**Authentication**: Required (Factory Admin for approve/pack/ship, Store for receive)

**Request Body**:
```json
{
  "status": "approved"
}
```

**Status Flow**:
- `pending` → `approved` (Factory approves)
- `approved` → `packing` (Start packing)
- `packing` → `packed` (Packing complete)
- `packed` → `in_transit` (Shipped)
- `in_transit` → `delivered` (Received by store, triggers stock update)

**When status = "delivered"**:
- Backend auto-deduct factory stock
- Backend auto-add store stock

---

## Customer POs [PHASE 4B]

### List Customer POs

**Endpoint**: `GET /api/customer-pos`

**Description**: Get all customer purchase orders

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store
- `status` (optional): Filter by status
- `remaining_payment` (optional): Filter unpaid (> 0)

**Response**:
```json
[
  {
    "id": "cpo-001",
    "po_number": "PO-20251201-001",
    "store_id": "store-001",
    "customer_name": "John Doe",
    "customer_phone": "081234567890",
    "items": [
      {
        "product_id": "prod-001",
        "product_name": "Kue Ulang Tahun Custom",
        "quantity": 5,
        "price": 300000,
        "notes": "Tulisan: Happy Birthday Sarah"
      }
    ],
    "subtotal": 1500000,
    "delivery_cost": 15000,
    "total": 1515000,
    "payment_type": "dp",
    "amount_paid": 500000,
    "remaining_payment": 1015000,
    "event_date": "2025-12-05",
    "status": "in_production",
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Create Customer PO

**Endpoint**: `POST /api/customer-pos`

**Description**: Create customer purchase order

**Authentication**: Required

**Request Body**:
```json
{
  "store_id": "store-001",
  "customer_id": "cust-001",
  "customer_name": "John Doe",
  "customer_phone": "081234567890",
  "items": [
    {
      "product_id": "prod-001",
      "quantity": 5,
      "price": 300000,
      "notes": "Tulisan: Happy Birthday Sarah"
    }
  ],
  "event_date": "2025-12-05",
  "delivery_enabled": true,
  "delivery_address": "Jl. Merdeka No. 10",
  "delivery_coordinates": {
    "start": {"lat": -6.2088, "lng": 106.8456},
    "end": {"lat": -6.2000, "lng": 106.8200}
  },
  "delivery_distance_km": 5.0,
  "delivery_method": "kurir_weekn",
  "delivery_cost": 15000,
  "courier_name": "Budi",
  "payment_type": "dp",
  "amount_paid": 500000
}
```

---

### Update Customer PO Status

**Endpoint**: `PUT /api/customer-pos/:id/status`

**Description**: Update PO status

**Authentication**: Required

**Request Body**:
```json
{
  "status": "approved"
}
```

**Status Flow**:
- `pending` → `approved` (Factory approves)
- `approved` → `in_production` (Production starts)
- `in_production` → `quality_check` (Production complete)
- `quality_check` → `packing` (Ready for packing)
- `packing` → `packed` (Packing complete)
- `packed` → `out_for_delivery` (Shipped/delivering)
- `out_for_delivery` → `delivered` (Customer receives)
- `delivered` → `completed` (Payment complete)

---

### Add Payment

**Endpoint**: `POST /api/customer-pos/:id/payment`

**Description**: Add additional payment (sisa bayar)

**Authentication**: Required

**Request Body**:
```json
{
  "amount": 1015000,
  "method": "cash",
  "paid_by": "Jane (Kasir)"
}
```

**Response**:
```json
{
  "message": "Payment added successfully",
  "remaining_payment": 0
}
```

---

## Delivery [PHASE 4A]

### Calculate Distance

**Endpoint**: `POST /api/delivery/calculate-distance`

**Description**: Calculate delivery distance using Google Maps API

**Authentication**: Required

**Request Body**:
```json
{
  "start": {
    "lat": -6.2088,
    "lng": 106.8456
  },
  "end": {
    "lat": -6.2000,
    "lng": 106.8200
  }
}
```

**Response**:
```json
{
  "distance_km": 5.2,
  "duration_minutes": 15,
  "estimated_cost_weekn": 15600,
  "formula": "distance_km × 3000"
}
```

---

## Returns [PHASE 6]

### List Returns

**Endpoint**: `GET /api/returns`

**Description**: Get all returns

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store
- `status` (optional): Filter by status

**Response**:
```json
[
  {
    "id": "return-001",
    "return_number": "RTR-20251201-001",
    "store_id": "store-001",
    "original_transaction_id": "txn-20251130-001",
    "customer_name": "John Doe",
    "items": [
      {
        "product_id": "prod-001",
        "product_name": "Kue Ulang Tahun",
        "quantity": 1,
        "price": 250000,
        "reason": "rusak",
        "condition": "damaged"
      }
    ],
    "return_type": "refund",
    "total_return": 250000,
    "status": "pending",
    "created_at": "2025-12-01T10:00:00Z"
  }
]
```

---

### Create Return

**Endpoint**: `POST /api/returns`

**Description**: Create return request

**Authentication**: Required

**Request Body**:
```json
{
  "store_id": "store-001",
  "original_transaction_id": "txn-20251130-001",
  "customer_name": "John Doe",
  "customer_phone": "081234567890",
  "items": [
    {
      "product_id": "prod-001",
      "quantity": 1,
      "price": 250000,
      "reason": "rusak",
      "condition": "damaged"
    }
  ],
  "return_type": "refund",
  "notes": "Kue rusak saat pengiriman"
}
```

---

### Approve Return

**Endpoint**: `PUT /api/returns/:id/approve`

**Description**: Manager approves return

**Authentication**: Required (Manager/Admin only)

**Request Body**:
```json
{
  "approved": true,
  "notes": "Return approved"
}
```

---

### Process Return

**Endpoint**: `PUT /api/returns/:id/process`

**Description**: Process refund or exchange

**Authentication**: Required

**Request Body (for refund)**:
```json
{
  "action": "refund"
}
```

**Request Body (for exchange)**:
```json
{
  "action": "exchange",
  "exchange_items": [
    {
      "product_id": "prod-002",
      "quantity": 1,
      "price": 250000
    }
  ]
}
```

**Backend Actions**:
- For refund: Stock adjustment + damaged_goods record
- For exchange: Create new transaction + stock adjustments

---

## Damaged Goods [PHASE 2]

### List Damaged Goods

**Endpoint**: `GET /api/damaged-goods`

**Description**: Get all damaged goods records

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store
- `source` (optional): Filter by source (production, return, expired)
- `start_date` (optional): Filter start date
- `end_date` (optional): Filter end date

**Response**:
```json
[
  {
    "id": "damaged-001",
    "product_id": "prod-001",
    "product_name": "Kue Ulang Tahun",
    "quantity": 5,
    "source": "production",
    "source_id": "prod-order-001",
    "store_id": "factory-001",
    "reason": "Hasil produksi tidak sempurna",
    "recorded_by": "Factory Admin",
    "created_at": "2025-12-01T14:00:00Z"
  }
]
```

---

### Create Damaged Goods Record

**Endpoint**: `POST /api/damaged-goods`

**Description**: Manually create damaged goods record

**Authentication**: Required

**Request Body**:
```json
{
  "product_id": "prod-001",
  "quantity": 2,
  "source": "expired",
  "store_id": "store-001",
  "reason": "Produk kadaluarsa",
  "notes": "Expired date: 2025-11-30"
}
```

---

## Reports

### Daily Sales Report

**Endpoint**: `GET /api/reports/daily-sales`

**Description**: Get daily sales summary

**Authentication**: Required

**Query Parameters**:
- `store_id` (required): Store ID
- `date` (required): Date (YYYY-MM-DD)

**Response**:
```json
{
  "date": "2025-12-01",
  "store_id": "store-001",
  "store_name": "WEEKN Sudirman",
  "total_sales": 5000000,
  "total_transactions": 50,
  "payment_methods": {
    "cash": 3000000,
    "digital": 2000000
  },
  "top_products": [
    {
      "product_name": "Kue Ulang Tahun",
      "quantity_sold": 15,
      "revenue": 3750000
    }
  ],
  "with_delivery": 10,
  "without_delivery": 40
}
```

---

### Inventory Report

**Endpoint**: `GET /api/reports/inventory`

**Description**: Get current inventory status

**Authentication**: Required

**Query Parameters**:
- `store_id` (optional): Filter by store

**Response**:
```json
{
  "store_id": "store-001",
  "products": [
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun",
      "current_stock": 5,
      "min_stock": 10,
      "status": "low_stock"
    }
  ],
  "total_products": 50,
  "low_stock_count": 5
}
```

---

### Production Report

**Endpoint**: `GET /api/reports/production`

**Description**: Get production summary

**Authentication**: Required

**Query Parameters**:
- `start_date` (required): Start date
- `end_date` (required): End date

**Response**:
```json
{
  "period": {
    "start": "2025-12-01",
    "end": "2025-12-31"
  },
  "total_production_orders": 50,
  "total_produced": 4500,
  "total_damaged": 250,
  "damaged_rate": 5.5,
  "production_by_product": [
    {
      "product_name": "Kue Ulang Tahun",
      "quantity_produced": 1000,
      "quantity_damaged": 50
    }
  ]
}
```

---

## Error Responses

### Standard Error Format

All API errors follow this format:

```json
{
  "detail": "Error message here"
}
```

### Common HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

### Example Error Responses

**401 Unauthorized**:
```json
{
  "detail": "Invalid or expired token"
}
```

**403 Forbidden**:
```json
{
  "detail": "Insufficient permissions for this action"
}
```

**422 Validation Error**:
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Authentication Headers

For all authenticated endpoints, include:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example**:
```bash
curl -X GET http://localhost:8001/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Rate Limiting

**Current**: No rate limiting implemented

**Recommended for Production**:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Pagination

**Current**: Not implemented (returns all results)

**Recommended for Production**:
```
GET /api/products?page=1&limit=50
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 200,
    "pages": 4
  }
}
```

---

## Testing with curl

### Complete Workflow Example

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@weekn.com","password":"admin123"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# 2. Get products
curl -X GET http://localhost:8001/api/products \
  -H "Authorization: Bearer $TOKEN"

# 3. Open shift
curl -X POST http://localhost:8001/api/shifts/open \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"store_id":"store-001","kasir_name":"Jane","opening_cash":1000000}'

# 4. Create transaction
curl -X POST http://localhost:8001/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id":"store-001",
    "items":[{"product_id":"prod-001","product_name":"Kue","quantity":1,"price":250000}],
    "payment_methods":[{"method":"cash","amount":250000}],
    "shift_id":"shift-001"
  }'
```

---

**Document Version**: 1.0
**Last Updated**: December 2025
**API Version**: v1
