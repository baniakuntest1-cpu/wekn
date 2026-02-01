# 🗃️ WEEKN Database Schema Documentation

## Overview

WEEKN menggunakan MongoDB sebagai database utama. Dokumen ini menjelaskan schema untuk setiap collection.

## 📊 Collections List

### Phase 0 (Completed)
1. **products** - Master produk
2. **transactions** - Transaksi penjualan
3. **customers** - Data customer
4. **shifts** - Data shift kasir
5. **users** - User & authentication

### Phase 1-6 (Planned)
6. **stores** - Master toko & pabrik
7. **raw_materials** - Bahan baku
8. **recipes** - Resep produk
9. **production_orders** - Order produksi
10. **stock_orders** - Order stok toko ke pabrik
11. **customer_pos** - Purchase order dari customer
12. **returns** - Return/retur barang
13. **damaged_goods** - Tracking barang rusak

---

## 📎 Collection Schemas

### 1. products

**Purpose**: Master data produk bakery

```javascript
{
  "id": "prod-001",                    // String, unique ID
  "name": "Kue Ulang Tahun",          // String, nama produk
  "price": 250000,                    // Number, harga jual
  "category": "Cake",                 // String, kategori
  "stock": 10,                        // Number, jumlah stok
  "image_url": "https://...",        // String, URL gambar produk
  "barcode": "1234567890",           // String, barcode (optional)
  "description": "Kue ulang tahun...",// String, deskripsi
  "store_id": "store-001",           // String, ID toko [PHASE 1]
  "created_at": "2025-12-01T10:00:00Z" // ISO DateTime
}
```

**Indexes**:
```javascript
db.products.createIndex({ "id": 1 }, { unique: true })
db.products.createIndex({ "store_id": 1, "name": 1 })      // [PHASE 1]
db.products.createIndex({ "store_id": 1, "category": 1 })  // [PHASE 1]
```

---

### 2. transactions

**Purpose**: Record transaksi penjualan (STRUK)

```javascript
{
  "id": "txn-20251201-001",          // String, unique transaction ID
  "store_id": "store-001",           // String, ID toko [PHASE 1]
  "items": [                         // Array of items
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun",
      "quantity": 2,
      "price": 250000,
      "subtotal": 500000
    }
  ],
  "subtotal": 500000,                // Number, total sebelum diskon
  "discount": {
    "type": "percentage",            // "percentage" | "fixed"
    "value": 10,                     // 10% atau Rp 10000
    "amount": 50000                  // Jumlah diskon dalam rupiah
  },
  "total": 450000,                   // Number, total setelah diskon
  "payment_methods": [               // Array of payment methods
    {
      "method": "cash",              // "cash" | "digital"
      "amount": 450000
    }
  ],
  "customer_id": "cust-001",        // String, ID customer (optional)
  "customer_name": "John Doe",      // String, nama customer (optional)
  "cashier_name": "Jane",           // String, nama kasir
  "shift_id": "shift-001",          // String, ID shift
  
  // Delivery fields [PHASE 4A]
  "delivery_enabled": true,          // Boolean, apakah pakai delivery
  "delivery_address": "Jl. Merdeka No. 10", // String
  "delivery_coordinates": {          // Object
    "start": {"lat": -6.2088, "lng": 106.8456}, // Toko
    "end": {"lat": -6.2000, "lng": 106.8200}    // Customer
  },
  "delivery_distance_km": 5.2,       // Number, jarak dalam km
  "delivery_method": "kurir_weekn",  // "kurir_weekn" | "ojek_online" | "pickup"
  "delivery_cost": 15600,            // Number, biaya ongkir (3000/km)
  "courier_name": "Budi",            // String, nama kurir
  "courier_phone": "081234567890",   // String, no HP kurir
  "delivery_notes": "Hati-hati",     // String, catatan delivery
  
  "timestamp": "2025-12-01T14:30:00Z" // ISO DateTime
}
```

**Indexes**:
```javascript
db.transactions.createIndex({ "id": 1 }, { unique: true })
db.transactions.createIndex({ "store_id": 1, "timestamp": -1 }) // [PHASE 1]
db.transactions.createIndex({ "shift_id": 1 })
```

---

### 3. customers

**Purpose**: Data customer/pelanggan

