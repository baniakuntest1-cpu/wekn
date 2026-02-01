# 🔄 WEEKN Business Workflow Documentation

## Overview

Dokumen ini menjelaskan business workflow dan user journey untuk setiap fitur utama dalam sistem WEEKN.

---

## 👥 User Roles

### 1. Super Admin
**Access**: Semua fitur di semua store
**Responsibilities**:
- Manage users
- Manage stores (add new stores/factory)
- View all reports
- System configuration

### 2. Factory Admin
**Access**: Factory-specific features
**Responsibilities**:
- Manage raw materials
- Create recipes
- Manage production orders
- Approve stock orders from stores
- Approve customer PO

### 3. Store Manager
**Access**: Store-specific features
**Responsibilities**:
- Manage store products
- Create stock orders to factory
- Manage customer PO
- View store reports
- Manage store staff

### 4. Kasir (Cashier)
**Access**: Limited to POS operations
**Responsibilities**:
- Operate POS (cashier)
- Open/close shifts
- Create transactions
- Handle customer orders
- Process returns

---

## 🏪 Workflow 1: Daily Store Operations (Kasir)

### Morning Routine

```
1. LOGIN
   ├─ Kasir login dengan credentials
   └─ System redirect ke Cashier Page

2. BUKA SHIFT
   ├─ Klik "Buka Shift" button
   ├─ Input modal awal (opening cash)
   ├─ Sistem create shift record
   └─ Status shift: ACTIVE

3. SIAP MELAYANI CUSTOMER
   └─ Shift indicator shows: "Shift Aktif - Modal: Rp XXX"
```

### During Shift - Transaction Flow

```
CUSTOMER DATANG KE TOKO
   │
   ├─ SCENARIO 1: Beli Langsung (Ada Stok)
   │  │
   │  ├─ 1. ADD TO CART
   │  │  ├─ Kasir pilih produk dari grid
   │  │  ├─ Klik produk → tambah ke cart
   │  │  └─ Adjust quantity jika perlu
   │  │
   │  ├─ 2. APPLY DISCOUNT (Optional)
   │  │  ├─ Klik "Diskon" button
   │  │  ├─ Pilih: Item discount atau Transaction discount
   │  │  ├─ Input: Percentage atau Fixed amount
   │  │  └─ Sistem recalculate total
   │  │
   │  ├─ 3. SELECT CUSTOMER (Optional)
   │  │  ├─ Search customer by name/phone
   │  │  ├─ Atau create new customer
   │  │  └─ Link customer ke transaction
   │  │
   │  ├─ 4. PAYMENT
   │  │  ├─ Klik "Bayar" button
   │  │  ├─ Choose payment method:
   │  │  │  ├─ Cash only
   │  │  │  ├─ Digital only
   │  │  │  └─ Split (Cash + Digital)
   │  │  │
   │  │  ├─ DELIVERY? (Optional)
   │  │  │  ├─ Toggle "Delivery"
   │  │  │  ├─ Input alamat customer
   │  │  │  ├─ Input coordinates (start & end)
   │  │  │  ├─ Klik "Hitung Jarak"
   │  │  │  ├─ Pilih delivery method:
   │  │  │  │  ├─ Kurir WEEKN (auto calculate: Rp 3000/km)
   │  │  │  │  ├─ Ojek Online (manual input harga)
   │  │  │  │  └─ Pickup (customer ambil sendiri)
   │  │  │  ├─ Input nama kurir & no HP
   │  │  │  └─ Ongkir added to total
   │  │  │
   │  │  └─ Confirm payment
   │  │
   │  ├─ 5. PRINT RECEIPT
   │  │  ├─ Sistem generate struk
   │  │  ├─ Include delivery info (jika ada)
   │  │  └─ Kasir berikan struk ke customer
   │  │
   │  └─ 6. BACKEND PROCESSING
   │     ├─ Transaction saved to database
   │     ├─ Stock dikurangi
   │     ├─ Transaction linked to shift
   │     └─ Customer data updated (total_spent, transaction_count)
   │
   │
   └─ SCENARIO 2: Pesan untuk Acara (Order ke Pabrik)
      │
      ├─ 1. CREATE CUSTOMER PO
      │  ├─ Kasir klik menu "PO Customer"
      │  ├─ Klik "Buat PO Baru"
      │  └─ Open PO form
      │
      ├─ 2. INPUT CUSTOMER INFO
      │  ├─ Select existing customer atau create new
      │  ├─ Input nama, phone
      │  └─ Input tanggal acara
      │
      ├─ 3. SELECT PRODUCTS
      │  ├─ Pilih produk (multiple)
      │  ├─ Input quantity per produk
      │  ├─ Add custom notes per item
      │  └─ Sistem calculate subtotal
      │
      ├─ 4. DELIVERY INFO (Optional)
      │  └─ Same as Transaction delivery flow
      │
      ├─ 5. PAYMENT
      │  ├─ Pilih payment type:
      │  │  ├─ DP: Input amount (e.g., 50% dari total)
      │  │  └─ Lunas: Full payment
      │  └─ Show remaining payment
      │
      ├─ 6. SUBMIT PO
      │  ├─ Generate PO Number (PO-YYYYMMDD-XXX)
      │  ├─ Print PO slip untuk customer
      │  └─ Status: PENDING
      │
      └─ 7. PO DIKIRIM KE PABRIK
         ├─ PO masuk ke queue pabrik
         └─ Customer terima PO slip dengan nomor order
```

