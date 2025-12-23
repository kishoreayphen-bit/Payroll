# Backend Database Setup Guide

## Issue
The backend requires PostgreSQL database to run, but it's not currently installed or running.

## Quick Solutions

### Option 1: Install PostgreSQL (Recommended for Production)

#### Using Chocolatey (Easiest):
```powershell
# Run as Administrator
choco install postgresql -y

# Start PostgreSQL service
net start postgresql-x64-17  # Version may vary
```

#### Manual Installation:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for postgres user (remember this!)
4. Default port: 5432

#### After Installation:
```powershell
# Create database
psql -U postgres
CREATE DATABASE payroll;
\q
```

---

### Option 2: Use H2 Database (Quickest - In-Memory)

**For quick testing without PostgreSQL:**

Update `application.yml` to use H2 instead:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:payroll
    username: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
  h2:
    console:
      enabled: true
```

Add H2 dependency to `pom.xml`:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

### Option 3: Use Docker PostgreSQL (Best for Development)

```powershell
# Install Docker Desktop first: https://www.docker.com/products/docker-desktop

# Run PostgreSQL in Docker
docker run --name payroll-postgres `
  -e POSTGRES_DB=payroll `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:15

# Verify it's running
docker ps
```

---

## Current Configuration

Your backend expects:
- **Database**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database Name**: payroll
- **Username**: postgres
- **Password**: postgres

---

## Start Backend After Database Setup

Once database is ready:

```powershell
cd d:\PayRoll\backend
mvn spring-boot:run
```

Or with full path:
```powershell
& "C:\Users\KishoreMuthu\Downloads\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run
```

---

## Verify Database Connection

```powershell
# Test PostgreSQL connection
psql -U postgres -d payroll -c "SELECT version();"
```

---

## Environment Variables (Optional)

You can override database settings:

```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_NAME="payroll"
$env:DB_USER="postgres"
$env:DB_PASSWORD="your_password"

mvn spring-boot:run
```

---

## Recommended: Quick H2 Setup

**Fastest way to get backend running NOW:**

1. I'll update your config to use H2 (in-memory database)
2. No installation needed
3. Perfect for development/testing
4. Data resets on restart (good for testing)

**Would you like me to configure H2 for you?**

This will let you:
- ✅ Start backend immediately
- ✅ Test frontend authentication
- ✅ No database installation needed
- ✅ Switch to PostgreSQL later when ready
