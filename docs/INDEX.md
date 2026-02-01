# 📚 WEEKN Documentation Index

Selamat datang di dokumentasi lengkap sistem WEEKN!

## 📋 Daftar Dokumentasi

### 1. [README.md](../README.md)
**Overview Proyek**
- Tech stack
- Quick start guide
- Environment setup
- Current status & roadmap
- Credentials default

### 2. [ARCHITECTURE.md](./ARCHITECTURE.md)
**Arsitektur Sistem**
- System overview & diagram
- Directory structure
- Database architecture
- API architecture
- Authentication flow
- Frontend architecture
- Security & performance considerations
- Deployment architecture

### 3. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
**Schema Database**
- Collections list (13 collections)
- Detail schema per collection
- Relationships & linking
- Indexes
- Query examples
- Data migration strategy
- MongoDB best practices

### 4. [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
**Rencana Pengembangan**
- Phase 0-6 detail (20-27 hari kerja)
- Tasks per phase
- Database changes
- Backend implementation
- Frontend implementation
- Testing strategy
- Deliverables per phase
- Development best practices

### 5. [WORKFLOW.md](./WORKFLOW.md)
**Business Workflow**
- User roles & responsibilities
- Daily operations workflow
- Production management
- Stock replenishment
- Customer PO with delivery
- Return management
- Reporting workflow
- Key decision points
- Error handling & edge cases

---

## 🎯 Quick Navigation

### Untuk Developer Baru

