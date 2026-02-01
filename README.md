# 🍞 WEEKN POS - Sistem Point of Sale Toko Roti

**Everyday is Weekend** - Sistem POS modern untuk toko roti dengan UI yang mudah digunakan kasir dan support print struk thermal 58mm.

![WEEKN Logo](frontend/public/logo-weekn.png)

## ✨ Fitur Phase 1 (MVP)

### 🎯 Fitur Inti
- ✅ **Kasir Cepat** - Interface simpel fokus pada transaksi
- ✅ **Manajemen Produk** - CRUD produk lengkap dengan kategori
- ✅ **Stok Otomatis** - Update stok real-time setiap transaksi
- ✅ **Pembayaran Cash** - Kalkulasi kembalian otomatis
- ✅ **Struk Digital** - Print ready untuk printer thermal 58mm
- ✅ **Laporan Harian** - Dashboard penjualan real-time
- ✅ **Low Stock Alert** - Notifikasi produk yang perlu diisi ulang

### 🎨 UI/UX
- **Touch-Friendly** - Tombol besar mudah di-tap
- **Search & Filter** - Cari produk cepat by kategori
- **Real-time Cart** - Update keranjang langsung
- **Quick Amount Buttons** - Tombol quick input uang (50rb, 100rb, dll)
- **Responsive Design** - Optimal di tablet & desktop

## 🏗️ Arsitektur Modular (Phase 2 Ready)

### Backend Structure
```
backend/
├── server.py          # Main FastAPI app
├── models/            # Data models
│   ├── product.py
│   ├── transaction.py
│   └── inventory.py
├── routes/            # API endpoints (modular)
│   ├── products.py
│   ├── transactions.py
│   └── reports.py
└── .env              # Environment variables
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.js
│   ├── pages/         # Page components
│   │   ├── CashierPage.js
│   │   ├── ProductsPage.js
│   │   └── ReportsPage.js
│   └── components/    # Reusable components
│       ├── Navbar.js
│       ├── ProductGrid.js
│       ├── Cart.js
│       ├── PaymentModal.js
│       └── Receipt.js (58mm print)
└── public/
    └── logo-weekn.png
```

### Database Collections
```javascript
// Products
{
  id: "uuid",
  name: "Roti Cokelat",
  price: 8000,
  category: "Roti Manis",
  stock: 50,
  barcode: "optional",
  description: "optional"
}

// Transactions
{
  id: "uuid",
  items: [{product_id, product_name, quantity, price, subtotal}],
  total: 14000,
  payment_method: "cash",
  cash_received: 50000,
  change: 36000,
  timestamp: "ISO date",
  cashier_name: "Kasir"
}
```

## 🚀 Quick Start

### Prerequisites
- Backend: Python 3.8+, FastAPI, MongoDB
- Frontend: Node.js 16+, React 19, Yarn

### Installation & Running

```bash
# Backend sudah running di port 8001
# Frontend sudah running di port 3000
# MongoDB running di localhost:27017

# Akses aplikasi
http://localhost:3000
```

### Setup Printer Thermal 58mm

1. **Set printer thermal sebagai default printer** di sistem
2. **Di browser**, saat muncul dialog print, pilih printer thermal
3. **Auto-print** sudah aktif - struk langsung print setelah pembayaran
4. **Print ulang** tersedia di modal struk

**CSS Print Settings (sudah configured):**
```css
@media print {
  @page {
    size: 58mm auto;
    margin: 0;
  }
}
```

## 📱 Cara Pakai

### 1️⃣ Halaman Kasir
1. **Pilih produk** dari grid (klik untuk tambah ke cart)
2. **Atur quantity** dengan tombol +/- di cart
3. **Klik BAYAR** untuk checkout
4. **Input uang diterima** (atau gunakan quick buttons)
5. **Klik "Bayar & Print"** - struk langsung print!

### 2️⃣ Halaman Produk
1. **Tambah Produk Baru** - Klik "+ Tambah Produk"
2. **Edit Produk** - Klik tombol "Edit" di card produk
3. **Hapus Produk** - Klik tombol "Hapus" (dengan konfirmasi)

### 3️⃣ Halaman Laporan
- **Dashboard** - Total penjualan, jumlah transaksi, rata-rata
- **Penjualan per Produk** - Produk terlaris hari ini
- **Stok Menipis** - Alert produk dengan stok <= 10
- **Riwayat Transaksi** - Detail semua transaksi hari ini

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/category/{category}` - Get by category

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID

### Reports
- `GET /api/reports/daily` - Daily sales report
- `GET /api/reports/products/low-stock?threshold=10` - Low stock products

## 🎯 Roadmap Phase 2

### Payment Integration
- [ ] **QRIS** - Integrasi pembayaran digital QRIS
- [ ] **E-Wallet** - GoPay, OVO, Dana, ShopeePay
- [ ] **Multi Payment** - Kombinasi cash + e-wallet

### Customer Management
- [ ] **Database Pelanggan** - Simpan data pelanggan
- [ ] **Loyalty Points** - Program poin untuk pelanggan setia
- [ ] **Member Discount** - Diskon khusus member

### Advanced Features
- [ ] **Diskon & Promo** - Management diskon, bundle deals
- [ ] **Multi Kasir & Role** - User management dengan permission
- [ ] **Analytics Dashboard** - Grafik penjualan, trend analysis
- [ ] **E-Faktur & Pajak** - Integrasi sistem perpajakan
- [ ] **WhatsApp Receipt** - Kirim struk via WhatsApp
- [ ] **Barcode Scanner** - Support scan barcode produk

### Deployment
- [ ] **Cloud Deployment** - Deploy ke cloud (AWS/GCP)
- [ ] **Backup Automation** - Auto backup database
- [ ] **Multi-branch** - Support multiple toko

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=weekn_pos
CORS_ORIGINS=*
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://weeknpos-1.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 🎨 Design System

### Colors
- **Primary Orange**: #FFB366 (dari logo WEEKN)
- **Secondary Teal**: #4DD0E1 (dari logo WEEKN)
- **Success Green**: #10B981
- **Danger Red**: #EF4444
- **Text Dark**: #1F2937

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Large Buttons**: text-2xl (24px) - untuk BAYAR button
- **Prices**: text-4xl (36px) - untuk total amount
- **Touch Targets**: Minimum 60px height

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **UUID** - Unique IDs (tidak pakai MongoDB ObjectID)

### Frontend
- **React 19** - Latest React
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library

### Database
- **MongoDB** - NoSQL database for flexibility

## 📄 License

MIT License - WEEKN POS System

---

**Built with ❤️ for WEEKN - Everyday is Weekend** 🌊☀️
