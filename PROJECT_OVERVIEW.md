# PAYROLL APPLICATION - PROJECT OVERVIEW

## 📋 Project Information

**Project Name:** Comprehensive Payroll Management System  
**Repository:** https://github.com/kishoreayphen-bit/Payroll.git  
**Type:** Full-Stack Web Application  
**Domain:** HR & Payroll Management  

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│         https://github.com/kishoreayphen-bit/Payroll.git   │
└────────────────┬───────────────────────────┬────────────────┘
                 │                           │
                 │                           │
       ┌─────────▼──────────┐      ┌────────▼─────────┐
       │   Auto Deploy      │      │   Auto Deploy    │
       │   (GitHub Actions) │      │  (GitHub Actions)│
       └─────────┬──────────┘      └────────┬─────────┘
                 │                           │
                 │                           │
       ┌─────────▼──────────┐      ┌────────▼─────────┐
       │   BACKEND          │      │   FRONTEND       │
       │   Render.com       │◄────►│   Vercel         │
       │   (Free Tier)      │      │                  │
       └─────────┬──────────┘      └──────────────────┘
                 │
                 │
       ┌─────────▼──────────┐
       │   PostgreSQL       │
       │   Database         │
       │   (Render)         │
       └────────────────────┘
```

---

## 💻 Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18+ | UI Framework |
| **shadcn/ui** | Latest | Component Library |
| **react-hook-form** | 7+ | Form Management |
| **Zod** | 3+ | Schema Validation |
| **TailwindCSS** | 3+ | Styling |
| **React Router** | 6+ | Routing |
| **Axios** | Latest | HTTP Client |
| **Tanstack Query** | 5+ | Server State Management |
| **Zustand** | 4+ | Client State Management |
| **date-fns** | Latest | Date Manipulation |
| **Recharts** | Latest | Data Visualization |
| **Lucide React** | Latest | Icons |

#### Frontend Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Form components
│   │   ├── layouts/         # Layout components
│   │   ├── common/          # Shared components
│   │   └── modules/         # Feature-specific components
│   ├── lib/
│   │   ├── api/             # API client setup
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── validators/      # Zod schemas
│   ├── pages/               # Page components
│   ├── routes/              # Route configuration
│   ├── store/               # Zustand stores
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Programming Language |
| **Spring Boot** | 3.x | Application Framework |
| **Spring Security** | 6.x | Authentication & Authorization |
| **Spring Data JPA** | Latest | ORM/Data Access |
| **PostgreSQL** | 15+ | Database |
| **Hibernate** | Latest | JPA Implementation |
| **Lombok** | Latest | Boilerplate Reduction |
| **MapStruct** | Latest | DTO Mapping |
| **Swagger/OpenAPI** | 3.x | API Documentation |
| **JWT (jjwt)** | Latest | Token-based Auth |
| **ModelMapper** | Latest | Object Mapping |
| **Apache POI** | Latest | Excel Generation |
| **iText** | Latest | PDF Generation |
| **Liquibase** | Latest | Database Migration |

#### Backend Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/payroll/
│   │   │   ├── config/           # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── SwaggerConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/       # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── EmployeeController.java
│   │   │   │   ├── PayrollController.java
│   │   │   │   └── ...
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── entity/           # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Employee.java
│   │   │   │   ├── PayrollCycle.java
│   │   │   │   └── ...
│   │   │   ├── repository/       # JPA Repositories
│   │   │   ├── service/          # Business Logic
│   │   │   │   ├── impl/
│   │   │   │   └── ...
│   │   │   ├── security/         # Security Components
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   ├── exception/        # Custom Exceptions
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ...
│   │   │   ├── util/             # Utility Classes
│   │   │   ├── constants/        # Constants
│   │   │   └── PayrollApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/
│   │           └── changelog/    # Liquibase migrations
│   └── test/                     # Unit & Integration Tests
├── .gitignore
├── pom.xml
└── README.md
```

### Database Schema Overview

**Total Tables:** 80+ tables across 13 modules