### Evening Routine - Close Shift

```
1. TUTUP SHIFT
   ├─ Klik "Tutup Shift" button
   ├─ Input kas penutupan (closing cash)
   ├─ Sistem calculate:
   │  ├─ Expected cash = opening + total cash sales
   │  ├─ Actual cash = closing cash
   │  └─ Difference = actual - expected
   ├─ Show shift summary:
   │  ├─ Total sales
   │  ├─ Total transactions
   │  ├─ Cash reconciliation
   │  └─ Payment method breakdown
   └─ Confirm close → Status shift: CLOSED

2. LOGOUT
   └─ Kasir logout dari system
```

---

## 🏭 Workflow 2: Production Management (Factory Admin)

### Daily Production Cycle

```
MORNING: Review Orders
   │
   ├─ 1. CHECK STOCK ORDERS FROM STORES
   │  ├─ Menu: "Pesanan Stok dari Toko"
   │  ├─ View pending orders
   │  ├─ Check stock availability
   │  └─ Approve orders
   │
   └─ 2. CHECK CUSTOMER PO
      ├─ Menu: "PO Customer dari Toko"
      ├─ View pending PO
      ├─ Check production capacity
      └─ Approve PO

CREATE PRODUCTION ORDER
   │
   ├─ 1. SELECT PRODUCT
   │  ├─ Menu: "Produksi"
   │  ├─ Klik "Buat Production Order"
   │  ├─ Select product from list
   │  └─ System auto-load recipe
   │
   ├─ 2. INPUT QUANTITY
   │  ├─ Input target quantity (e.g., 100 pcs)
   │  ├─ System calculate bahan baku needed
   │  ├─ Check raw material availability
   │  └─ Warning jika bahan baku insufficient
   │
   ├─ 3. SUBMIT ORDER
   │  ├─ Generate production order ID
   │  ├─ Status: PENDING
   │  └─ Link to Customer PO (jika dari customer order)
   │
   └─ 4. START PRODUCTION
      ├─ Update status: IN_PRODUCTION
      └─ Team mulai produksi

PRODUCTION COMPLETION
   │
   ├─ 1. INPUT HASIL PRODUKSI
   │  ├─ Quantity produced: 95 pcs
   │  ├─ Quantity damaged: 5 pcs
   │  └─ System calculate quantity_good = 95
   │
   ├─ 2. QUALITY CHECK
   │  ├─ Update status: QUALITY_CHECK
   │  ├─ Team QC inspect hasil
   │  └─ Confirm quality
   │
   ├─ 3. BACKEND PROCESSING
   │  ├─ Deduct raw materials:
   │  │  └─ For each ingredient: stock -= (quantity_good × recipe_qty)
   │  ├─ Add product stock (good products only):
   │  │  └─ product.stock += 95
   │  ├─ Create damaged_goods record:
   │  │  └─ source: "production", quantity: 5
   │  └─ Update production order status
   │
   ├─ 4. PACKING
   │  ├─ Update status: PACKING
   │  ├─ Print packing slip
   │  ├─ Team packing ceklis barang
   │  ├─ Update: packing_status = "packed"
   │  └─ Status: READY
   │
   └─ 5. READY FOR SHIPMENT
      ├─ For Stock Order: Ready to ship to store
      └─ For Customer PO: Ready for delivery
```

### Raw Materials Management

