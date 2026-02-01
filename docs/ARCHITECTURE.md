# 🏗️ WEEKN System Architecture

## 📐 System Overview

WEEKN adalah sistem manajemen bakery multi-store dengan arsitektur modular yang terdiri dari:
- Frontend (React SPA)
- Backend API (FastAPI)
- Database (MongoDB)
- External Services (Google Maps API)

## 🗂️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ POS Page │  │Dashboard │  │Management│              │
│  └──────────┘  └──────────┘  └──────────┘              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST API
                        │ (JSON)
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (FastAPI)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Routes  │  │  Models  │  │  Utils   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└───────────────────────┬─────────────────────────────────┘
                        │ MongoDB Driver
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   DATABASE (MongoDB)                     │
│  Collections: products, transactions, customers,         │
│               shifts, users, stores, etc.                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                           │
│  • Google Maps Distance Matrix API                       │
└──────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
/app
├── backend/
│   ├── models/              # Pydantic models (data validation)
│   │   ├── product.py
│   │   ├── transaction.py
│   │   ├── customer.py
│   │   ├── shift.py
│   │   ├── user.py
│   │   ├── store.py        # [PHASE 1]
│   │   ├── raw_material.py # [PHASE 2]
│   │   ├── recipe.py       # [PHASE 2]
│   │   ├── production_order.py # [PHASE 2]
│   │   ├── stock_order.py  # [PHASE 3]
│   │   ├── customer_po.py  # [PHASE 4B]
│   │   ├── return.py       # [PHASE 6]
│   │   └── damaged_goods.py # [PHASE 2]
│   │
│   ├── routes/             # API endpoints
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── transactions.py
│   │   ├── customers.py
│   │   ├── shifts.py
│   │   ├── reports.py
│   │   ├── stores.py       # [PHASE 1]
│   │   ├── raw_materials.py # [PHASE 2]
│   │   ├── recipes.py      # [PHASE 2]
│   │   ├── production_orders.py # [PHASE 2]
│   │   ├── stock_orders.py # [PHASE 3]
│   │   ├── customer_pos.py # [PHASE 4B]
│   │   ├── delivery.py     # [PHASE 4A]
│   │   ├── returns.py      # [PHASE 6]
│   │   └── damaged_goods.py # [PHASE 2]
│   │
│   ├── utils/              # Utility functions
│   │   ├── auth.py         # JWT & password hashing
│   │   └── google_maps.py  # [PHASE 4A] Google Maps API
│   │
│   ├── tests/              # Test files
│   │   └── (separate files per feature)
│   │
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Cart.js
│   │   │   ├── CustomerModal.js
│   │   │   ├── DiscountModal.js
│   │   │   ├── PaymentModal.js
│   │   │   ├── ShiftModal.js
│   │   │   ├── Sidebar.js
│   │   │   ├── StoreSelector.js    # [PHASE 1]
│   │   │   ├── DeliveryModal.js    # [PHASE 4A]
│   │   │   ├── PackingSlip.js      # [PHASE 2]
│   │   │   └── ReturnModal.js      # [PHASE 6]
│   │   │
│   │   ├── layouts/        # Layout components
│   │   │   └── SidebarLayout.js
│   │   │
│   │   ├── pages/          # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CashierPage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── CustomersPage.js
│   │   │   ├── ShiftPage.js
│   │   │   ├── ReportsPage.js
│   │   │   ├── UsersPage.js
│   │   │   ├── StoresPage.js          # [PHASE 1]
│   │   │   ├── RawMaterialsPage.js    # [PHASE 2]
│   │   │   ├── RecipesPage.js         # [PHASE 2]
│   │   │   ├── ProductionPage.js      # [PHASE 2]
│   │   │   ├── StockOrdersPage.js     # [PHASE 3]
│   │   │   ├── CustomerPOPage.js      # [PHASE 4B]
│   │   │   ├── PackingPage.js         # [PHASE 2]
│   │   │   ├── ReturnsPage.js         # [PHASE 6]
│   │   │   └── DamagedGoodsPage.js    # [PHASE 2]
│   │   │
│   │   ├── App.js          # Main app component & routing
│   │   ├── App.css         # Global styles
│   │   └── index.js        # Entry point
│   │
│   ├── package.json        # NPM dependencies
│   └── .env                # Environment variables
│
├── docs/                   # Documentation (this folder)
├── test_result.md          # Testing results log
└── README.md               # Project overview
```

## 🗄️ Database Architecture

### Collections Overview

#### Phase 0 (Current - Completed)
1. **products**: Master produk
2. **transactions**: Transaksi penjualan (struk)
3. **customers**: Data customer
4. **shifts**: Data shift kasir
5. **users**: User & authentication

#### Phase 1-6 (Planned)
6. **stores**: Master toko & pabrik
7. **raw_materials**: Bahan baku
8. **recipes**: Resep produk
9. **production_orders**: Order produksi
10. **stock_orders**: Order stok toko ke pabrik
11. **customer_pos**: Purchase order dari customer
12. **returns**: Return/retur barang
13. **damaged_goods**: Tracking barang rusak

### Store-Aware Architecture

Mulai Phase 1, semua collection utama akan memiliki field `store_id` untuk mendukung multi-store:

```javascript
// Example: Product dengan store_id
{
  "id": "prod-001",
  "name": "Kue Ulang Tahun",
  "price": 250000,
  "stock": 10,
  "store_id": "store-001",  // ← NEW FIELD
  // ... other fields
}
```

### Data Relationships

```
stores (1) ──────< (many) products
  │
  ├──────< (many) transactions
  │
  ├──────< (many) shifts
  │
  ├──────< (many) users
  │
  └──────< (many) stock_orders

