# Troubleshooting Guide - 401 and 404 Errors

## 🔴 Errors You're Seeing

### Error 1: 401 Unauthorized on `/api/auth/login`
```
Failed to load resource: the server responded with a status of 401 ()
8080/api/auth/login:1
```

### Error 2: 404 Not Found on Performance Dashboard
```
Failed to load resource: the server responded with a status of 404 ()
8080/api/performance/dashboard:1
Error loading dashboard: Error: Failed to load dashboard
```

### Error 3: 404 Not Found on AI Assistant
```
Failed to load resource: the server responded with a status of 404 ()
8080/api/technician-assistance/analyze:1
```

---

## 🔍 Root Cause Analysis

### Problem 1: Backend Not Running or Not Fully Started
The 404 errors mean the endpoints don't exist, which suggests:
- Spring Boot backend is not running
- Backend started but controllers not loaded
- Backend crashed during startup

### Problem 2: Login Credentials Wrong
The 401 error means authentication failed:
- Wrong username/password
- User doesn't exist in database
- User not approved (if approval system is active)

---

## ✅ SOLUTION 1: Check if Backend is Running

### Step 1: Check Backend Terminal
Look at your Spring Boot terminal. You should see:
```
Started SmartfixApplication in X.XXX seconds
```

If you don't see this, the backend didn't start properly.

### Step 2: Check for Errors in Backend Logs
Look for red error messages like:
```
ERROR: Could not create connection to database
ERROR: Bean creation failed
ERROR: Port 8080 is already in use
```

### Step 3: Restart Backend
```bash
cd smartfix
mvnw clean install
mvnw spring-boot:run
```

Wait until you see:
```
Started SmartfixApplication in X.XXX seconds (JVM running for X.XXX)
```

---

## ✅ SOLUTION 2: Verify Controllers are Loaded

### Check Backend Logs for Controller Registration

When Spring Boot starts, it should log all endpoints. Look for:
```
Mapped "{[/api/performance/dashboard],methods=[GET]}" onto ...
Mapped "{[/api/technician-assistance/analyze],methods=[POST]}" onto ...
```

If you DON'T see these, the controllers are not being loaded.

### Possible Causes:
1. **Controllers not in component scan path**
2. **Missing @RestController annotation**
3. **Compilation errors**

### Fix: Rebuild the Project
```bash
cd smartfix
mvnw clean compile
mvnw spring-boot:run
```

---

## ✅ SOLUTION 3: Check Database Connection

### The controllers might not load if database connection fails

### Step 1: Check PostgreSQL is Running
```bash
# Windows
# Check if PostgreSQL service is running in Services app
```

### Step 2: Check Database Exists
```sql
-- Connect to PostgreSQL
psql -U postgres

-- List databases
\l

-- You should see: smartfix_db
```

### Step 3: Check application.properties
File: `smartfix/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smartfix_db
spring.datasource.username=smartfix_user
spring.datasource.password=your_password

# Make sure these match your actual database credentials
```

---

## ✅ SOLUTION 4: Fix Login (401 Error)

### Option A: Use Default Admin Credentials

Try logging in with:
- **Username:** `admin`
- **Password:** `admin123`

### Option B: Check if User Exists in Database

```sql
-- Connect to database
psql -U smartfix_user -d smartfix_db

-- Check users
SELECT id, username, email, role, approved FROM users;

-- You should see at least one admin user
```

### Option C: Create Admin User Manually

If no users exist:
```sql
-- Insert admin user (password is 'admin123' hashed with BCrypt)
INSERT INTO users (username, email, password, role, full_name, approved, created_at)
VALUES (
    'admin',
    'admin@smartfix.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
    'admin',
    'System Administrator',
    true,
    NOW()
);
```

### Option D: Check DataSeeder

File: `smartfix/src/main/java/com/aidevice/smartfix/config/DataSeeder.java`

Make sure it's creating default users on startup.

---

## ✅ SOLUTION 5: Verify All Required Services Exist

### Check if these services exist:

1. **TechnicianPerformanceService**
```bash
# Should exist at:
smartfix/src/main/java/com/aidevice/smartfix/service/TechnicianPerformanceService.java
```

2. **TechnicianAssistanceService**
```bash
# Should exist at:
smartfix/src/main/java/com/aidevice/smartfix/service/technician/intelligence/TechnicianAssistanceService.java
```

3. **RepairCaseRepository**
```bash
# Should exist at:
smartfix/src/main/java/com/aidevice/smartfix/repository/RepairCaseRepository.java
```

### If any are missing, they need to be created!

---

## ✅ SOLUTION 6: Check CORS Configuration

### Make sure CORS allows your frontend

File: `smartfix/src/main/java/com/aidevice/smartfix/config/CorsConfig.java`

Should have:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🔧 STEP-BY-STEP DEBUGGING