```
LOW STOCK ALERT
   │
   ├─ System detect: stock < min_stock
   ├─ Dashboard shows warning
   └─ Factory Admin take action

RESTOCK RAW MATERIALS
   │
   ├─ 1. BELI BAHAN BAKU (Manual process)
   │  └─ Contact supplier, purchase materials
   │
   ├─ 2. UPDATE STOCK
   │  ├─ Menu: "Bahan Baku"
   │  ├─ Klik material yang di-restock
   │  ├─ Klik "Edit"
   │  ├─ Update stock quantity
   │  └─ Save
   │
   └─ 3. STOCK UPDATED
      └─ Dashboard updated, warning cleared
```

---

## 📦 Workflow 3: Stock Replenishment (Store ↔ Factory)

### Store Side: Request Stock

```
TOKO BUTUH RESTOCK
   │
   ├─ 1. CHECK CURRENT STOCK
   │  ├─ Menu: "Produk"
   │  ├─ View stock levels
   │  └─ Identify products yang perlu restock
   │
   ├─ 2. CREATE STOCK ORDER
   │  ├─ Menu: "Pesan Stok ke Pabrik"
   │  ├─ Klik "Buat Pesanan Stok"
   │  └─ Open stock order form
   │
   ├─ 3. SELECT PRODUCTS
   │  ├─ Pilih products (multiple)
   │  ├─ Input quantity per product
   │  ├─ Current stock shown for reference
   │  └─ Calculate total items
   │
   ├─ 4. SET DELIVERY DATE
   │  ├─ Select date (minimum: 2 hari dari sekarang)
   │  └─ System validate date
   │
   ├─ 5. SUBMIT ORDER
   │  ├─ Generate order number (SO-YYYYMMDD-XXX)
   │  ├─ Status: PENDING
   │  └─ Order sent to factory
   │
   └─ 6. TRACK ORDER
      ├─ View order status in list
      └─ Wait for factory approval
```

### Factory Side: Fulfill Stock Order

```
FACTORY RECEIVE ORDER
   │
   ├─ 1. VIEW PENDING ORDERS
   │  ├─ Menu: "Pesanan Stok dari Toko"
   │  ├─ Filter: status = "pending"
   │  └─ View order details
   │
   ├─ 2. CHECK AVAILABILITY
   │  ├─ For each item in order:
   │  │  └─ Check: factory product stock >= order quantity
   │  ├─ If insufficient:
   │  │  └─ Create production order first
   │  └─ If sufficient: Proceed to approve
   │
   ├─ 3. APPROVE ORDER
   │  ├─ Klik "Approve" button
   │  ├─ Status: APPROVED
   │  └─ Move to packing queue
   │
   ├─ 4. PACKING
   │  ├─ Status: PACKING
   │  ├─ Print packing slip
   │  ├─ Team packing ceklis items
   │  ├─ Update: packing_status = "packed"
   │  └─ Status: PACKED
   │
   ├─ 5. SHIP TO STORE
   │  ├─ Klik "Ship" button
   │  ├─ Status: IN_TRANSIT
   │  └─ Kurir deliver to store
   │
   └─ 6. MARK AS DELIVERED
      ├─ Klik "Delivered" button
      ├─ Status: DELIVERED
      └─ BACKEND PROCESSING:
         ├─ Deduct factory stock:
         │  └─ For each item: factory_product.stock -= quantity
         └─ Add store stock:
            └─ For each item: store_product.stock += quantity
```

---

## 🚚 Workflow 4: Customer PO with Delivery

### Complete Customer PO Workflow

```
DAY 1: CUSTOMER ORDER (di Toko)
   │
   └─ [See Workflow 1 - SCENARIO 2]
      ├─ Customer pesan
      ├─ Kasir buat PO
      ├─ Payment: DP 50%
      └─ Status: PENDING

DAY 1: FACTORY APPROVE
   │
   ├─ Factory Admin view PO
   ├─ Check production capacity
   ├─ Approve PO
   └─ Status: APPROVED

DAY 2-3: PRODUCTION
   │
   ├─ Create Production Order
   ├─ Produksi sesuai resep
   ├─ Quality check
   └─ Status: IN_PRODUCTION → QUALITY_CHECK

DAY 3: PACKING
   │
   ├─ Print packing slip
   ├─ Team packing ceklis
   ├─ Update packing_status: PACKED
   └─ Status: PACKED → READY

DAY 4: DELIVERY
   │
   ├─ Status: OUT_FOR_DELIVERY
   │
   ├─ IF delivery_method = "kurir_weekn":
   │  ├─ Kasir WA/SMS kurir
   │  ├─ Info: nama customer, alamat, no HP, notes
   │  └─ Kurir pick up barang dari pabrik
   │
   ├─ IF delivery_method = "ojek_online":
   │  ├─ Kasir order ojek online
   │  └─ Ojek pick up dari pabrik
   │
   └─ IF delivery_method = "pickup":
      └─ Customer datang ambil di pabrik/toko

DAY 4: DELIVERED
   │
   ├─ Kurir deliver to customer
   ├─ Customer terima barang
   │
   ├─ IF remaining_payment > 0:
   │  ├─ Customer bayar sisa
   │  ├─ Kasir input additional payment
   │  └─ remaining_payment = 0
   │
   ├─ Update status: DELIVERED
   └─ Status: COMPLETED
```

