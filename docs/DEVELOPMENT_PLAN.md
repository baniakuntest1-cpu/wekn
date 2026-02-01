# 🛣️ WEEKN Development Plan

## Overview

Dokumen ini berisi rencana pengembangan lengkap untuk sistem WEEKN dari Phase 1 hingga Phase 6.

---

## 🎯 Phase Summary

| Phase | Nama | Estimasi | Status | Priority |
|-------|------|----------|--------|----------|
| 0 | MVP - Core POS System | - | ✅ **COMPLETED** | - |
| 1 | Multi-Store Foundation | 2-3 hari | 🔴 **PLANNED** | P0 |
| 2 | Production Management + Packing | 4-5 hari | 🔴 **PLANNED** | P0 |
| 3 | Stock Replenishment + Packing | 3-4 hari | 🔴 **PLANNED** | P1 |
| 4A | STRUK + Delivery Integration | 2-3 hari | 🔴 **PLANNED** | P1 |
| 4B | Customer PO + Packing | 4-5 hari | 🔴 **PLANNED** | P1 |
| 5 | Enhanced Reporting | 2-3 hari | 🔴 **PLANNED** | P2 |
| 6 | Return Management | 3-4 hari | 🔴 **PLANNED** | P2 |

**Total Estimasi**: 20-27 hari kerja

---

## ✅ Phase 0: MVP - Core POS System (COMPLETED)

### Features Implemented

1. **Core POS (Point of Sale)**
   - Product grid dengan search & filter
   - Shopping cart management
   - Split payment (cash + digital)
   - Transaction recording
   - Print receipt/invoice

2. **Product Management**
   - CRUD products (Create, Read, Update, Delete)
   - Product categories
   - Stock management
   - Barcode support

3. **Customer Management**
   - CRUD customers
   - Customer transaction history
   - Track total spent & transaction count
   - Customer integration in transaction flow

4. **Shift Management**
   - Open shift dengan opening cash
   - Track sales per shift
   - Close shift dengan cash reconciliation
   - Shift history
   - Active shift indicator di kasir page

5. **Discount & Promo**
   - Item-level discount (per produk)
   - Transaction-level discount (keseluruhan)
   - Percentage atau fixed amount

6. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Super Admin, Kasir)
   - Login page
   - Protected routes
   - User management (CRUD users)

7. **Reports & Dashboard**
   - Daily sales report
   - Product stock levels
   - Customer statistics
   - Transaction history

### Tech Stack
- Frontend: React 18
- Backend: FastAPI (Python)
- Database: MongoDB
- Auth: JWT with bcrypt password hashing

---

## 🟡 Phase 1: Multi-Store Foundation

**Priority**: P0 (Critical)
**Estimasi**: 2-3 hari
**Dependencies**: None

### Objectives

 Setup infrastruktur dasar untuk mendukung multiple stores dan pabrik

### Tasks

#### 1. Database Changes

**New Collection: `stores`**
```javascript
{
  id, name, type ("toko"/"pabrik"), 
  address, phone, coordinates, 
  is_active, created_at
}
```

**Update Existing Collections**: Tambah `store_id` ke:
- `products`
- `transactions`
- `shifts`
- `users`

**Migration Script**:
```javascript
// Create default store
db.stores.insertOne({
  id: "store-default",
  name: "WEEKN Main Store",
  type: "toko",
  // ...
});

// Update existing data
db.products.updateMany(
  { store_id: { $exists: false } },
  { $set: { store_id: "store-default" } }
);
```

#### 2. Backend Implementation

**New Files**:
- `/app/backend/models/store.py` - Store Pydantic model
- `/app/backend/routes/stores.py` - Store CRUD endpoints

**Update Files**:
- `/app/backend/models/product.py` - Add `store_id` field
- `/app/backend/models/transaction.py` - Add `store_id` field
- `/app/backend/models/shift.py` - Add `store_id` field
- `/app/backend/models/user.py` - Add `store_id` field

**API Endpoints**:
```
GET    /api/stores          - List all stores
POST   /api/stores          - Create new store
GET    /api/stores/:id      - Get store detail
PUT    /api/stores/:id      - Update store
DELETE /api/stores/:id      - Delete store (soft delete)
```

**Update Existing Endpoints**: Add `store_id` filter
```
GET /api/products?store_id=xxx
GET /api/transactions?store_id=xxx
GET /api/shifts?store_id=xxx
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/pages/StoresPage.js` - Store management page
- `/app/frontend/src/components/StoreSelector.js` - Store selector dropdown