### Step 1: Stop Everything
- Stop Spring Boot backend (Ctrl+C)
- Stop React frontend (Ctrl+C)
- Stop PostgreSQL (if you want to restart it)

### Step 2: Start PostgreSQL
Make sure PostgreSQL is running

### Step 3: Check Database
```sql
psql -U postgres
\l  -- List databases
\c smartfix_db  -- Connect to database
\dt  -- List tables
SELECT * FROM users LIMIT 5;  -- Check users
```

### Step 4: Clean and Rebuild Backend
```bash
cd smartfix
mvnw clean
mvnw compile
```

Look for compilation errors. Fix any errors before proceeding.

### Step 5: Start Backend with Verbose Logging
```bash
mvnw spring-boot:run
```

Watch the logs carefully. Look for:
- ✅ "Started SmartfixApplication"
- ✅ "Mapped {[/api/performance/dashboard]"
- ✅ "Mapped {[/api/technician-assistance/analyze]"
- ❌ Any ERROR messages

### Step 6: Test Endpoints with curl

**Test Performance Dashboard:**
```bash
curl http://localhost:8080/api/performance/dashboard
```

Expected: JSON response with dashboard data
If 404: Controller not loaded
If 500: Server error (check logs)

**Test AI Assistant:**
```bash
curl -X POST http://localhost:8080/api/technician-assistance/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "deviceType": "Smartphone",
    "brand": "Samsung",
    "symptoms": "Screen not working"
  }'
```

Expected: JSON response with analysis
If 404: Controller not loaded
If 500: Server error (check logs)

### Step 7: Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Expected: JSON with token
If 401: Wrong credentials or user doesn't exist
If 404: Auth controller not loaded

### Step 8: Start Frontend
```bash
cd smartfix-frontend
npm start
```

### Step 9: Try Logging In
- Open http://localhost:3000
- Try login with admin/admin123
- Check browser console for errors
- Check Network tab for API calls

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: "Port 8080 is already in use"
**Fix:**
```bash
# Windows - Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue 2: "Could not create connection to database"
**Fix:**
- Check PostgreSQL is running
- Check database credentials in application.properties
- Check database exists: `psql -U postgres -l`

### Issue 3: "Bean creation failed"
**Fix:**
- Check for missing dependencies in pom.xml
- Run `mvnw clean install`
- Check for circular dependencies

### Issue 4: "Table 'repair_cases' doesn't exist"
**Fix:**
Run the migration script:
```sql
-- Connect to database
psql -U smartfix_user -d smartfix_db

-- Run migration
\i database_migrations/add_repair_case_edit_tracking.sql
```

Or let Hibernate create it:
```properties
# In application.properties
spring.jpa.hibernate.ddl-auto=update
```

### Issue 5: Controllers not found (404)
**Fix:**
1. Check @RestController annotation exists
2. Check @RequestMapping path is correct
3. Check controller is in correct package
4. Rebuild: `mvnw clean compile`

---

## 📋 CHECKLIST

Before asking for help, verify:

- [ ] PostgreSQL is running
- [ ] Database `smartfix_db` exists
- [ ] Backend compiles without errors (`mvnw clean compile`)
- [ ] Backend starts successfully (see "Started SmartfixApplication")
- [ ] Backend logs show controller mappings
- [ ] Can access http://localhost:8080 (should see error page, not connection refused)
- [ ] Admin user exists in database
- [ ] Frontend is running on http://localhost:3000
- [ ] Browser console shows the actual error
- [ ] Network tab shows the failed requests

---

## 🆘 QUICK FIX (Nuclear Option)

If nothing works, try this:

```bash
# 1. Stop everything
# Ctrl+C on all terminals

# 2. Clean everything
cd smartfix
mvnw clean
cd ../smartfix-frontend
rm -rf node_modules package-lock.json

# 3. Rebuild everything
cd ../smartfix
mvnw clean install -DskipTests
cd ../smartfix-frontend
npm install

# 4. Reset database (WARNING: Deletes all data!)
psql -U postgres
DROP DATABASE smartfix_db;
CREATE DATABASE smartfix_db;
GRANT ALL PRIVILEGES ON DATABASE smartfix_db TO smartfix_user;
\q

# 5. Start backend (will recreate tables)
cd smartfix
mvnw spring-boot:run

# 6. Wait for "Started SmartfixApplication"

# 7. Start frontend in new terminal
cd smartfix-frontend
npm start

# 8. Try logging in with admin/admin123
```

---

## 📞 NEXT STEPS

1. **Follow Step-by-Step Debugging** above
2. **Check backend logs** for specific errors
3. **Test endpoints with curl** to isolate frontend vs backend issues
4. **Share the actual error messages** from backend logs if still stuck

The 404 errors mean the controllers aren't loaded. Focus on getting the backend to start properly first!