**Key Entity Relationships:**
- Tenant (Multi-tenancy support)
- Organization → Departments → Employees
- PayrollCycle → EmployeePayroll → PayrollComponents
- Attendance → Leaves → Shifts
- SalaryStructure → SalaryComponents → SalaryRevisions
- TaxDeclarations → InvestmentProofs → Form16

---

## 🚀 Deployment Strategy

### Continuous Deployment Pipeline

#### 1. GitHub Repository Setup
```yaml
# Repository: https://github.com/kishoreayphen-bit/Payroll.git

# Branch Strategy:
- main          # Production
- develop       # Development
- feature/*     # Feature branches
- hotfix/*      # Hotfix branches
```

#### 2. Backend Deployment (Render.com)

**Platform:** Render.com Free Tier  
**Service Type:** Web Service  
**Region:** Auto-selected  

**Render Configuration (`render.yaml`):**
```yaml
services:
  - type: web
    name: payroll-backend
    env: java
    buildCommand: mvn clean install -DskipTests
    startCommand: java -jar target/payroll-backend-0.0.1-SNAPSHOT.jar
    envVars:
      - key: JAVA_VERSION
        value: 17
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: DATABASE_URL
        fromDatabase:
          name: payroll-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ALLOWED_ORIGINS
        value: https://payroll-frontend.vercel.app
    autoDeploy: true
    branch: main
    healthCheckPath: /api/actuator/health

databases:
  - name: payroll-db
    databaseName: payroll
    user: payroll_user
    plan: free
```

**Environment Variables (Render Dashboard):**
- `DATABASE_URL` - Auto-provided by Render
- `JWT_SECRET` - Generate secure secret
- `JWT_EXPIRATION` - 86400000 (24 hours)
- `SPRING_PROFILES_ACTIVE` - prod
- `CORS_ALLOWED_ORIGINS` - Frontend URL
- `MAIL_USERNAME` - Email service
- `MAIL_PASSWORD` - Email password

**Backend URL:** `https://payroll-backend.onrender.com`

#### 3. Frontend Deployment (Vercel)

**Platform:** Vercel  
**Framework Preset:** Vite  
**Root Directory:** `frontend/`  

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://payroll-backend.onrender.com/api/:path*"
    }
  ]
}
```

**Environment Variables (Vercel Dashboard):**
- `VITE_API_BASE_URL` - `https://payroll-backend.onrender.com/api`
- `VITE_APP_NAME` - Payroll Management System
- `VITE_APP_ENV` - production

**Frontend URL:** `https://payroll-frontend.vercel.app`

#### 4. Auto-Deployment Workflow

