# 🍰 WEEKN - Multi-Store Bakery Management System

## 📋 Overview

WEEKN adalah sistem manajemen toko roti komprehensif yang menangani:
- **Multi-Store Management**: Kelola beberapa toko retail
- **Production Management**: Manajemen produksi di pabrik central
- **Point of Sale (POS)**: Sistem kasir lengkap dengan split payment
- **Customer Orders**: Dua metode pemesanan (langsung dari stok atau order ke pabrik)
- **Delivery Management**: Integrasi kurir internal & ojek online dengan kalkulasi jarak otomatis
- **Return Management**: Sistem retur barang lengkap
- **Inventory Tracking**: Tracking stok multi-lokasi, bahan baku, produk rusak

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18
- **Styling**: CSS, Tailwind-like utilities
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Passlib with bcrypt

### External Services
- **Google Maps Distance Matrix API**: Untuk kalkulasi jarak delivery

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- MongoDB
- Yarn package manager

### Environment Variables

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=weekn_db
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
GOOGLE_MAPS_API_KEY=AIzaSyCTJrRCiIGYDn2kz9ON6aL-gyf9mZr0ZEw
```

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Installation & Running

```bash
# Backend
cd backend
pip install -r requirements.txt
sudo supervisorctl restart backend

# Frontend
cd frontend
yarn install
sudo supervisorctl restart frontend
```

## 👥 Default Credentials

**Super Admin:**
- Email: `admin@weekn.com`
- Password: `admin123`

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `/docs`:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem dan desain database
- **[DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md)**: Rencana pengembangan fase-demi-fase
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)**: API endpoints dan usage
- **[DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)**: Schema database detail
- **[WORKFLOW.md](./docs/WORKFLOW.md)**: Business workflow dan user journey
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)**: Panduan deployment

## 🎯 Current Status

### ✅ Completed Features (Phase 0)

- ✅ Core POS System
  - Product grid dengan search & filter
  - Shopping cart management
  - Split payment (cash + digital)
  - Transaction history

- ✅ Management Dashboard
  - Product management (CRUD)
  - Customer management (CRUD)
  - User management dengan role-based access
  - Reports & analytics

- ✅ Shift Management
  - Open/close shift dengan cash reconciliation
  - Track sales per shift
  - Shift history

- ✅ Discount & Promo
  - Item-level discount
  - Transaction-level discount

- ✅ Authentication & Authorization
  - JWT-based authentication
  - Role-based access (Super Admin, Kasir)
  - Protected routes

### 🚧 In Planning (Next Phases)

- 🔄 **Phase 1**: Multi-Store Foundation
- 🔄 **Phase 2**: Production Management + Packing + Damaged Tracking
- 🔄 **Phase 3**: Stock Replenishment + Packing
- 🔄 **Phase 4A**: Struk + Delivery Integration
- 🔄 **Phase 4B**: Customer PO + Packing
- 🔄 **Phase 5**: Enhanced Reporting
- 🔄 **Phase 6**: Return Management

Detail lengkap di [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md)

## 🏢 Business Model

### Store Structure
- **Multiple Retail Stores**: Toko-toko retail yang melayani customer langsung
- **Central Production Factory**: Pabrik produksi yang supply ke semua toko

### Transaction Types

1. **STRUK (Direct Sale)**
   - Customer beli produk yang ada di stok toko
   - Payment langsung (full)
   - Optional delivery dengan kurir WEEKN atau ojek online

2. **PO CUSTOMER (Production Order)**
   - Customer pesan untuk acara beberapa hari ke depan
   - Order dikirim ke pabrik untuk produksi khusus
   - Payment: DP atau Full
   - Optional delivery

3. **STOCK ORDER (Store Replenishment)**
   - Toko order stok ke pabrik untuk 2 hari ke depan
   - Internal transfer antar lokasi

4. **RETURN/RETUR**
   - Customer return produk
   - Refund atau exchange

## 🔐 User Roles & Permissions

### Super Admin
- Full access ke semua fitur
- User management
- Store management
- Reports & analytics

### Kasir (Cashier)
- POS operations
- Create customer orders
- View reports (limited)

### Factory Admin (Future)
- Production management
- Raw materials management
- Recipe management
- Approve stock orders

### Store Manager (Future)
- Store-specific management
- Stock orders
- Local reporting

## 📊 Key Metrics

- **Daily Sales**: Total penjualan per hari per toko
- **Stock Levels**: Real-time stock per produk per lokasi
- **Production Output**: Jumlah produksi vs target
- **Damaged Goods**: Tracking barang rusak (produksi & retur)
- **Delivery Performance**: Kurir WEEKN vs Ojek Online
- **Customer Returns**: Return rate & reasons

## 🤝 Contributing

Untuk developer yang ingin berkontribusi:

1. Baca [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md) untuk understand roadmap
2. Baca [ARCHITECTURE.md](./docs/ARCHITECTURE.md) untuk understand struktur sistem
3. Follow coding conventions yang sudah ada
4. Test semua changes sebelum commit
5. Update dokumentasi jika ada perubahan significant

## 📝 Notes for Next Developer

### Important Conventions

1. **MongoDB ObjectId Handling**: Selalu exclude `_id` saat fetch data untuk avoid serialization issues
   ```python
   products = await db.products.find({}, {"_id": 0}).to_list(1000)
   ```

2. **API Route Prefix**: Semua backend routes HARUS pakai prefix `/api`
   ```python
   @router.post("/api/products")
   ```

3. **Environment Variables**: JANGAN hardcode URLs, ports, atau credentials. Selalu pakai env vars

4. **DateTime**: Gunakan `datetime.now(timezone.utc)` bukan `datetime.utcnow()`

5. **Store-Aware Models**: Semua model utama akan memiliki `store_id` field untuk multi-store support

### Testing Strategy

- Use testing subagent untuk comprehensive testing
- Test file location: `/app/backend/tests/`
- Maintain separate test files per feature/module

### Code Structure Philosophy

- **Modular**: Setiap phase independent, tidak break existing features
- **Backward Compatible**: Data lama tetap bisa diakses
- **Simple & Maintainable**: Avoid over-engineering

## 📞 Support

Untuk pertanyaan atau issue, refer ke dokumentasi di folder `/docs` atau contact team lead.

## 📄 License

Proprietary - WEEKN Bakery

---

**Last Updated**: December 2025
**Version**: 1.0.0 (Phase 0 - MVP Complete)