```javascript
{
  "id": "cust-001",                  // String, unique customer ID
  "name": "John Doe",                // String, nama customer
  "phone": "081234567890",           // String, nomor HP
  "email": "john@example.com",      // String, email (optional)
  "address": "Jl. Merdeka No. 10",  // String, alamat (optional)
  "created_at": "2025-12-01T10:00:00Z", // ISO DateTime
  "total_spent": 5000000,            // Number, total pembelian
  "transaction_count": 15            // Number, jumlah transaksi
}
```

**Indexes**:
```javascript
db.customers.createIndex({ "id": 1 }, { unique: true })
db.customers.createIndex({ "phone": 1 })
```

---

### 4. shifts

**Purpose**: Data shift kasir (buka/tutup kasir)

```javascript
{
  "id": "shift-001",                 // String, unique shift ID
  "store_id": "store-001",           // String, ID toko [PHASE 1]
  "kasir_name": "Jane",              // String, nama kasir
  "start_time": "2025-12-01T08:00:00Z", // ISO DateTime
  "end_time": "2025-12-01T16:00:00Z",   // ISO DateTime (null jika masih aktif)
  "opening_cash": 1000000,           // Number, modal awal
  "closing_cash": 2500000,           // Number, kas penutupan (null jika masih aktif)
  "expected_cash": 2450000,          // Number, kas yang seharusnya
  "difference": 50000,               // Number, selisih (closing - expected)
  "total_sales": 1450000,            // Number, total penjualan dalam shift
  "transactions": [                  // Array of transaction IDs
    "txn-20251201-001",
    "txn-20251201-002"
  ],
  "status": "closed"                 // "active" | "closed"
}
```

**Indexes**:
```javascript
db.shifts.createIndex({ "id": 1 }, { unique: true })
db.shifts.createIndex({ "store_id": 1, "status": 1 })  // [PHASE 1]
db.shifts.createIndex({ "start_time": -1 })
```

---

### 5. users

**Purpose**: User authentication & authorization

```javascript
{
  "id": "user-001",                  // String, unique user ID
  "email": "admin@weekn.com",       // String, email untuk login
  "hashed_password": "$2b$12$...",  // String, bcrypt hashed password
  "name": "Admin",                   // String, nama lengkap
  "role": "Super Admin",            // String, role user
  "store_id": "store-001",           // String, assigned store [PHASE 1]
  "created_at": "2025-12-01T10:00:00Z" // ISO DateTime
}
```

**Roles**:
- `Super Admin`: Full access
- `Factory Admin`: Akses pabrik [PHASE 2]
- `Store Manager`: Akses toko tertentu [PHASE 1]
- `Kasir`: Akses kasir only

**Indexes**:
```javascript
db.users.createIndex({ "id": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "store_id": 1 })  // [PHASE 1]
```

---

### 6. stores [PHASE 1]

**Purpose**: Master data toko & pabrik

```javascript
{
  "id": "store-001",                 // String, unique store ID
  "name": "WEEKN Sudirman",          // String, nama toko/pabrik
  "type": "toko",                    // "toko" | "pabrik"
  "address": "Jl. Sudirman No. 123", // String, alamat lengkap
  "phone": "021-12345678",           // String, nomor telepon
  "coordinates": {                   // Object, koordinat lokasi
    "lat": -6.2088,                  // Number, latitude
    "lng": 106.8456                  // Number, longitude
  },
  "is_active": true,                 // Boolean, status aktif
  "created_at": "2025-12-01T10:00:00Z" // ISO DateTime
}
```

**Indexes**:
```javascript
db.stores.createIndex({ "id": 1 }, { unique: true })
db.stores.createIndex({ "type": 1 })
```

---

### 7. raw_materials [PHASE 2]

**Purpose**: Master bahan baku untuk produksi

```javascript
{
  "id": "raw-001",                   // String, unique ID
  "name": "Tepung Terigu",           // String, nama bahan baku
  "stock": 50,                       // Number, jumlah stok
  "unit": "kg",                      // String, satuan (kg, liter, pcs, etc)
  "cost": 12000,                     // Number, harga per unit
  "supplier": "PT. Supplier A",     // String, nama supplier
  "min_stock": 10,                   // Number, minimum stock alert
  "created_at": "2025-12-01T10:00:00Z", // ISO DateTime
  "updated_at": "2025-12-05T15:30:00Z"  // ISO DateTime
}
```

**Indexes**:
```javascript
db.raw_materials.createIndex({ "id": 1 }, { unique: true })
db.raw_materials.createIndex({ "name": 1 })
```