**Update Files**:
- `/app/frontend/src/components/Sidebar.js` - Add store selector
- `/app/frontend/src/App.js` - Add store state management
- All pages - Add store filtering

**UI Components**:
1. **Store Selector** (di Navbar/Sidebar)
   - Dropdown pilih toko aktif
   - Store Super Admin: bisa akses semua toko
   - Store Kasir: fixed ke toko assigned

2. **Store Management Page**
   - Table list toko & pabrik
   - Form create/edit store
   - Modal konfirmasi delete
   - Map input untuk coordinates

#### 4. Testing

**Test Cases**:
- ✅ Create new store (toko & pabrik)
- ✅ List stores dengan filter by type
- ✅ Switch active store di selector
- ✅ Products filtered by selected store
- ✅ Transactions filtered by selected store
- ✅ Migration script: existing data tetap accessible
- ✅ User role: Super Admin dapat akses semua toko
- ✅ User role: Kasir hanya dapat akses toko assigned

**Testing Method**: Backend testing subagent + manual UI testing

#### 5. Backward Compatibility

- Data existing (Phase 0) tetap bisa diakses
- Default store auto-assigned ke data lama
- Tidak break existing functionality

### Deliverables

- ✅ Multi-store database structure
- ✅ Store CRUD functionality
- ✅ Store selector UI
- ✅ All existing features work dengan store filtering

---

## 🟡 Phase 2: Production Management + Packing + Damaged Tracking

**Priority**: P0 (Critical)
**Estimasi**: 4-5 hari
**Dependencies**: Phase 1

### Objectives

Pabrik dapat mengelola bahan baku, resep, dan produksi dengan tracking barang rusak dan packing workflow

### Tasks

#### 1. Database Changes

**New Collections**:
- `raw_materials` - Master bahan baku
- `recipes` - Resep produk (ingredients list)
- `production_orders` - Order produksi
- `damaged_goods` - Tracking barang rusak

(See DATABASE_SCHEMA.md untuk detail)

#### 2. Backend Implementation

**New Files**:
- `/app/backend/models/raw_material.py`
- `/app/backend/models/recipe.py`
- `/app/backend/models/production_order.py`
- `/app/backend/models/damaged_goods.py`
- `/app/backend/routes/raw_materials.py`
- `/app/backend/routes/recipes.py`
- `/app/backend/routes/production_orders.py`
- `/app/backend/routes/damaged_goods.py`

**Key Logic**:

1. **Recipe Creation**
```python
# Link product dengan bahan baku
recipe = {
    "product_id": "prod-001",
    "ingredients": [
        {"raw_material_id": "raw-001", "quantity": 2, "unit": "kg"},
        {"raw_material_id": "raw-002", "quantity": 1, "unit": "kg"}
    ]
}
```

2. **Production Order Flow**
```python
# Step 1: Create production order
production_order = {
    "product_id": "prod-001",
    "quantity_target": 100,
    "status": "pending"
}

# Step 2: Start production
update_status("in_production")

# Step 3: Complete production dengan input hasil
update({
    "quantity_produced": 95,
    "quantity_damaged": 5,
    "status": "quality_check"
})

# Step 4: Auto-deduct raw materials
for ingredient in recipe.ingredients:
    raw_material.stock -= (ingredient.quantity * quantity_good)

# Step 5: Auto-create damaged_goods record
if quantity_damaged > 0:
    damaged_goods.create({
        "product_id": product_id,
        "quantity": quantity_damaged,
        "source": "production",
        "source_id": production_order_id
    })

# Step 6: Update product stock (hanya yang bagus)
product.stock += quantity_good  # +95, bukan +100

# Step 7: Packing workflow
update_status("packing")
# Admin print packing slip
update({"packing_status": "packed", "status": "ready"})
```

**API Endpoints**:
```
# Raw Materials
GET    /api/raw-materials
POST   /api/raw-materials
PUT    /api/raw-materials/:id
DELETE /api/raw-materials/:id

# Recipes
GET    /api/recipes
GET    /api/recipes/by-product/:product_id
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id

# Production Orders
GET    /api/production-orders
POST   /api/production-orders
PUT    /api/production-orders/:id/status
POST   /api/production-orders/:id/complete  # Input hasil produksi
GET    /api/production-orders/:id/packing-slip  # Generate packing slip

# Damaged Goods
GET    /api/damaged-goods
GET    /api/damaged-goods/by-store/:store_id
POST   /api/damaged-goods
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/pages/RawMaterialsPage.js`
- `/app/frontend/src/pages/RecipesPage.js`
- `/app/frontend/src/pages/ProductionPage.js`
- `/app/frontend/src/pages/PackingPage.js`
- `/app/frontend/src/pages/DamagedGoodsPage.js`
- `/app/frontend/src/components/PackingSlip.js` - Printable packing slip

