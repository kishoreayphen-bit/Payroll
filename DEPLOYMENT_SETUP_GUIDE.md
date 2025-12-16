# DEPLOYMENT SETUP GUIDE

**Repository:** https://github.com/kishoreayphen-bit/Payroll.git  
**Backend:** Render.com (Free Tier)  
**Frontend:** Vercel  
**Database:** PostgreSQL on Render  

---

## 📋 Prerequisites

### Required Accounts
1. **GitHub Account** - Repository hosting
2. **Render Account** - Backend + Database hosting (https://render.com)
3. **Vercel Account** - Frontend hosting (https://vercel.com)

### Required Tools (Local Development)
- **Git** (v2.30+)
- **Node.js** (v18+)
- **Java JDK** (v17+)
- **Maven** (v3.8+)
- **PostgreSQL** (v15+) - Local development
- **VS Code** or **IntelliJ IDEA**

---

## 🚀 Step 1: Repository Setup

### 1.1 Create GitHub Repository

```bash
# Clone or create repository
git clone https://github.com/kishoreayphen-bit/Payroll.git
cd Payroll

# Create folder structure
mkdir -p backend frontend
```

### 1.2 Repository Structure

```
Payroll/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD workflow
├── .gitignore
├── README.md
└── render.yaml            # Render deployment config
```

---

## 🎯 Step 2: Backend Setup (Spring Boot)

### 2.1 Create Spring Boot Project

**Option 1: Using Spring Initializr (https://start.spring.io/)**

```
Project: Maven
Language: Java
Spring Boot: 3.2.0
Packaging: Jar
Java: 17

Dependencies:
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- Lombok
- Validation
- Spring Boot DevTools
- Spring Boot Actuator
```

**Option 2: Using Maven Archetype**

```bash
cd backend
mvn archetype:generate \
  -DgroupId=com.payroll \
  -DartifactId=payroll-backend \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### 2.2 Configure `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.payroll</groupId>
    <artifactId>payroll-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>Payroll Management System</name>
    <description>Comprehensive Payroll Management Backend</description>
    
    <properties>
        <java.version>17</java.version>
        <jwt.version>0.12.3</jwt.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <springdoc.version>2.3.0</springdoc.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Liquibase for DB migrations -->
        <dependency>
            <groupId>org.liquibase</groupId>
            <artifactId>liquibase-core</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        
        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>
        
        <!-- Apache POI for Excel -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>
        
        <!-- iText for PDF -->
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>itext7-core</artifactId>
            <version>8.0.2</version>
            <type>pom</type>
        </dependency>
        
        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.3 Configure `application.yml`

**File: `src/main/resources/application.yml`**

```yaml
spring:
  application:
    name: payroll-backend
  
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  
  # JPA/Hibernate
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  # Liquibase
  liquibase:
    enabled: true
    change-log: classpath:db/changelog/db.changelog-master.xml
  
  # Multipart file upload
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# Server configuration
server:
  port: ${PORT:8080}
  error:
    include-message: always
    include-binding-errors: always

# Actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

# Application specific
app:
  jwt:
    secret: ${JWT_SECRET:defaultSecretKeyForDevelopmentOnlyChangeInProduction}
    expiration: ${JWT_EXPIRATION:86400000}
    refresh-expiration: ${JWT_REFRESH_EXPIRATION:604800000}
  
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
    allowed-headers: "*"
    allow-credentials: true

# Swagger/OpenAPI
springdoc:
  api-docs:
    path: /api/v1/api-docs
  swagger-ui:
    path: /api/v1/swagger-ui.html
    enabled: true
```

**File: `src/main/resources/application-dev.yml`**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/payroll_dev
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    show-sql: true

logging:
  level:
    com.payroll: DEBUG
    org.springframework.web: DEBUG
```

**File: `src/main/resources/application-prod.yml`**

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    show-sql: false

logging:
  level:
    com.payroll: INFO
```

### 2.4 Configure Swagger

**File: `src/main/java/com/payroll/config/SwaggerConfig.java`**

```java
package com.payroll.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI payrollOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
            .info(new Info()
                .title("Payroll Management System API")
                .description("Comprehensive Payroll Management REST API Documentation")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Payroll Team")
                    .email("support@payroll.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
```

---

## 🎨 Step 3: Frontend Setup (React + Vite)

### 3.1 Create React Project

```bash
cd frontend

# Create Vite + React + TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install required packages
npm install react-router-dom axios @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install date-fns recharts
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Initialize Tailwind
npx tailwindcss init -p
```

### 3.2 Install shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Install commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
```

### 3.3 Configure Tailwind

**File: `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3.4 Environment Variables

**File: `.env`**

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Payroll Management System
VITE_APP_ENV=development
```

**File: `.env.production`**

```env
VITE_API_BASE_URL=https://payroll-backend.onrender.com/api/v1
VITE_APP_NAME=Payroll Management System
VITE_APP_ENV=production
```

### 3.5 API Client Setup

**File: `src/lib/api/client.ts`**

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🗄️ Step 4: Database Setup on Render

### 4.1 Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name:** `payroll-db`
   - **Database:** `payroll`
   - **User:** `payroll_user`
   - **Region:** Choose closest region
   - **Plan:** Free
4. Click **"Create Database"**
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### 4.2 Database Connection String

Render provides:
- **Internal URL:** For backend on Render
- **External URL:** For local development

Save these URLs securely.

---

## 🚢 Step 5: Deploy Backend to Render

### 5.1 Create `render.yaml`

**File: `render.yaml` (in root directory)**

```yaml
services:
  - type: web
    name: payroll-backend
    env: java
    region: oregon
    plan: free
    buildCommand: cd backend && mvn clean install -DskipTests
    startCommand: cd backend && java -jar target/payroll-backend-0.0.1-SNAPSHOT.jar
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
      - key: JWT_EXPIRATION
        value: 86400000
      - key: JWT_REFRESH_EXPIRATION
        value: 604800000
      - key: CORS_ALLOWED_ORIGINS
        value: https://payroll-frontend.vercel.app
    healthCheckPath: /api/actuator/health
    autoDeploy: true

databases:
  - name: payroll-db
    databaseName: payroll
    user: payroll_user
    plan: free
```

### 5.2 Deploy to Render

**Option 1: Using Render Dashboard**

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Select `Payroll` repository
5. Configure:
   - **Name:** `payroll-backend`
   - **Environment:** `Java`
   - **Build Command:** `cd backend && mvn clean install -DskipTests`
   - **Start Command:** `cd backend && java -jar target/payroll-backend-0.0.1-SNAPSHOT.jar`
6. Add environment variables (from render.yaml)
7. Click **"Create Web Service"**

**Option 2: Using render.yaml (Recommended)**

1. Push `render.yaml` to GitHub
2. Render auto-detects and deploys

### 5.3 Verify Deployment

- Backend URL: `https://payroll-backend.onrender.com`
- Health check: `https://payroll-backend.onrender.com/api/actuator/health`
- Swagger UI: `https://payroll-backend.onrender.com/api/v1/swagger-ui.html`

---

## 🌐 Step 6: Deploy Frontend to Vercel

### 6.1 Create `vercel.json`

**File: `frontend/vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Authorization, Content-Type" }
      ]
    }
  ]
}
```

### 6.2 Deploy to Vercel

**Option 1: Using Vercel CLI**

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option 2: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_BASE_URL` = `https://payroll-backend.onrender.com/api/v1`
   - `VITE_APP_NAME` = `Payroll Management System`
   - `VITE_APP_ENV` = `production`
6. Click **"Deploy"**

### 6.3 Verify Deployment

- Frontend URL: `https://payroll-frontend.vercel.app`
- Test login and API connectivity

---

## 🔄 Step 7: GitHub Actions CI/CD

### 7.1 Create GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven
      
      - name: Run backend tests
        run: |
          cd backend
          mvn test
  
  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm test
      
      - name: Build frontend
        run: |
          cd frontend
          npm run build
  
  deploy-production:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        run: echo "Render auto-deploys from GitHub"
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

### 7.2 Add GitHub Secrets

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VERCEL_TOKEN` - Get from Vercel dashboard
   - `VERCEL_ORG_ID` - Get from Vercel
   - `VERCEL_PROJECT_ID` - Get from Vercel

---

## ✅ Step 8: Verification Checklist

### Backend Verification
- [ ] Backend deploys successfully to Render
- [ ] Database connection works
- [ ] Swagger UI accessible
- [ ] Health endpoint responds
- [ ] JWT authentication works
- [ ] CORS configured correctly

### Frontend Verification
- [ ] Frontend deploys to Vercel
- [ ] Environment variables loaded
- [ ] API calls reach backend
- [ ] Login/logout works
- [ ] Routing works correctly
- [ ] UI components render properly

### Integration Verification
- [ ] Frontend can call backend APIs
- [ ] JWT tokens issued and validated
- [ ] File uploads work
- [ ] Database CRUD operations work
- [ ] Auto-deployment triggers on git push

---

## 📝 Post-Deployment Tasks

1. **Monitor Application**
   - Check Render logs
   - Check Vercel deployment logs
   - Monitor database usage

2. **Setup Monitoring**
   - Configure error tracking (Sentry)
   - Setup uptime monitoring
   - Configure alerts

3. **Security**
   - Rotate JWT secret regularly
   - Enable HTTPS only
   - Configure rate limiting
   - Setup WAF if needed

4. **Performance**
   - Enable caching
   - Optimize database queries
   - Configure CDN for static assets

---

## 🆘 Troubleshooting

### Common Issues

**Issue 1: Backend won't start on Render**
- Check Java version (must be 17)
- Verify DATABASE_URL is set
- Check Maven build logs

**Issue 2: Database connection fails**
- Verify DATABASE_URL format
- Check if using Internal URL (for Render)
- Verify PostgreSQL driver in pom.xml

**Issue 3: Frontend can't reach backend**
- Check CORS_ALLOWED_ORIGINS
- Verify API_BASE_URL in .env
- Check network tab for errors

**Issue 4: JWT authentication fails**
- Verify JWT_SECRET is set
- Check token expiration settings
- Verify Authorization header format

---

## 📞 Support

- **GitHub Issues:** https://github.com/kishoreayphen-bit/Payroll/issues
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

**Last Updated:** December 2024  
**Maintained By:** Development Team