---

### 8. recipes [PHASE 2]

**Purpose**: Resep produk (bahan baku apa saja yang dibutuhkan)

```javascript
{
  "id": "recipe-001",                // String, unique recipe ID
  "product_id": "prod-001",          // String, ID produk
  "product_name": "Kue Ulang Tahun", // String, nama produk
  "ingredients": [                   // Array of ingredients
    {
      "raw_material_id": "raw-001",
      "raw_material_name": "Tepung Terigu",
      "quantity": 2,                 // Number, jumlah dibutuhkan
      "unit": "kg"                   // String, satuan
    },
    {
      "raw_material_id": "raw-002",
      "raw_material_name": "Gula Pasir",
      "quantity": 1,
      "unit": "kg"
    }
  ],
  "yield_quantity": 1,               // Number, hasil jadi (1 kue)
  "yield_unit": "pcs",               // String, satuan hasil
  "notes": "Panggang 180C 30 menit", // String, catatan resep
  "created_at": "2025-12-01T10:00:00Z", // ISO DateTime
  "updated_at": "2025-12-05T15:30:00Z"  // ISO DateTime
}
```

**Indexes**:
```javascript
db.recipes.createIndex({ "id": 1 }, { unique: true })
db.recipes.createIndex({ "product_id": 1 }, { unique: true })
```

---

### 9. production_orders [PHASE 2]

**Purpose**: Order produksi di pabrik

```javascript
{
  "id": "prod-order-001",            // String, unique production order ID
  "product_id": "prod-001",          // String, ID produk yang diproduksi
  "product_name": "Kue Ulang Tahun", // String, nama produk
  "recipe_id": "recipe-001",         // String, ID resep yang dipakai
  
  "quantity_target": 100,            // Number, target produksi
  "quantity_produced": 95,           // Number, hasil produksi (input setelah selesai)
  "quantity_damaged": 5,             // Number, jumlah rusak
  "quantity_good": 95,               // Number, yang bagus (produced - damaged)
  
  "raw_materials_used": [            // Array of bahan baku yang terpakai
    {
      "raw_material_id": "raw-001",
      "raw_material_name": "Tepung Terigu",
      "quantity": 200,               // 100 kue × 2kg = 200kg
      "unit": "kg"
    }
  ],
  
  "status": "completed",             // Workflow status
  // Status: "pending" → "in_production" → "quality_check" → "packing" → "ready"
  
  "packing_status": "packed",        // "not_packed" | "packed"
  "packing_date": "2025-12-02T10:00:00Z", // ISO DateTime
  "packed_by": "Team Packing",       // String, nama yang packing
  
  "production_date": "2025-12-01T08:00:00Z",  // ISO DateTime, mulai produksi
  "completed_date": "2025-12-01T14:00:00Z",   // ISO DateTime, selesai produksi
  
  "created_by": "Factory Admin",     // String, user yang buat order
  "notes": "Produksi untuk stok",    // String, catatan
  "created_at": "2025-12-01T07:00:00Z", // ISO DateTime
  "updated_at": "2025-12-02T10:00:00Z"  // ISO DateTime
}
```

**Indexes**:
```javascript
db.production_orders.createIndex({ "id": 1 }, { unique: true })
db.production_orders.createIndex({ "status": 1 })
db.production_orders.createIndex({ "packing_status": 1 })
db.production_orders.createIndex({ "production_date": -1 })
```

---

### 10. stock_orders [PHASE 3]

**Purpose**: Order stok dari toko ke pabrik (untuk 2 hari ke depan)

```javascript
{
  "id": "stock-order-001",           // String, unique stock order ID
  "order_number": "SO-20251201-001", // String, nomor order
  
  "from_store_id": "store-001",      // String, ID toko yang order
  "from_store_name": "WEEKN Sudirman", // String, nama toko
  "to_store_id": "factory-001",      // String, ID pabrik (destination)
  
  "items": [                         // Array of items
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun",
      "quantity": 20
    }
  ],
  
  "delivery_date": "2025-12-03",     // Date, tanggal pengiriman (2 hari ke depan)
  
  "status": "delivered",             // Workflow status
  // Status: "pending" → "approved" → "packing" → "packed" → "in_transit" → "delivered"
  
  "packing_status": "packed",        // "not_packed" | "packed"
  "packing_date": "2025-12-02T10:00:00Z", // ISO DateTime
  "packed_by": "Team Packing",       // String
  
  "created_by": "Store Manager",     // String, user yang buat order
  "approved_by": "Factory Admin",    // String, user yang approve
  "notes": "Untuk stok weekend",     // String, catatan
  
  "created_at": "2025-12-01T10:00:00Z", // ISO DateTime
  "approved_at": "2025-12-01T11:00:00Z", // ISO DateTime
  "delivered_at": "2025-12-03T08:00:00Z" // ISO DateTime
}
```