products (1) ──────< (many) recipes
  │
  └──────< (many) production_orders

raw_materials (1) ──────< (many) recipe.ingredients
  │
  └──────< (many) production_orders.materials_used

customers (1) ──────< (many) transactions
  │
  ├──────< (many) customer_pos
  │
  └──────< (many) returns

transactions (1) ──────< (1) returns

customer_pos (1) ──────< (1) production_orders
```

## 🔐 Authentication & Authorization

### JWT Flow

```
┌────────┐                 ┌────────┐                 ┌────────┐
│ Client │                 │ Backend│                 │  DB    │
└───┬────┘                 └───┬────┘                 └───┬────┘
    │                          │                          │
    │ POST /api/auth/login     │                          │
    ├─────────────────────────>│                          │
    │ {email, password}        │                          │
    │                          │ Verify credentials       │
    │                          ├─────────────────────────>│
    │                          │                          │
    │                          │<─────────────────────────┤
    │                          │ User data                │
    │                          │                          │
    │<─────────────────────────┤                          │
    │ {token, user}            │                          │
    │                          │                          │
    │ GET /api/products        │                          │
    │ Header: Authorization    │                          │
    ├─────────────────────────>│                          │
    │                          │ Verify JWT               │
    │                          │ Decode user info         │
    │                          │                          │
    │                          │ Fetch data               │
    │                          ├─────────────────────────>│
    │                          │                          │
    │<─────────────────────────┤                          │
    │ Response data            │                          │
```

### Role Hierarchy

```
Super Admin
  ├── Full system access
  ├── Manage all stores
  ├── User management
  └── System configuration

Factory Admin (Future)
  ├── Production management
  ├── Raw materials
  ├── Approve stock orders
  └── Factory-specific reports

Store Manager (Future)
  ├── Store-specific management
  ├── Create stock orders
  ├── Local reports
  └── Customer PO management

Kasir (Cashier)
  ├── POS operations
  ├── Customer orders
  ├── View reports (limited)
  └── Single store access
```

## 🔄 Workflow Architecture

### Transaction Types Flow

```
┌──────────────────────────────────────────────────────────┐
│                      CUSTOMER                            │
└─────────────────┬────────────────────┬───────────────────┘
                  │                    │
          Beli Langsung         Pesan Custom
          (Ada Stok)           (Beberapa Hari)
                  │                    │
                  ▼                    ▼
         ┌────────────────┐   ┌────────────────┐
         │  STRUK/SALE    │   │  CUSTOMER PO   │
         │  (Transaction) │   │                │
         └────────┬───────┘   └────────┬───────┘
                  │                    │
         Stok Toko │                   │ Order ke Pabrik
         Berkurang │                   │
                  │                    ▼
                  │           ┌────────────────┐
                  │           │ PRODUCTION     │
                  │           │ ORDER          │
                  │           └────────┬───────┘
                  │                    │
                  │                    │ Produksi
                  │                    │
                  ▼                    ▼
         ┌────────────────┐   ┌────────────────┐
         │  DELIVERY      │   │  PACKING       │
         │  (Optional)    │   │                │
         └────────────────┘   └────────┬───────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  DELIVERY      │
                              │                │
                              └────────────────┘
