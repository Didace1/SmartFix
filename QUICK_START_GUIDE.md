# SmartFix Quick Start Guide
## How to Run Your Application

---

## 🔧 Error Fixed: CORS Configuration

**The error you saw:**
```
Unsafe attempt to load URL http://localhost:3000/dashboard from frame with URL chrome-error://chromewebdata/
```

**What it meant:** Your frontend couldn't connect to the backend due to missing CORS configuration.

**What was fixed:**
- ✅ Added CORS configuration to allow frontend-backend communication
- ✅ Configured server port (8080) in application.properties
- ✅ Set up proper cross-origin resource sharing

---

## 🚀 How to Start Your Application

### Prerequisites
1. **PostgreSQL** must be running on port 5432
2. **Node.js** and **npm** installed
3. **Java 17** and **Maven** installed

---

### Step 1: Start PostgreSQL Database

Make sure PostgreSQL is running with:
- **Database:** `smartfix_db`
- **Username:** `postgres`
- **Password:** `Didace@2023`
- **Port:** `5432`

---

### Step 2: Start Backend (Spring Boot)

Open terminal in the `smartfix` directory:

```bash
cd smartfix
mvn clean install
mvn spring-boot:run
```

**Expected output:**
```
Started SmartfixApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

**Backend will run on:** `http://localhost:8080`

---

### Step 3: Start Frontend (React)

Open a **new terminal** in the `smartfix-frontend` directory:

```bash
cd smartfix-frontend
npm install  # Only needed first time
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view smartfix-frontend in the browser.
Local: http://localhost:3000
```

**Frontend will run on:** `http://localhost:3000`

---

### Step 4: Start AI Backend (Python/FastAPI)

Open a **third terminal** in the `AI_BACKEND` directory:

```bash
cd smartfix\AI_BACKEND
python -m venv .venv  # Only needed first time
.venv\Scripts\activate
pip install -r requirements.txt  # Only needed first time
uvicorn app.main:app --reload --port 8000
```

**AI Backend will run on:** `http://localhost:8000`

---

## 🌐 Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Frontend (React)                                   │
│  http://localhost:3000                              │
│  - User Interface                                   │
│  - Dashboard, Forms, Reports                        │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP Requests (CORS enabled)
                   │
┌──────────────────▼──────────────────────────────────┐
│                                                     │
│  Backend (Spring Boot)                              │
│  http://localhost:8080                              │
│  - REST API                                         │
│  - Business Logic                                   │
│  - Authentication                                   │
│  - Database Access                                  │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├──────────────┬──────────────────┐
                   │              │                  │
┌──────────────────▼───┐  ┌───────▼────────┐  ┌─────▼──────┐
│                      │  │                │  │            │
│  PostgreSQL          │  │  AI Backend    │  │  Models    │
│  localhost:5432      │  │  localhost:8000│  │  /models/  │
│  - smartfix_db       │  │  - Diagnosis   │  │  - ML      │
│                      │  │  - Prediction  │  │    Models  │
│                      │  │                │  │            │
└──────────────────────┘  └────────────────┘  └────────────┘
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to backend"

**Check if backend is running:**
```bash
curl http://localhost:8080/api/auth/login
```

**If not running:**
```bash
cd smartfix
mvn spring-boot:run
```

---

### Error: "CORS policy blocked"

**Solution:** The CORS configuration has been added to `CorsConfig.java`. Just restart the backend:
```bash
# Stop the backend (Ctrl+C)
# Start it again
mvn spring-boot:run
```

---

### Error: "Database connection failed"

**Check PostgreSQL is running:**
```bash
psql -U postgres -d smartfix_db
```

**If database doesn't exist:**
```sql
CREATE DATABASE smartfix_db;
```

---

### Error: "Port 3000 already in use"

**Find and kill the process:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

### Error: "Port 8080 already in use"

**Find and kill the process:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

---

## 📝 Environment Variables

### Backend (.env or application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/smartfix_db
spring.datasource.username=postgres
spring.datasource.password=Didace@2023
```

### Frontend (.env)
Create a `.env` file in `smartfix-frontend/`:
```
REACT_APP_SYSTEM_BACKEND_URL=http://localhost:8080
REACT_APP_AI_BACKEND_URL=http://localhost:8000
```

### AI Backend (.env)
Already exists in `AI_BACKEND/.env`:
```
DATABASE_URL=postgresql://postgres:Didace@2023@localhost:5432/smartfix_db
BACKEND_URL=http://localhost:8080
```

---

## ✅ Verification Checklist

After starting all services, verify:

- [ ] PostgreSQL running on port 5432
- [ ] Spring Boot backend running on port 8080
- [ ] React frontend running on port 3000
- [ ] AI backend running on port 8000
- [ ] Can access http://localhost:3000 in browser
- [ ] No CORS errors in browser console
- [ ] Can login to the application

---

## 🎯 Quick Test

1. **Open browser:** http://localhost:3000
2. **Register a new account** or **Login**
3. **Navigate to Dashboard** - should load without errors
4. **Try Fault Diagnosis** - AI should respond
5. **Check browser console** - no CORS errors

---

## 🔄 Daily Development Workflow

### Morning Startup
```bash
# Terminal 1 - Backend
cd smartfix
mvn spring-boot:run

# Terminal 2 - Frontend
cd smartfix-frontend
npm start

# Terminal 3 - AI Backend (if needed)
cd smartfix\AI_BACKEND
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Evening Shutdown
- Press `Ctrl+C` in each terminal
- Or close all terminals

---

## 📚 Additional Resources

- **AI Training Guide:** `smartfix/AI_BACKEND/AI_TRAINING_GUIDE.md`
- **Training Summary:** `smartfix/AI_BACKEND/TRAINING_SUMMARY.md`
- **Defense Guide:** `DEFENSE_GUIDE.md`

---

## 🎉 You're All Set!

Your SmartFix application is now properly configured with:
- ✅ CORS enabled for frontend-backend communication
- ✅ All ports properly configured
- ✅ AI models trained and ready (99.57% accuracy)
- ✅ Complete device coverage (51 models, 17 fault types)

**Happy coding! 🚀**