**UI Flows**:

1. **Raw Materials Management**
   - Table list bahan baku dengan stock level
   - Warning jika stock < min_stock
   - Form CRUD bahan baku

2. **Recipe Management**
   - List recipes by product
   - Form create recipe:
     - Select product
     - Add ingredients (select bahan baku + quantity)
     - Set yield quantity
   - Auto-calculate bahan baku needed untuk production order

3. **Production Order**
   - Form create production order:
     - Select product (auto-load recipe)
     - Input quantity target
     - Show bahan baku yang dibutuhkan
     - Warning jika bahan baku tidak cukup
   - Production order list dengan status workflow
   - Complete production form:
     - Input quantity produced
     - Input quantity damaged
     - Auto-calculate quantity good
   - Print packing slip button

4. **Packing Page**
   - List production orders dengan status "packing"
   - Button "Mark as Packed"
   - Print packing slip untuk team packing

5. **Damaged Goods Report**
   - List semua damaged goods
   - Filter by date, source, product
   - Chart: damaged goods trend

**Sidebar Menu Update** (untuk Factory role):
```
🏭 Pabrik
  ├─ Bahan Baku
  ├─ Resep
  ├─ Produksi
  ├─ Packing
  └─ Barang Rusak
```

#### 4. Testing

**Test Cases**:
- ✅ Create raw material
- ✅ Create recipe dengan multiple ingredients
- ✅ Create production order (check bahan baku sufficient)
- ✅ Complete production dengan damaged goods
- ✅ Verify: raw material stock berkurang
- ✅ Verify: product stock bertambah (quantity_good only)
- ✅ Verify: damaged_goods record created
- ✅ Print packing slip
- ✅ Update packing status
- ✅ Low stock alert untuk raw materials

**Testing Method**: Backend testing subagent

### Deliverables

- ✅ Raw materials management
- ✅ Recipe management
- ✅ Production order workflow
- ✅ Damaged goods tracking
- ✅ Packing workflow & packing slip
- ✅ Auto stock updates (raw materials & products)

---

## 🟡 Phase 3: Stock Replenishment + Packing

**Priority**: P1
**Estimasi**: 3-4 hari
**Dependencies**: Phase 1, Phase 2

### Objectives

Toko dapat order stok ke pabrik untuk 2 hari ke depan dengan packing workflow

### Tasks

#### 1. Database Changes

**New Collection**: `stock_orders`

(See DATABASE_SCHEMA.md)

#### 2. Backend Implementation

**New Files**:
- `/app/backend/models/stock_order.py`
- `/app/backend/routes/stock_orders.py`

**Key Logic**:
```python
# Step 1: Toko create stock order
stock_order = {
    "from_store_id": "store-001",
    "to_store_id": "factory-001",
    "items": [{"product_id": "prod-001", "quantity": 20}],
    "delivery_date": "2025-12-03",  # 2 hari ke depan
    "status": "pending"
}

# Step 2: Pabrik approve
update_status("approved")

# Step 3: Packing workflow
update_status("packing")
# Print packing slip
update({"packing_status": "packed", "status": "packed"})

# Step 4: In transit
update_status("in_transit")

# Step 5: Delivered - update stock
update_status("delivered")
for item in stock_order.items:
    # Kurangi stok pabrik
    factory_product.stock -= item.quantity
    # Tambah stok toko
    store_product.stock += item.quantity
```

**API Endpoints**:
```
GET    /api/stock-orders                  # List all (with filter)
GET    /api/stock-orders/from/:store_id   # Orders from specific store
GET    /api/stock-orders/to/:store_id     # Orders to specific store (factory)
POST   /api/stock-orders                  # Create new order
PUT    /api/stock-orders/:id/status       # Update status
GET    /api/stock-orders/:id/packing-slip # Generate packing slip
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/pages/StockOrdersPage.js` (for both Toko & Pabrik)

**UI Flows**:

1. **Toko - Create Stock Order**
   - Form:
     - Select products (multiple)
     - Input quantity per product
     - Select delivery date (min: 2 hari dari sekarang)
   - Show current stock level
   - Submit → Status: "pending"

2. **Toko - View Orders**
   - Table list orders dengan status
   - Filter by status, date
   - Track order status

3. **Pabrik - View Pending Orders**
   - List orders dengan status "pending"
   - Button "Approve" → status "approved"
   - Check stock availability before approve