```

### Production Workflow

```
┌─────────────────┐
│ Raw Materials   │
│ Inventory       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│ Recipe          │─────>│ Production      │
│ Definition      │      │ Order           │
└─────────────────┘      └────────┬────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                         ▼                 ▼
                  ┌─────────────┐   ┌─────────────┐
                  │ Good        │   │ Damaged     │
                  │ Products    │   │ Goods       │
                  └──────┬──────┘   └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Quality     │
                  │ Check       │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Packing     │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Ready to    │
                  │ Ship        │
                  └─────────────┘
```

## 🌐 API Architecture

### RESTful API Design

**Base URL**: `{REACT_APP_BACKEND_URL}/api`

**Authentication**: JWT Bearer Token in Authorization header

### API Structure

```
/api
├── /auth
│   ├── POST   /login
│   ├── POST   /setup
│   └── GET    /verify
│
├── /users
│   ├── GET    /
│   ├── POST   /
│   └── DELETE /:id
│
├── /stores                    [PHASE 1]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /products
│   ├── GET    /              (with ?store_id filter)
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /transactions
│   ├── GET    /
│   ├── POST   /
│   └── GET    /:id
│
├── /customers
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /shifts
│   ├── POST   /open
│   ├── POST   /:id/close
│   ├── GET    /active
│   └── GET    /history
│
├── /raw-materials             [PHASE 2]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /recipes                   [PHASE 2]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /production-orders         [PHASE 2]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id/status
│   ├── POST   /:id/complete
│   └── GET    /:id/packing-slip
│
├── /stock-orders              [PHASE 3]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id/status
│   └── GET    /:id/packing-slip
│
├── /customer-pos              [PHASE 4B]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id/status
│   ├── POST   /:id/payment
│   └── GET    /:id/packing-slip
│
├── /delivery                  [PHASE 4A]
│   └── POST   /calculate-distance
│
├── /returns                   [PHASE 6]
│   ├── GET    /
│   ├── POST   /
│   ├── PUT    /:id/approve
│   └── PUT    /:id/process
│
├── /damaged-goods             [PHASE 2]
│   ├── GET    /
│   └── POST   /
│
└── /reports
    ├── GET    /daily-sales
    ├── GET    /inventory
    ├── GET    /production
    └── GET    /delivery-performance
```

## 🔌 External Integrations

### Google Maps Distance Matrix API

**Purpose**: Calculate delivery distance

**Endpoint**: `https://maps.googleapis.com/maps/api/distancematrix/json`

**Usage**:
```javascript
const response = await fetch(
  `https://maps.googleapis.com/maps/api/distancematrix/json?` +
  `origins=${startLat},${startLng}&` +
  `destinations=${endLat},${endLng}&` +
  `key=${GOOGLE_MAPS_API_KEY}`
);
```

**Response**:
```json
{
  "rows": [{
    "elements": [{
      "distance": {"value": 5200, "text": "5.2 km"},
      "duration": {"value": 900, "text": "15 mins"}
    }]
  }]
}
```

## 📱 Frontend Architecture

### Component Hierarchy

```
App
├── LoginPage (public route)
└── SidebarLayout (protected routes)
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Menu
    │   ├── Store Selector [PHASE 1]
    │   └── User Info
    │
    └── Page Content
        ├── Dashboard
        ├── CashierPage
        │   ├── ProductGrid
        │   ├── Cart
        │   ├── PaymentModal
        │   │   └── DeliverySection [PHASE 4A]
        │   └── ShiftIndicator
        │
        ├── ProductsPage
        │   └── ProductTable (CRUD)
        │
        ├── CustomersPage
        │   └── CustomerTable (CRUD)
        │
        ├── ShiftPage
        │   ├── ShiftModal
        │   └── ShiftHistory
        │
        ├── ReportsPage
        │
        ├── UsersPage
        │
        └── [New Pages in Future Phases]