**Start Here**:
1. Baca [README.md](../README.md) - Get overview
2. Baca [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand structure
3. Baca [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Know data models
4. Baca [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - See roadmap

### Untuk Business/Product Owner

**Start Here**:
1. Baca [README.md](../README.md) - Current features
2. Baca [WORKFLOW.md](./WORKFLOW.md) - How system works
3. Baca [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Future features

### Untuk QA/Tester

**Start Here**:
1. Baca [WORKFLOW.md](./WORKFLOW.md) - User journeys
2. Baca [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Test cases per phase

---

## 🔍 Cari Informasi Spesifik

### Database
- **Schema detail** → [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Relationships** → [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Section "Relationships"
- **Migration** → [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Section "Data Migration Strategy"

### API
- **Endpoints list** → [ARCHITECTURE.md](./ARCHITECTURE.md) - Section "API Architecture"
- **Authentication** → [ARCHITECTURE.md](./ARCHITECTURE.md) - Section "Authentication & Authorization"
- **Error handling** → [WORKFLOW.md](./WORKFLOW.md) - Section "Error Handling & Edge Cases"

### Features
- **Current features** → [README.md](../README.md) - Section "Current Status"
- **Planned features** → [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- **Feature workflow** → [WORKFLOW.md](./WORKFLOW.md)

### Code
- **Directory structure** → [ARCHITECTURE.md](./ARCHITECTURE.md) - Section "Directory Structure"
- **Best practices** → [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Section "Development Best Practices"
- **Common pitfalls** → [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Section "Notes for Developers"

---

## 📊 Development Roadmap

```
Phase 0: MVP ✅ COMPLETED
   └─ Core POS, Products, Customers, Shifts, Users, Discounts

Phase 1: Multi-Store Foundation 🔴 PLANNED (2-3 hari)
   └─ Store management, store-aware models

Phase 2: Production Management 🔴 PLANNED (4-5 hari)
   └─ Raw materials, recipes, production orders, packing, damaged tracking

Phase 3: Stock Replenishment 🔴 PLANNED (3-4 hari)
   └─ Toko order stok ke pabrik, packing workflow

Phase 4A: STRUK + Delivery 🔴 PLANNED (2-3 hari)
   └─ Google Maps integration, delivery calculation

Phase 4B: Customer PO 🔴 PLANNED (4-5 hari)
   └─ Customer orders, DP/full payment, packing

Phase 5: Enhanced Reporting 🔴 PLANNED (2-3 hari)
   └─ Advanced analytics, charts, dashboards

Phase 6: Return Management 🔴 PLANNED (3-4 hari)
   └─ Refund, exchange, damaged goods from returns
```

**Total Estimasi**: 20-27 hari kerja

---

## 🚀 Getting Started - Implementation Guide

### Step 1: Environment Setup
```bash
# Clone repository (jika belum)
git clone <repository-url>

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env  # Edit dengan credentials yang benar

# Frontend setup
cd frontend
yarn install
cp .env.example .env  # Edit dengan backend URL

# Start services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Step 2: Database Setup
```bash
# MongoDB should be running
# Access MongoDB:
mongo

# Create database
use weekn_db

# Import initial data (jika ada)
mongoimport --db weekn_db --collection products --file data/products.json
```

### Step 3: Create Super Admin
```bash
# Call setup endpoint
curl -X POST http://localhost:8001/api/auth/setup
```

### Step 4: Login & Explore
1. Open browser: `http://localhost:3000`
2. Login dengan credentials:
   - Email: `admin@weekn.com`
   - Password: `admin123`
3. Explore existing features

---

## 🛠️ Development Workflow

### Starting a New Phase

1. **Read Phase Documentation**
   - [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Find your phase
   - Understand objectives & tasks
   - Check dependencies

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/phase-X-name
   ```

3. **Database Changes First**
   - Update schema (refer to DATABASE_SCHEMA.md)
   - Create migration script if needed
   - Test migration in dev environment

4. **Backend Implementation**
   - Create models (`/backend/models/`)
   - Create routes (`/backend/routes/`)
   - Add API endpoints
   - Test with curl or Postman

5. **Frontend Implementation**
   - Create pages (`/frontend/src/pages/`)
   - Create components (`/frontend/src/components/`)
   - Integrate with API
   - Test UI flows

6. **Testing**
   - Use testing subagent for backend
   - Use frontend testing subagent or manual testing
   - Update `/app/test_result.md`

7. **Documentation**
   - Update relevant docs if needed
   - Add comments in complex code
   - Document new API endpoints

8. **Code Review & Merge**
   ```bash
   git add .
   git commit -m "feat(phase-X): implement feature Y"
   git push origin feature/phase-X-name
   # Create PR for review
   ```

---

## 📝 Code Conventions

### Python (Backend)
```python
# File naming: lowercase_with_underscores.py
# Class naming: PascalCase
class ProductModel:
    pass

# Function naming: snake_case
def calculate_total():
    pass

# Constants: UPPER_CASE
MAX_ITEMS = 100
```

### JavaScript (Frontend)
```javascript
// File naming: PascalCase for components, camelCase for utilities
// ProductsPage.js, apiHelper.js

// Component naming: PascalCase
function ProductsPage() {}

// Function naming: camelCase
function calculateTotal() {}

// Constants: UPPER_CASE
const MAX_ITEMS = 100;
```

### API Endpoints
```
Pattern: /api/{resource}/{action}

Examples:
GET    /api/products           # List
GET    /api/products/:id       # Detail
POST   /api/products           # Create
PUT    /api/products/:id       # Update
DELETE /api/products/:id       # Delete
POST   /api/shifts/open        # Custom action
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoServerError: Authentication failed

Solution:
- Check MONGO_URL in backend/.env
- Ensure MongoDB is running: sudo systemctl status mongod
- Check credentials
```

#### 2. CORS Error
```
Error: CORS policy blocked

Solution:
- Check backend CORS configuration in server.py
- Ensure REACT_APP_BACKEND_URL is correct in frontend/.env
```

#### 3. JWT Token Invalid
```
Error: 401 Unauthorized

Solution:
- Check JWT_SECRET in backend/.env
- Re-login to get new token
- Check token expiration time
```

#### 4. Hot Reload Not Working
```
Issue: Code changes not reflected

Solution:
- Check supervisor status: sudo supervisorctl status
- Restart service: sudo supervisorctl restart backend/frontend
- Check file watcher limits: cat /proc/sys/fs/inotify/max_user_watches
```

---

## 📞 Support & Resources

### Internal Resources
- **Codebase**: `/app/backend`, `/app/frontend`
- **Test Results**: `/app/test_result.md`
- **Logs**: 
  - Backend: `/var/log/supervisor/backend.*.log`
  - Frontend: `/var/log/supervisor/frontend.*.log`

### External Resources
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **MongoDB Docs**: https://www.mongodb.com/docs/
- **Google Maps API**: https://developers.google.com/maps/documentation

### Getting Help
1. Check documentation first
2. Search in code for similar implementation
3. Check test_result.md for previous issues
4. Ask team lead or senior developer

---

## 📈 Metrics & KPIs

### Development Metrics
- **Code Coverage**: Target 70%+
- **API Response Time**: < 500ms
- **Page Load Time**: < 3s
- **Bug Fix Time**: < 2 days
- **Feature Completion**: On schedule

### Business Metrics
- **Daily Active Users**: Track login sessions
- **Transaction Volume**: Transactions per day
- **Average Transaction Value**: Revenue / Transactions
- **Production Efficiency**: Good products / Target
- **Return Rate**: Returns / Total transactions

---

## 🎓 Learning Path for New Developers

### Week 1: Understanding the System
- [ ] Read all documentation (2 days)
- [ ] Setup development environment (1 day)
- [ ] Explore existing features as user (1 day)
- [ ] Review codebase structure (1 day)

### Week 2: Small Contributions
- [ ] Fix minor bugs (2 days)
- [ ] Add small features (2 days)
- [ ] Write tests (1 day)

### Week 3: Feature Development
- [ ] Implement a complete phase (5 days)

### Week 4: Code Review & Optimization
- [ ] Review others' code (2 days)
- [ ] Optimize existing features (2 days)
- [ ] Documentation updates (1 day)

---

## 🔄 Document Updates

**Last Updated**: December 2025
**Version**: 1.0
**Next Review**: After Phase 1 completion

**Update Process**:
1. Update relevant documentation after each phase
2. Review all docs quarterly
3. Keep README.md current status updated
4. Archive old versions if major changes

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau butuh klarifikasi, jangan ragu untuk membuat issue atau contact team lead.