4. **Pabrik - Packing**
   - List orders dengan status "packing"
   - Print packing slip untuk team packing
   - Button "Mark as Packed" → status "packed"

5. **Pabrik - Delivery**
   - List orders dengan status "packed"
   - Button "Ship" → status "in_transit"
   - Button "Delivered" → status "delivered" (update stock)

**Sidebar Menu Update**:
```
Toko:
  ├─ Pesan Stok ke Pabrik  (NEW)

Pabrik:
  ├─ Pesanan Stok dari Toko  (NEW)
```

#### 4. Testing

**Test Cases**:
- ✅ Toko create stock order
- ✅ Validation: delivery date min 2 hari
- ✅ Pabrik view pending orders
- ✅ Pabrik approve order
- ✅ Print packing slip
- ✅ Update packing status
- ✅ Mark as delivered
- ✅ Verify: stok pabrik berkurang
- ✅ Verify: stok toko bertambah
- ✅ Edge case: insufficient stock di pabrik

**Testing Method**: Backend testing subagent + Frontend testing subagent

### Deliverables

- ✅ Stock order creation (Toko)
- ✅ Stock order approval workflow (Pabrik)
- ✅ Packing workflow dengan packing slip
- ✅ Stock transfer logic
- ✅ Order tracking UI

---

## 🟡 Phase 4A: STRUK + Delivery Integration

**Priority**: P1
**Estimasi**: 2-3 hari
**Dependencies**: Phase 1

### Objectives

Integrasi delivery calculation ke existing transaction (STRUK) dengan Google Maps API

### Tasks

#### 1. Database Changes

**Update Collection**: `transactions`

Tambah fields:
- `delivery_enabled`
- `delivery_address`
- `delivery_coordinates`
- `delivery_distance_km`
- `delivery_method`
- `delivery_cost`
- `courier_name`
- `courier_phone`
- `delivery_notes`

(See DATABASE_SCHEMA.md)

#### 2. Backend Implementation

**New Files**:
- `/app/backend/routes/delivery.py` - Delivery calculation endpoint
- `/app/backend/utils/google_maps.py` - Google Maps API helper

**Update Files**:
- `/app/backend/models/transaction.py` - Add delivery fields

**Key Logic**:

1. **Google Maps Distance Calculation**
```python
import os
import httpx

async def calculate_distance(start_lat, start_lng, end_lat, end_lng):
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    url = f"https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": f"{start_lat},{start_lng}",
        "destinations": f"{end_lat},{end_lng}",
        "key": api_key
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        
    distance_meters = data["rows"][0]["elements"][0]["distance"]["value"]
    distance_km = distance_meters / 1000
    
    return distance_km
```

2. **Delivery Cost Calculation**
```python
def calculate_delivery_cost(distance_km, method):
    if method == "kurir_weekn":
        return distance_km * 3000  # Rp 3000 per km
    elif method == "ojek_online":
        # Manual input by kasir
        return None
    elif method == "pickup":
        return 0
```

**API Endpoints**:
```
POST /api/delivery/calculate-distance
# Body: {start: {lat, lng}, end: {lat, lng}}
# Response: {distance_km: 5.2, estimated_cost: 15600}
```

**Update Transaction Endpoint**:
```python
# POST /api/transactions
# Include delivery fields in request body
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/components/DeliveryModal.js` - Delivery form component

**Update Files**:
- `/app/frontend/src/components/PaymentModal.js` - Add delivery section

**UI Flow** (dalam PaymentModal):

1. **Delivery Toggle**
   - Checkbox: "Delivery / Antar?"
   - Jika checked → show delivery form

2. **Delivery Form**
   ```jsx
   <div className="delivery-section">
     <input placeholder="Alamat Pengiriman" />
     
     <div className="coordinates">
       <label>Titik Awal (Toko):</label>
       <input type="number" placeholder="Latitude" />
       <input type="number" placeholder="Longitude" />
       
       <label>Titik Akhir (Customer):</label>
       <input type="number" placeholder="Latitude" />
       <input type="number" placeholder="Longitude" />
     </div>
     
     <button onClick={calculateDistance}>Hitung Jarak</button>
     
     <div className="distance-result">
       <p>Jarak: {distance} km</p>
     </div>
     
     <div className="delivery-method">
       <input type="radio" name="method" value="kurir_weekn" />
       <label>Kurir WEEKN - Rp {estimatedCost}</label>
       
       <input type="radio" name="method" value="ojek_online" />
       <label>Ojek Online - Rp <input type="number" /></label>
       
       <input type="radio" name="method" value="pickup" />
       <label>Pickup (Customer Ambil)</label>
     </div>
     
     <input placeholder="Nama Kurir" />
     <input placeholder="No HP Kurir" />
     <textarea placeholder="Catatan Delivery" />
     
     <div className="total">
       <p>Subtotal: Rp {subtotal}</p>
       <p>Ongkir: Rp {deliveryCost}</p>
       <hr />
       <p><strong>TOTAL: Rp {total}</strong></p>
     </div>
   </div>
   ```