```

### State Management Strategy

**Current**: Local state dengan React Hooks

**Considerations for Future**:
- Context API untuk global state (store selection, user info)
- React Query untuk data fetching & caching
- Redux jika complexity meningkat

## 🔒 Security Considerations

### Backend Security
1. **Password Hashing**: Bcrypt dengan salt
2. **JWT Secret**: Strong secret key di environment variable
3. **CORS**: Configured untuk frontend domain only
4. **Input Validation**: Pydantic models untuk semua input
5. **SQL Injection Prevention**: MongoDB driver (not applicable)
6. **Rate Limiting**: Consider untuk production

### Frontend Security
1. **Token Storage**: LocalStorage (consider HttpOnly cookies untuk production)
2. **XSS Prevention**: React auto-escaping
3. **CSRF**: JWT tidak vulnerable ke CSRF
4. **API Key Protection**: Google Maps API key di backend, bukan exposed di frontend

## ⚡ Performance Considerations

### Database Indexing

Recommended indexes:
```javascript
// products
db.products.createIndex({ "store_id": 1, "name": 1 })
db.products.createIndex({ "store_id": 1, "category": 1 })

// transactions
db.transactions.createIndex({ "store_id": 1, "timestamp": -1 })

// customer_pos
db.customer_pos.createIndex({ "store_id": 1, "status": 1 })

// stock_orders
db.stock_orders.createIndex({ "from_store_id": 1, "status": 1 })
db.stock_orders.createIndex({ "to_store_id": 1, "status": 1 })
```

### Caching Strategy

**Frontend**:
- Cache product list (refresh on CRUD)
- Cache store list
- Cache user info

**Backend** (Future):
- Redis untuk session storage
- Cache frequently accessed data (products, stores)

### API Response Time Targets

- Simple GET: < 100ms
- Complex queries: < 500ms
- Google Maps API: < 2s (external)
- Transaction creation: < 300ms

## 🧪 Testing Strategy

### Backend Testing
- Unit tests per route
- Integration tests untuk workflows
- Test coverage target: 70%+

### Frontend Testing
- Component testing (React Testing Library)
- E2E testing (Playwright) via testing subagent
- Manual testing untuk UI/UX

### Test Files Organization
```
/app/backend/tests/
├── test_auth.py
├── test_products.py
├── test_transactions.py
├── test_production.py      [PHASE 2]
├── test_stock_orders.py    [PHASE 3]
└── test_customer_pos.py    [PHASE 4B]
```

## 🚀 Deployment Architecture

### Current (Development)
```
┌─────────────────────────────────────┐
│     Kubernetes Container            │
│  ┌──────────────────────────────┐   │
│  │  Frontend (port 3000)        │   │
│  │  React Dev Server            │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Backend (port 8001)         │   │
│  │  FastAPI (Supervisor)        │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  MongoDB (internal)          │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Production (Recommended)
```
┌─────────────────────────────────────┐
│         Load Balancer               │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐       ┌─────────┐
│ Frontend│       │ Frontend│
│ (Nginx) │       │ (Nginx) │
└─────────┘       └─────────┘
    │                   │
    └─────────┬─────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐       ┌─────────┐
│ Backend │       │ Backend │
│ (Uvicorn│       │ (Uvicorn│
└─────────┘       └─────────┘
    │                   │
    └─────────┬─────────┘
              │
              ▼
    ┌─────────────────┐
    │  MongoDB Cluster│
    │  (Replica Set)  │
    └─────────────────┘
```

## 📈 Scalability Considerations

### Horizontal Scaling
- Frontend: Stateless, easy to scale
- Backend: Stateless (JWT), easy to scale
- Database: MongoDB sharding by store_id

### Vertical Scaling
- Start dengan 2 CPU, 4GB RAM
- Monitor dan adjust based on load

### Future Optimizations
- CDN untuk static assets
- Database read replicas
- Microservices jika complexity meningkat

## 🔧 Development Workflow

### Branch Strategy (Recommended)
```
main (production)
  ├── develop (staging)
  │   ├── feature/phase-1-multistore
  │   ├── feature/phase-2-production
  │   ├── feature/phase-3-stock-orders
  │   └── bugfix/issue-123
```

### Code Review Process
1. Create feature branch
2. Implement & test locally
3. Run linter (Python: ruff, JS: ESLint)
4. Create PR to develop
5. Code review
6. Merge to develop
7. Test in staging
8. Merge to main

---

**Document Version**: 1.0
**Last Updated**: December 2025
