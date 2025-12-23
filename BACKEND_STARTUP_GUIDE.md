# Backend Server Startup Guide

## Problem
You're getting `ERR_CONNECTION_REFUSED` because the backend server is not running on port 8080.

## Solution: Start the Backend Server

### Option 1: Using Maven (Recommended)

1. **Open a new terminal** in the backend directory:
   ```bash
   cd d:\PayRoll\backend
   ```

2. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

   OR if you have Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Wait for the server to start**. You should see:
   ```
   Started PayrollApplication in X.XXX seconds
   ```

### Option 2: Using IDE (IntelliJ IDEA / Eclipse)

1. Open the `backend` folder in your IDE
2. Find the main application class (usually `PayrollApplication.java` or similar)
3. Right-click and select "Run" or "Debug"

### Option 3: Build and Run JAR

1. **Build the project:**
   ```bash
   cd d:\PayRoll\backend
   mvn clean package
   ```

2. **Run the JAR file:**
   ```bash
   java -jar target/payroll-*.jar
   ```

## Verify Backend is Running

Once started, you should be able to access:
- **Health Check**: http://localhost:8080/actuator/health (if actuator is enabled)
- **API Base**: http://localhost:8080/api/v1

You can test in browser or use curl:
```bash
curl http://localhost:8080/api/v1/auth/login
```

## Common Issues

### Issue 1: Port 8080 Already in Use
**Error**: `Port 8080 is already in use`

**Solution**: 
- Find and kill the process using port 8080:
  ```bash
  netstat -ano | findstr :8080
  taskkill /PID <PID_NUMBER> /F
  ```

### Issue 2: Maven Not Found
**Error**: `mvn is not recognized`

**Solution**:
- Install Maven: https://maven.apache.org/download.cgi
- Or use the Maven wrapper: `./mvnw` instead of `mvn`

### Issue 3: Java Not Found
**Error**: `java is not recognized`

**Solution**:
- Install Java JDK 17 or higher
- Set JAVA_HOME environment variable

### Issue 4: Database Connection Error
**Error**: Database connection failed

**Solution**:
- Check if your database (MySQL/PostgreSQL) is running
- Verify database credentials in `application.properties` or `application.yml`

## After Backend Starts

1. **Keep the backend terminal running**
2. **In a new terminal**, start the frontend:
   ```bash
   cd d:\PayRoll\frontend
   npm run dev
   ```

3. **Test the connection**:
   - Go to http://localhost:5173 (or your frontend port)
   - Try to login or signup
   - Check browser console for errors

## Backend Configuration

Check your backend configuration file:
- Location: `backend/src/main/resources/application.properties` or `application.yml`
- Verify:
  - Server port: `server.port=8080`
  - Database connection
  - CORS settings (should allow http://localhost:5173)

## CORS Configuration

Make sure your backend allows requests from the frontend. Add this to your Spring Boot configuration:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd d:\PayRoll\backend
mvn spring-boot:run

# Terminal 2 - Frontend (after backend starts)
cd d:\PayRoll\frontend
npm run dev
```

## Troubleshooting Checklist

- [ ] Java JDK installed (version 17+)
- [ ] Maven installed or using Maven wrapper
- [ ] Database running (if required)
- [ ] Port 8080 is free
- [ ] Backend starts without errors
- [ ] Can access http://localhost:8080
- [ ] CORS configured correctly
- [ ] Frontend environment variable set: `VITE_API_URL=http://localhost:8080/api/v1`

## Next Steps

Once the backend is running:
1. ✅ Backend running on http://localhost:8080
2. ✅ Frontend running on http://localhost:5173
3. ✅ Try signup/login
4. ✅ Check browser console for any errors
5. ✅ Check backend logs for API calls

## Need Help?

If you continue to face issues:
1. Check backend console logs for errors
2. Check browser console (F12) for detailed error messages
3. Verify API endpoints exist in your backend
4. Test API endpoints directly using Postman or curl