3. **Updated Invoice/Receipt**
   - Tambah line item untuk ongkir
   - Tampilkan info delivery (alamat, kurir, metode)

#### 4. Testing

**Test Cases**:
- ✅ Calculate distance via Google Maps API
- ✅ Auto-calculate ongkir untuk kurir WEEKN
- ✅ Manual input ongkir untuk ojek online
- ✅ Pickup (ongkir = 0)
- ✅ Transaction dengan delivery tersimpan lengkap
- ✅ Print receipt dengan info delivery
- ✅ Transaction tanpa delivery (backward compatible)
- ✅ Google Maps API error handling

**Testing Method**: Backend testing subagent + manual testing untuk Google Maps API

### Deliverables

- ✅ Google Maps API integration
- ✅ Distance & cost calculation
- ✅ Delivery form dalam payment modal
- ✅ Updated transaction model dengan delivery fields
- ✅ Print receipt dengan delivery info

---

## 🟡 Phase 4B: Customer PO + Packing

**Priority**: P1
**Estimasi**: 4-5 hari
**Dependencies**: Phase 1, Phase 2, Phase 4A

### Objectives

Customer dapat pesan produk custom ke pabrik dengan payment DP/full dan delivery

### Tasks

#### 1. Database Changes

**New Collection**: `customer_pos`

(See DATABASE_SCHEMA.md untuk detail lengkap)

#### 2. Backend Implementation

**New Files**:
- `/app/backend/models/customer_po.py`
- `/app/backend/routes/customer_pos.py`

**Key Logic**:

1. **Create Customer PO**
```python
customer_po = {
    "po_number": generate_po_number(),  # PO-YYYYMMDD-XXX
    "store_id": current_store_id,
    "customer_id": customer_id,
    "items": items,
    "subtotal": calculate_subtotal(),
    "delivery_cost": calculate_delivery_cost(),
    "total": subtotal + delivery_cost,
    "payment_type": "dp",  # or "full"
    "amount_paid": dp_amount,
    "remaining_payment": total - dp_amount,
    "status": "pending"
}
```

2. **Payment Flow**
```python
# Initial payment (DP or Full)
initial_payment = {
    "amount": amount_paid,
    "method": "cash",
    "paid_at": datetime.now(timezone.utc),
    "paid_by": kasir_name
}
customer_po["payment_history"].append(initial_payment)

# Additional payment (saat delivery/pickup)
additional_payment = {
    "amount": remaining_payment,
    "method": "cash",
    "paid_at": datetime.now(timezone.utc),
    "paid_by": kasir_name
}
customer_po["payment_history"].append(additional_payment)
customer_po["remaining_payment"] = 0
```

3. **Workflow**
```python
# Toko create PO → status: "pending"
# Pabrik approve → status: "approved"
# Create production order → link to customer_po
# Production selesai → status: "quality_check"
# Packing → status: "packing" → "packed"
# Out for delivery → status: "out_for_delivery"
# Delivered → status: "delivered"
# Payment complete → status: "completed"
```

**API Endpoints**:
```
GET    /api/customer-pos                    # List all (with filters)
GET    /api/customer-pos/by-store/:store_id # PO by store
GET    /api/customer-pos/:id                # Get PO detail
POST   /api/customer-pos                    # Create new PO
PUT    /api/customer-pos/:id/status         # Update status
POST   /api/customer-pos/:id/payment        # Add payment
GET    /api/customer-pos/:id/packing-slip   # Generate packing slip
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/pages/CustomerPOPage.js` (for Toko & Pabrik)
- `/app/frontend/src/components/CustomerPOForm.js`
- `/app/frontend/src/components/PaymentHistoryModal.js`

**UI Flows**:

1. **Toko - Create Customer PO**
   - Form:
     - Select/create customer
     - Input event date
     - Add products (multiple) dengan custom notes per item
     - Calculate subtotal
     - Delivery section (sama seperti STRUK - Phase 4A)
     - Calculate total (subtotal + ongkir)
     - Payment section:
       - Radio: DP atau Lunas
       - Jika DP: input amount
       - Show remaining payment
     - Submit → print PO slip