**Indexes**:
```javascript
db.stock_orders.createIndex({ "id": 1 }, { unique: true })
db.stock_orders.createIndex({ "from_store_id": 1, "status": 1 })
db.stock_orders.createIndex({ "to_store_id": 1, "status": 1 })
db.stock_orders.createIndex({ "delivery_date": 1 })
```

---

### 11. customer_pos [PHASE 4B]

**Purpose**: Purchase Order dari customer (order ke pabrik untuk acara)

```javascript
{
  "id": "cpo-001",                   // String, unique customer PO ID
  "po_number": "PO-20251201-001",    // String, nomor PO
  
  "store_id": "store-001",           // String, toko yang terima order
  "store_name": "WEEKN Sudirman",    // String, nama toko
  
  "customer_id": "cust-001",        // String, ID customer (optional)
  "customer_name": "John Doe",      // String, nama customer
  "customer_phone": "081234567890", // String, no HP customer
  
  "items": [                         // Array of items
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun Custom",
      "quantity": 5,
      "price": 300000,
      "subtotal": 1500000,
      "notes": "Tulisan: Happy Birthday Sarah"
    }
  ],
  
  "subtotal": 1500000,               // Number, total sebelum ongkir
  "delivery_cost": 15000,            // Number, biaya ongkir
  "discount": 0,                     // Number, diskon (optional)
  "total": 1515000,                  // Number, total keseluruhan
  
  // Delivery information
  "delivery_enabled": true,          // Boolean
  "delivery_address": "Jl. Merdeka No. 10", // String
  "delivery_coordinates": {          // Object
    "start": {"lat": -6.2088, "lng": 106.8456}, // Pabrik
    "end": {"lat": -6.2000, "lng": 106.8200}    // Customer
  },
  "delivery_distance_km": 5.0,       // Number
  "delivery_method": "kurir_weekn",  // "kurir_weekn" | "ojek_online" | "pickup"
  "courier_name": "Budi",            // String
  "courier_phone": "081234567890",   // String
  
  "event_date": "2025-12-05",        // Date, tanggal acara customer
  
  // Payment information
  "payment_type": "dp",              // "dp" | "full"
  "amount_paid": 500000,             // Number, jumlah yang sudah dibayar
  "remaining_payment": 1015000,      // Number, sisa pembayaran
  "payment_history": [               // Array of payments
    {
      "amount": 500000,
      "method": "cash",              // "cash" | "transfer" | etc
      "paid_at": "2025-12-01T10:00:00Z",
      "paid_by": "Jane (Kasir)"
    }
  ],
  
  "status": "in_production",         // Workflow status
  // Status: "pending" → "approved" → "in_production" → "quality_check" → 
  //         "packing" → "packed" → "out_for_delivery" → "delivered" → "completed"
  
  "packing_status": "not_packed",    // "not_packed" | "packed"
  "packing_date": null,              // ISO DateTime
  "packed_by": null,                 // String
  
  "production_order_id": "prod-order-002", // String, link ke production order
  
  "created_by": "Jane (Kasir)",      // String, user yang buat PO
  "approved_by": "Factory Admin",    // String, user yang approve
  "notes": "Pengiriman jam 10 pagi", // String, catatan
  
  "created_at": "2025-12-01T10:00:00Z", // ISO DateTime
  "approved_at": "2025-12-01T11:00:00Z", // ISO DateTime
  "delivered_at": null,              // ISO DateTime
  "completed_at": null               // ISO DateTime
}
```

**Indexes**:
```javascript
db.customer_pos.createIndex({ "id": 1 }, { unique: true })
db.customer_pos.createIndex({ "po_number": 1 }, { unique: true })
db.customer_pos.createIndex({ "store_id": 1, "status": 1 })
db.customer_pos.createIndex({ "customer_id": 1 })
db.customer_pos.createIndex({ "event_date": 1 })
db.customer_pos.createIndex({ "remaining_payment": 1 }) // untuk cari yang belum lunas
```