---

## 🔙 Workflow 5: Return Management

### Customer Return Flow

```
CUSTOMER DATANG KE TOKO UNTUK RETUR
   │
   ├─ 1. KASIR SEARCH TRANSACTION
   │  ├─ Menu: "Retur"
   │  ├─ Input: nomor struk atau PO number
   │  ├─ System find transaction
   │  └─ Display transaction details
   │
   ├─ 2. SELECT ITEMS TO RETURN
   │  ├─ Kasir ceklis produk yang diretur
   │  ├─ For each item:
   │  │  ├─ Select reason:
   │  │  │  ├─ Rusak
   │  │  │  ├─ Kadaluarsa
   │  │  │  ├─ Salah produk
   │  │  │  └─ Lainnya
   │  │  └─ Input quantity to return
   │  └─ System calculate total return value
   │
   ├─ 3. SELECT RETURN TYPE
   │  ├─ Option 1: REFUND (kembalikan uang)
   │  └─ Option 2: EXCHANGE (tukar barang)
   │
   ├─ 4. SUBMIT RETURN REQUEST
   │  ├─ Generate return number (RTR-YYYYMMDD-XXX)
   │  ├─ Status: PENDING
   │  └─ Wait for manager approval
   │
   ├─ 5. MANAGER APPROVE
   │  ├─ Manager review return request
   │  ├─ Check items condition
   │  ├─ Approve atau reject
   │  └─ Status: APPROVED
   │
   ├─ 6A. IF REFUND:
   │  ├─ Kasir return uang ke customer
   │  ├─ Update status: PROCESSED
   │  ├─ BACKEND PROCESSING:
   │  │  ├─ For each returned item:
   │  │  │  ├─ IF condition = "good":
   │  │  │  │  └─ product.stock += quantity (kembalikan ke stok)
   │  │  │  └─ IF condition = "damaged":
   │  │  │     └─ Create damaged_goods record
   │  │  └─ Update customer total_spent (decrease)
   │  └─ Status: COMPLETED
   │
   └─ 6B. IF EXCHANGE:
      ├─ Show product grid
      ├─ Customer pilih produk pengganti
      ├─ Create new transaction:
      │  ├─ Items: produk pengganti
      │  ├─ Total: 0 (exchange, no payment)
      │  ├─ Notes: "Exchange for RTR-XXX"
      │  └─ Link to return record
      ├─ BACKEND PROCESSING:
      │  ├─ Return items stock adjustment (same as refund)
      │  └─ New items stock adjustment (deduct)
      └─ Status: COMPLETED
```

---

## 📊 Workflow 6: Reporting & Analytics

### Daily Reports

```
END OF DAY
   │
   ├─ STORE MANAGER / ADMIN:
   │  ├─ View Dashboard
   │  ├─ Check daily sales summary:
   │  │  ├─ Total sales
   │  │  ├─ Total transactions
   │  │  ├─ Top selling products
   │  │  └─ Payment method breakdown
   │  ├─ Check inventory status:
   │  │  └─ Low stock alerts
   │  └─ Check pending orders:
   │     ├─ Customer PO
   │     └─ Stock orders
   │
   └─ FACTORY ADMIN:
      ├─ View Production Dashboard
      ├─ Check production summary:
      │  ├─ Items produced today
      │  ├─ Damaged goods count
      │  └─ Production efficiency
      ├─ Check raw materials:
      │  └─ Low stock alerts
      └─ Check pending orders:
         ├─ Stock orders from stores
         └─ Customer PO for production
```

### Weekly/Monthly Reports

```
GENERATE REPORTS
   │
   ├─ Menu: "Laporan"
   │
   ├─ SELECT REPORT TYPE:
   │  ├─ Sales Report
   │  ├─ Inventory Report
   │  ├─ Production Report
   │  ├─ Delivery Performance
   │  └─ Damaged Goods Report
   │
   ├─ SELECT PARAMETERS:
   │  ├─ Date range
   │  ├─ Store filter (for multi-store)
   │  └─ Product category (optional)
   │
   ├─ GENERATE
   │  ├─ System query database
   │  ├─ Calculate metrics
   │  └─ Display results with charts
   │
   └─ EXPORT (Optional):
      ├─ Download PDF
      └─ Download Excel
```