2. **Toko - View Customer PO List**
   - Table list PO dengan columns:
     - PO Number
     - Customer
     - Event Date
     - Total
     - Amount Paid
     - Remaining
     - Status
     - Actions
   - Filter by status, date
   - Action buttons:
     - "Bayar Sisa" (jika remaining > 0)
     - "Update Status"
     - "Print PO"
     - "View Detail"

3. **Pabrik - View Customer PO**
   - List PO yang perlu diproduksi
   - Filter by status
   - Button "Approve" → create production order
   - Link ke production order page
   - Button "Print Packing Slip"
   - Update status workflow

4. **Payment Modal**
   - Show payment history
   - Add additional payment
   - Show remaining payment

**Sidebar Menu Update**:
```
Toko:
  ├─ PO Customer  (NEW)

Pabrik:
  ├─ PO Customer dari Toko  (NEW)
```

#### 4. Testing

**Test Cases**:
- ✅ Create customer PO dengan DP
- ✅ Create customer PO dengan full payment
- ✅ Create customer PO dengan delivery (Google Maps API)
- ✅ Create customer PO tanpa delivery (pickup)
- ✅ Pabrik approve PO → create production order
- ✅ Production order complete → PO status update
- ✅ Print packing slip
- ✅ Update packing status
- ✅ Add additional payment (sisa bayar)
- ✅ Mark as delivered
- ✅ Mark as completed
- ✅ View payment history

**Testing Method**: Backend testing subagent + Frontend testing subagent

### Deliverables

- ✅ Customer PO creation dengan DP/full payment
- ✅ Customer PO workflow (toko → pabrik)
- ✅ Integration dengan production orders
- ✅ Delivery integration (reuse dari Phase 4A)
- ✅ Payment tracking (DP + additional payments)
- ✅ Packing workflow untuk customer PO
- ✅ Print packing slip untuk customer PO

---

## 🟡 Phase 5: Enhanced Reporting

**Priority**: P2
**Estimasi**: 2-3 hari
**Dependencies**: All previous phases

### Objectives

Enhanced reporting & analytics untuk semua stakeholders

### Tasks

#### 1. Backend Implementation

**Update Files**:
- `/app/backend/routes/reports.py` - Add new report endpoints

**New Report Endpoints**:
```
GET /api/reports/daily-sales?store_id=xxx&date=yyyy-mm-dd
GET /api/reports/inventory?store_id=xxx
GET /api/reports/production?start_date=xxx&end_date=xxx
GET /api/reports/stock-orders?start_date=xxx&end_date=xxx
GET /api/reports/customer-pos?start_date=xxx&end_date=xxx
GET /api/reports/delivery-performance?start_date=xxx&end_date=xxx
GET /api/reports/damaged-goods?start_date=xxx&end_date=xxx
GET /api/reports/raw-materials-usage?start_date=xxx&end_date=xxx
```

**Report Logic**:

1. **Daily Sales Report**
   - Total sales per store
   - Sales by product category
   - Sales by payment method
   - Sales with delivery vs pickup

2. **Inventory Report**
   - Current stock per product per store
   - Low stock alerts
   - Stock movement (in/out)

3. **Production Report**
   - Production volume
   - Production efficiency (target vs actual)
   - Damaged goods rate
   - Raw materials consumption

4. **Delivery Performance**
   - Kurir WEEKN vs Ojek Online usage
   - Average delivery cost
   - Delivery distance statistics

#### 2. Frontend Implementation

**Update Files**:
- `/app/frontend/src/pages/ReportsPage.js` - Enhance dengan charts & filters

**New Components**:
- Charts library: Chart.js atau Recharts

**Dashboard Updates**:

1. **Dashboard Toko**
   - Sales today
   - Pending customer PO
   - Low stock alerts
   - Delivery schedule today

2. **Dashboard Pabrik**
   - Production queue
   - Raw materials low stock
   - Pending stock orders from stores
   - Pending customer PO

3. **Reports Page**
   - Date range selector
   - Store selector (for multi-store reports)
   - Multiple chart types:
     - Line chart: Sales trend
     - Bar chart: Sales by category
     - Pie chart: Payment method distribution
     - Table: Top selling products

#### 3. Testing

**Test Cases**:
- ✅ Generate daily sales report
- ✅ Generate inventory report
- ✅ Generate production report
- ✅ Filter reports by date range
- ✅ Filter reports by store
- ✅ Export reports to PDF/Excel (optional)
- ✅ Dashboard real-time updates