---

### 12. returns [PHASE 6]

**Purpose**: Return/retur barang dari customer

```javascript
{
  "id": "return-001",                // String, unique return ID
  "return_number": "RTR-20251201-001", // String, nomor retur
  
  "store_id": "store-001",           // String, toko yang terima retur
  
  "original_transaction_id": "txn-20251130-001", // String, ID transaksi asli
  "original_po_number": null,        // String, nomor PO asli (jika dari customer PO)
  
  "customer_name": "John Doe",      // String, nama customer
  "customer_phone": "081234567890", // String, no HP customer
  
  "items": [                         // Array of items yang diretur
    {
      "product_id": "prod-001",
      "product_name": "Kue Ulang Tahun",
      "quantity": 1,
      "price": 250000,
      "subtotal": 250000,
      "reason": "rusak",             // String, alasan retur
      "condition": "damaged"         // "damaged" | "good" | "expired"
    }
  ],
  
  "return_type": "refund",           // "refund" | "exchange"
  "total_return": 250000,            // Number, total nilai retur
  
  "exchange_transaction_id": null,  // String, ID transaksi tukar (jika exchange)
  
  "status": "completed",             // Workflow status
  // Status: "pending" → "approved" → "processed" → "completed"
  
  "notes": "Kue rusak saat pengiriman", // String, catatan
  "created_by": "Jane (Kasir)",      // String, user yang buat retur
  "approved_by": "Store Manager",    // String, user yang approve
  "processed_by": "Jane (Kasir)",    // String, user yang proses refund/exchange
  
  "created_at": "2025-12-01T10:00:00Z",  // ISO DateTime
  "approved_at": "2025-12-01T10:30:00Z", // ISO DateTime
  "processed_at": "2025-12-01T11:00:00Z", // ISO DateTime
  "completed_at": "2025-12-01T11:00:00Z"  // ISO DateTime
}
```

**Indexes**:
```javascript
db.returns.createIndex({ "id": 1 }, { unique: true })
db.returns.createIndex({ "return_number": 1 }, { unique: true })
db.returns.createIndex({ "store_id": 1, "status": 1 })
db.returns.createIndex({ "original_transaction_id": 1 })
db.returns.createIndex({ "created_at": -1 })
```

---

### 13. damaged_goods [PHASE 2]

**Purpose**: Tracking semua barang rusak (dari produksi, retur, expired, dll)

```javascript
{
  "id": "damaged-001",               // String, unique ID
  
  "product_id": "prod-001",          // String, ID produk
  "product_name": "Kue Ulang Tahun", // String, nama produk
  "quantity": 5,                     // Number, jumlah rusak
  
  "source": "production",            // "production" | "return" | "expired" | "other"
  "source_id": "prod-order-001",     // String, ID sumber (production_order_id, return_id, dll)
  
  "store_id": "factory-001",         // String, lokasi barang rusak (pabrik/toko)
  
  "reason": "Hasil produksi tidak sempurna", // String, alasan rusak
  "notes": "Adonan kurang mengembang",       // String, catatan detail
  
  "recorded_by": "Factory Admin",    // String, user yang catat
  "created_at": "2025-12-01T14:00:00Z" // ISO DateTime
}
```

**Indexes**:
```javascript
db.damaged_goods.createIndex({ "id": 1 }, { unique: true })
db.damaged_goods.createIndex({ "store_id": 1, "created_at": -1 })
db.damaged_goods.createIndex({ "product_id": 1 })
db.damaged_goods.createIndex({ "source": 1 })
```

---

## 🔗 Relationships

### One-to-Many Relationships

```
stores (1) ----< (many) products
stores (1) ----< (many) transactions
stores (1) ----< (many) users
stores (1) ----< (many) shifts
stores (1) ----< (many) stock_orders (from_store_id)
stores (1) ----< (many) customer_pos

products (1) ----< (many) recipes (1:1 actually)
products (1) ----< (many) production_orders

raw_materials (1) ----< (many) recipe.ingredients
raw_materials (1) ----< (many) production_order.materials_used

customers (1) ----< (many) transactions
customers (1) ----< (many) customer_pos

transactions (1) ----< (1) returns (optional)

shifts (1) ----< (many) transactions
```

### Linking Fields