**GitHub Actions (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Build with Maven
        run: mvn clean install -DskipTests
      # Render auto-deploys from GitHub webhook

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Deployment Triggers:**
- Push to `main` branch → Auto-deploy to Production
- Push to `develop` branch → Auto-deploy to Staging
- Pull Request → Preview deployment (Vercel)

---

## 📦 Module Overview (13 Core Modules)

| # | Module Name | Epic Count | User Stories | Priority |
|---|-------------|------------|--------------|----------|
| 1 | Tenant & Organization Management | 2 | 8 | HIGH |
| 2 | User Management & Roles | 3 | 12 | HIGH |
| 3 | Employee & Contractor Management | 5 | 20 | HIGH |
| 4 | Payroll Configuration | 4 | 16 | HIGH |
| 5 | Time & Attendance | 6 | 24 | MEDIUM |
| 6 | Payroll Run & Processing | 5 | 20 | HIGH |
| 7 | Tax, Compliance & Statutory | 6 | 24 | HIGH |
| 8 | Payments & Disbursements | 4 | 16 | HIGH |
| 9 | Payslips & Reporting | 3 | 12 | HIGH |
| 10 | Employee Self-Service Portal | 4 | 16 | MEDIUM |
| 11 | Integrations | 3 | 12 | LOW |
| 12 | Audit, Security, Logging | 3 | 12 | MEDIUM |
| 13 | System Administration | 4 | 16 | MEDIUM |
| **TOTAL** | **13 Modules** | **52 Epics** | **208 Stories** | - |

---

## 🎯 Development Phases

### Phase 1: Foundation (Weeks 1-3)
- Project setup (Frontend + Backend)
- Database schema design
- Authentication & Authorization
- Basic CRUD operations
- Deployment pipeline setup

### Phase 2: Core Modules (Weeks 4-8)
- Employee Management
- Payroll Configuration
- Attendance & Leave Management
- Salary Structure

### Phase 3: Payroll Processing (Weeks 9-12)
- Payroll Run Engine
- Tax Calculations
- Payment Processing
- Payslip Generation

### Phase 4: Compliance & Reporting (Weeks 13-15)
- Statutory Compliance
- Form 16 Generation
- Reports & Analytics
- Audit Trail

### Phase 5: Advanced Features (Weeks 16-18)
- Employee Self-Service
- Integrations
- Mobile Responsiveness
- Performance Optimization

### Phase 6: Testing & Launch (Weeks 19-20)
- End-to-end Testing
- UAT
- Security Audit
- Production Launch

---

## 🔐 Security Requirements

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Password encryption (BCrypt)
- 2FA support (optional)

### Authorization
- Role-Based Access Control (RBAC)
- Permission-based access
- Module-level permissions
- Data-level security

### Data Security
- Encryption at rest (sensitive data)
- Encryption in transit (HTTPS/TLS)
- PII data masking
- Audit logging

### Compliance
- GDPR compliance
- Data retention policies
- Right to be forgotten
- Data export functionality

---

## 📊 Key Performance Indicators (KPIs)

### Technical KPIs
- API Response Time: < 500ms (avg)
- Page Load Time: < 2s
- Database Query Time: < 100ms (avg)
- Uptime: 99.5%
- Error Rate: < 0.1%

### Business KPIs
- Time to Process Payroll: < 30 minutes
- Payroll Accuracy: 99.9%
- User Adoption Rate: 80%
- Support Ticket Resolution: < 24 hours

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests:** Vitest
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright
- **Coverage Target:** 80%

### Backend Testing
- **Unit Tests:** JUnit 5
- **Integration Tests:** Spring Boot Test
- **API Tests:** RestAssured
- **Coverage Target:** 80%

### Test Environments
- Local Development
- CI/CD (GitHub Actions)
- Staging (Render + Vercel Preview)
- Production

---

## 📝 Documentation Standards

### Code Documentation
- JavaDoc for all public methods
- JSDoc for complex functions
- README for each module
- API documentation (Swagger)

### User Documentation
- User Guide
- Admin Guide
- API Reference
- Video Tutorials

---

## 🛠️ Development Tools

### Required Tools
- IDE: IntelliJ IDEA / VS Code
- Database: PostgreSQL (local + Render)
- API Testing: Postman / Insomnia
- Version Control: Git + GitHub Desktop
- Design: Figma (for UI mockups)

### Optional Tools
- Database GUI: pgAdmin / DBeaver
- Swagger UI: API documentation
- Liquibase: Database migrations
- GitHub Copilot: AI assistance

---

## 📞 Support & Maintenance

### Support Channels
- Email Support
- In-app Chat
- Knowledge Base
- Video Tutorials

### Maintenance Windows
- Daily: 2:00 AM - 3:00 AM IST (Database backups)
- Weekly: Sunday 1:00 AM - 2:00 AM IST (Updates)
- Monthly: First Sunday (Major updates)

---

## 🚦 Success Criteria

### MVP (Minimum Viable Product)
- ✅ Employee Management
- ✅ Attendance Tracking
- ✅ Payroll Processing
- ✅ Payment Generation
- ✅ Payslip Distribution
- ✅ Basic Reports

### Version 1.0 (Full Release)
- ✅ All 13 modules implemented
- ✅ Complete statutory compliance
- ✅ Advanced reporting
- ✅ Employee self-service
- ✅ Mobile responsive
- ✅ Integration APIs

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Development Team