**Testing Method**: Manual testing + Backend testing subagent untuk API

### Deliverables

- ✅ Enhanced dashboard (Toko & Pabrik)
- ✅ Multiple report types
- ✅ Charts & visualizations
- ✅ Export functionality (optional)

---

## 🟡 Phase 6: Return Management

**Priority**: P2
**Estimasi**: 3-4 hari
**Dependencies**: Phase 1, Phase 4B

### Objectives

Customer dapat retur barang dengan refund atau exchange

### Tasks

#### 1. Database Changes

**New Collection**: `returns`

(See DATABASE_SCHEMA.md)

#### 2. Backend Implementation

**New Files**:
- `/app/backend/models/return.py`
- `/app/backend/routes/returns.py`

**Key Logic**:

1. **Create Return**
```python
# Find original transaction or customer PO
original = find_transaction_or_po(reference_number)

return_record = {
    "return_number": generate_return_number(),
    "store_id": current_store_id,
    "original_transaction_id": original.id,
    "customer_name": original.customer_name,
    "items": selected_items,  # Items yang diretur
    "return_type": "refund",  # or "exchange"
    "total_return": calculate_total(),
    "status": "pending"
}
```

2. **Refund Logic**
```python
# Step 1: Manager approve return
update_status("approved")

# Step 2: Process refund
update_status("processed")
# Kembalikan uang ke customer (manual)

# Step 3: Stock adjustment
for item in return_items:
    if item.condition == "good":
        # Kembalikan ke stok
        product.stock += item.quantity
    elif item.condition == "damaged":
        # Catat sebagai damaged goods
        damaged_goods.create({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "source": "return",
            "source_id": return_id,
            "reason": item.reason
        })

# Step 4: Complete
update_status("completed")
```

3. **Exchange Logic**
```python
# Step 1-2: Same as refund

# Step 3: Create new transaction for exchange
exchange_transaction = create_transaction({
    "items": new_items,
    "total": 0,  # No payment (exchange)
    "notes": f"Exchange for return {return_number}"
})

return_record["exchange_transaction_id"] = exchange_transaction.id

# Step 4: Stock adjustment
# Return items (same as refund)
# New items (deduct stock)
```

**API Endpoints**:
```
GET    /api/returns
GET    /api/returns/by-store/:store_id
GET    /api/returns/:id
POST   /api/returns                       # Create return
PUT    /api/returns/:id/approve           # Manager approve
PUT    /api/returns/:id/process           # Process refund/exchange
GET    /api/transactions/:id/returnable   # Check if transaction can be returned
```

#### 3. Frontend Implementation

**New Files**:
- `/app/frontend/src/pages/ReturnsPage.js`
- `/app/frontend/src/components/ReturnModal.js`

**UI Flows**:

1. **Create Return Form**
   ```jsx
   <div>
     <input placeholder="Nomor Struk / PO" />
     <button onClick={searchTransaction}>Cari</button>
     
     {/* Show original transaction detail */}
     <div className="original-transaction">
       <p>Customer: {customer.name}</p>
       <p>Tanggal: {transaction.date}</p>
       <p>Total: {transaction.total}</p>
     </div>
     
     {/* Select items to return */}
     <div className="return-items">
       <h3>Pilih Produk yang Diretur:</h3>
       {transaction.items.map(item => (
         <div key={item.product_id}>
           <input type="checkbox" />
           <span>{item.product_name} - {item.quantity} pcs</span>
           <select>
             <option value="rusak">Rusak</option>
             <option value="kadaluarsa">Kadaluarsa</option>
             <option value="salah_produk">Salah Produk</option>
             <option value="lainnya">Lainnya</option>
           </select>
         </div>
       ))}
     </div>
     
     <p>Total Retur: Rp {totalReturn}</p>
     
     <div className="return-type">
       <input type="radio" name="type" value="refund" />
       <label>Refund (Kembalikan Uang)</label>
       
       <input type="radio" name="type" value="exchange" />
       <label>Tukar Barang</label>
     </div>
     
     <textarea placeholder="Catatan" />
     
     <button onClick={submitReturn}>Proses Retur</button>
   </div>
   ```

2. **Return List**
   - Table list returns
   - Columns: Return Number, Customer, Date, Total, Status, Actions
   - Filter by status, date
   - Action buttons:
     - "Approve" (for manager)
     - "Process" (refund/exchange)
     - "View Detail"

3. **Exchange Flow**
   - Jika return_type = "exchange":
     - Show product grid untuk pilih produk pengganti
     - Create new transaction
     - Link ke return record