| Collection | Links To | Via Field |
|------------|----------|----------|
| products | stores | store_id |
| transactions | stores | store_id |
| transactions | customers | customer_id |
| transactions | shifts | shift_id |
| users | stores | store_id |
| shifts | stores | store_id |
| recipes | products | product_id |
| production_orders | products | product_id |
| production_orders | recipes | recipe_id |
| stock_orders | stores (from) | from_store_id |
| stock_orders | stores (to) | to_store_id |
| customer_pos | stores | store_id |
| customer_pos | customers | customer_id |
| customer_pos | production_orders | production_order_id |
| returns | transactions | original_transaction_id |
| returns | customer_pos | original_po_number |
| returns | stores | store_id |
| damaged_goods | products | product_id |
| damaged_goods | stores | store_id |

---

## 📊 Data Migration Strategy

### Phase 0 → Phase 1 (Adding store_id)

**Challenge**: Existing data tidak punya `store_id`

**Solution**:
```javascript
// 1. Buat default store (toko pertama)
db.stores.insertOne({
  "id": "store-default",
  "name": "WEEKN Main Store",
  "type": "toko",
  "address": "Jakarta",
  "phone": "-",
  "coordinates": {"lat": 0, "lng": 0},
  "is_active": true,
  "created_at": new Date()
});

// 2. Update existing data dengan store_id default
db.products.updateMany(
  { "store_id": { $exists: false } },
  { $set: { "store_id": "store-default" } }
);

db.transactions.updateMany(
  { "store_id": { $exists: false } },
  { $set: { "store_id": "store-default" } }
);

// Same for shifts, users, etc.
```

### Phase 3 → Phase 4A (Adding delivery fields to transactions)

**Challenge**: Existing transactions tidak punya delivery fields

**Solution**: Fields baru optional, tidak perlu migration

---

## 🔒 Data Validation

### Required Fields per Collection

#### products
- `id`, `name`, `price`, `stock`
- Optional: `category`, `image_url`, `barcode`, `description`, `store_id`

#### transactions
- `id`, `items`, `subtotal`, `total`, `payment_methods`, `timestamp`
- Optional: `customer_id`, `discount`, `delivery_*` fields

#### customers
- `id`, `name`, `phone`
- Optional: `email`, `address`, `total_spent`, `transaction_count`

#### shifts
- `id`, `kasir_name`, `start_time`, `opening_cash`, `status`
- Optional on start: `end_time`, `closing_cash`, `expected_cash`

#### users
- `id`, `email`, `hashed_password`, `name`, `role`
- Optional: `store_id`

---

## 🔍 Query Examples

### Get products by store
```javascript
db.products.find({ "store_id": "store-001" })
```

### Get active shift
```javascript
db.shifts.findOne({ "store_id": "store-001", "status": "active" })
```

### Get transactions for a shift
```javascript
db.transactions.find({ "shift_id": "shift-001" })
```

### Get pending stock orders for factory
```javascript
db.stock_orders.find({ 
  "to_store_id": "factory-001",
  "status": "pending"
})
```

### Get customer PO with unpaid balance
```javascript
db.customer_pos.find({ 
  "remaining_payment": { $gt: 0 }
})
```

### Get damaged goods by date range
```javascript
db.damaged_goods.find({
  "created_at": {
    $gte: ISODate("2025-12-01T00:00:00Z"),
    $lte: ISODate("2025-12-31T23:59:59Z")
  }
})
```

### Get low stock raw materials
```javascript
db.raw_materials.find({
  $expr: { $lte: ["$stock", "$min_stock"] }
})
```

---

## 🚨 Important Notes

### MongoDB ObjectId Handling

**CRITICAL**: Always exclude `_id` when fetching data to avoid serialization issues

```python
# ✅ Correct
products = await db.products.find({}, {"_id": 0}).to_list(1000)

# ❌ Wrong - will cause ObjectId serialization error
products = await db.products.find({}).to_list(1000)
```

### Custom ID Generation

Semua collection menggunakan custom `id` field (String), bukan MongoDB `_id`:

```python
from uuid import uuid4

product = {
    "id": str(uuid4()),  # Generate unique ID
    "name": "Kue",
    # ... other fields
}
```

### DateTime Format

Gunakan ISO 8601 format dengan UTC timezone:

```python
from datetime import datetime, timezone

created_at = datetime.now(timezone.utc)  # ✅ Correct
created_at = datetime.utcnow()           # ❌ Deprecated
```

---

**Document Version**: 1.0
**Last Updated**: December 2025