---

## 🎯 Key Decision Points

### 1. Customer Order: STRUK vs PO?

**Decision Tree**:
```
Customer mau beli produk
   │
   ├─ Q: Ada di stok toko?
   │  ├─ YES → STRUK (Transaction)
   │  └─ NO → Check next question
   │
   ├─ Q: Untuk kapan?
   │  ├─ Hari ini / besok → STRUK (jika bisa restock cepat)
   │  └─ 2+ hari ke depan → PO Customer
   │
   └─ Q: Custom order?
      ├─ YES (custom recipe, special request) → PO Customer
      └─ NO → STRUK
```

### 2. Delivery: Kurir WEEKN vs Ojek Online?

**Decision Factors**:
```
├─ Jarak < 5 km → Kurir WEEKN (lebih murah)
├─ Jarak > 5 km → Ojek Online (lebih cepat)
├─ Waktu mendesak → Ojek Online
├─ Hemat biaya → Kurir WEEKN
└─ Customer prefer → Customer choice
```

### 3. Production: When to Produce?

**Production Triggers**:
```
├─ Stock Order from Store (pending approval)
├─ Customer PO (approved)
├─ Low stock di pabrik
└─ Scheduled production (routine)
```

### 4. Return: Approve or Reject?

**Approval Criteria**:
```
APPROVE IF:
   ├─ Valid reason (rusak, kadaluarsa, salah produk)
   ├─ Within return period (e.g., 7 hari)
   ├─ Customer has original receipt/PO
   └─ Product condition matches reason

REJECT IF:
   ├─ No valid reason
   ├─ Exceeded return period
   ├─ No proof of purchase
   └─ Customer misuse (product damaged by customer)
```

---

## ⚠️ Error Handling & Edge Cases

### 1. Insufficient Stock

**Scenario**: Customer mau beli, tapi stok tidak cukup

**Solutions**:
```
Option 1: Offer available quantity
   └─ "Stok hanya ada X pcs, mau ambil yang ada?"

Option 2: Create Customer PO
   └─ "Stok habis, mau pesan untuk beberapa hari ke depan?"

Option 3: Check other store
   └─ "Stok di toko lain ada, mau kami kirim dari sana?"
```

### 2. Payment Discrepancy in Shift

**Scenario**: Kas closing tidak sesuai dengan expected

**Actions**:
```
IF difference > 0 (lebih):
   └─ Manager investigate: ada uang dari mana?

IF difference < 0 (kurang):
   └─ Manager investigate: uang hilang kemana?

GENERAL:
   ├─ Review all transactions in shift
   ├─ Check payment methods
   ├─ Recount physical cash
   └─ Document discrepancy with notes
```

### 3. Production Damaged > Expected

**Scenario**: Produksi rusak banyak (e.g., target 100, rusak 30)

**Actions**:
```
├─ Record damaged goods
├─ Investigate root cause:
│  ├─ Bahan baku quality issue?
│  ├─ Production process error?
│  └─ Equipment malfunction?
├─ Adjust production plan:
│  └─ Produce extra batch to meet target
└─ Report to management
```

### 4. Delivery Failure

**Scenario**: Kurir tidak bisa deliver (customer tidak ada, alamat salah, dll)

**Actions**:
```
├─ Kurir contact customer
├─ Reschedule delivery
├─ IF customer tidak bisa dihubungi:
│  ├─ Return to store/factory
│  └─ Contact customer via toko
└─ Update PO status notes
```

### 5. Customer PO Cancellation

**Scenario**: Customer cancel PO setelah approve

**Actions**:
```
IF production belum dimulai:
   ├─ Refund full (DP returned)
   └─ Cancel production order

IF production sudah dimulai:
   ├─ Discuss with customer:
   │  ├─ Option 1: Continue order (customer still want it)
   │  ├─ Option 2: Partial refund (deduct production cost)
   │  └─ Option 3: Store keeps product, full refund for customer
   └─ Document cancellation reason
```

---

## 📞 Support & Escalation

### When to Call Manager/Admin

**Kasir should escalate to Manager for**:
- Large returns (value > Rp XXX)
- Customer disputes
- System errors
- Cash discrepancy > Rp XXX
- Unusual transactions

**Manager should escalate to Super Admin for**:
- System-wide issues
- New store setup
- User access problems
- Data integrity issues
- Major discrepancies

---

**Document Version**: 1.0
**Last Updated**: December 2025