**Sidebar Menu Update**:
```
Toko:
  ├─ Retur  (NEW)
```

#### 4. Testing

**Test Cases**:
- ✅ Search transaction by number
- ✅ Create return dengan multiple items
- ✅ Manager approve return
- ✅ Process refund
- ✅ Verify: stock bertambah (jika barang bagus)
- ✅ Verify: damaged_goods record created (jika rusak)
- ✅ Process exchange
- ✅ Verify: exchange transaction created
- ✅ Verify: stock adjustment (return + new items)
- ✅ Return from customer PO
- ✅ View return history

**Testing Method**: Backend testing subagent + Frontend testing subagent

### Deliverables

- ✅ Return creation (search transaction)
- ✅ Approval workflow
- ✅ Refund processing dengan stock adjustment
- ✅ Exchange processing dengan new transaction
- ✅ Integration dengan damaged_goods
- ✅ Return history & reporting

---

## 🛠️ Development Best Practices

### Code Organization

1. **Modular Development**
   - Setiap phase independent
   - Tidak break existing functionality
   - Clear separation of concerns

2. **Naming Conventions**
   - Collections: plural, lowercase (e.g., `products`, `stock_orders`)
   - Routes: RESTful (e.g., `/api/products/:id`)
   - Components: PascalCase (e.g., `ProductsPage.js`)
   - Functions: camelCase (e.g., `calculateTotal()`)

3. **Code Reusability**
   - Reuse components (e.g., delivery section di STRUK & PO)
   - Reuse utilities (e.g., Google Maps helper)
   - DRY principle

### Testing Strategy

1. **Test per Phase**
   - Complete phase testing sebelum lanjut ke phase berikutnya
   - Use testing subagent untuk comprehensive testing
   - Manual testing untuk UI/UX

2. **Test Coverage**
   - Backend: test semua API endpoints
   - Frontend: test critical user flows
   - Integration: test end-to-end workflows

3. **Test Documentation**
   - Update `/app/test_result.md` setelah setiap testing session
   - Document test cases & results

### Database Management

1. **Migration Strategy**
   - Always backward compatible
   - Use migration scripts untuk schema changes
   - Test migration pada development environment dulu

2. **Indexing**
   - Create indexes setelah collection created
   - Monitor query performance
   - Add indexes based on common queries

3. **Data Integrity**
   - Use Pydantic models untuk validation
   - Handle edge cases (e.g., insufficient stock)
   - Atomic operations untuk critical updates

### Git Workflow

1. **Branching**
   - `main`: production
   - `develop`: staging
   - `feature/phase-X-name`: feature branches

2. **Commits**
   - Clear commit messages
   - Commit per logical unit
   - Reference phase/task in commit message

3. **Documentation**
   - Update documentation setelah setiap phase
   - Keep README.md up to date
   - Document breaking changes

---

## 📝 Notes for Developers

### Common Pitfalls to Avoid

1. **MongoDB `_id` Handling**
   - Always exclude `_id` when fetching: `{"_id": 0}`
   - Use custom `id` field (String) instead

2. **Environment Variables**
   - Never hardcode URLs, keys, credentials
   - Always use `os.environ.get()` atau `process.env`

3. **DateTime**
   - Use `datetime.now(timezone.utc)` bukan `datetime.utcnow()`
   - Store as ISO 8601 string

4. **API Routes**
   - Always prefix dengan `/api`
   - Follow RESTful conventions

5. **Hot Reload**
   - Code changes auto-reload
   - Only restart supervisor untuk .env atau dependency changes

### Performance Tips

1. **Database Queries**
   - Use projection untuk limit fields returned
   - Use indexes untuk frequently queried fields
   - Paginate large result sets

2. **API Calls**
   - Cache frequently accessed data
   - Use parallel calls when possible
   - Handle errors gracefully

3. **Frontend**
   - Lazy load components
   - Debounce search inputs
   - Optimize images

---

## ✅ Phase Completion Checklist

Sebelum menganggap phase selesai, pastikan:

- [ ] All tasks completed
- [ ] Database schema updated & documented
- [ ] Backend API tested (testing subagent)
- [ ] Frontend UI tested (manual + testing subagent)
- [ ] Integration testing passed
- [ ] Documentation updated
- [ ] Code linted & formatted
- [ ] No breaking changes to existing features
- [ ] Git committed dengan clear message
- [ ] Ready for next phase

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Total Phases**: 7 (0-6)
**Status**: Phase 0 Complete, Phase 1-6 Planned
