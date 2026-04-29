# SmartFix - AI-Powered Device Repair Management System

An intelligent repair shop management platform built for **Corex Ltd** that combines AI-powered fault diagnosis with end-to-end repair workflow management, inventory tracking, and sales processing.

## Features

- **AI Fault Diagnosis** - Machine learning model (TF-IDF + Random Forest) trained on 2,190+ device records to predict faults from symptom descriptions, with device-aware context for laptops and smartphones
- **Brand-Specific Repair Actions** - Step-by-step technician instructions tailored to Dell, HP, Lenovo, Apple, ASUS, Acer, Samsung, Google, OnePlus, and Xiaomi
- **Inventory Management** - Track stock levels, reorder points, purchase costs, and stock entry dates with low-stock alerts
- **Repair Task Tracking** - Assign, track, and manage repair jobs across technicians
- **Sales & Checkout** - Process device and spare part sales with anonymous customer support and receipt generation
- **Role-Based Dashboards** - Separate views for Admin, Technician, Inventory Manager, and Salesperson
- **PDF Reports** - Generate downloadable AI diagnosis reports and business analytics
- **Email Notifications** - OTP-based authentication and repair status updates via SMTP

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, React Router, React Hook Form |
| **Backend API** | Spring Boot 4.0.5 (Java 17), Spring Data JPA, PostgreSQL |
| **AI Backend** | Python (FastAPI), scikit-learn, pandas, TF-IDF Vectorizer, Random Forest Classifier |
| **Database** | PostgreSQL |
| **Build** | Maven (backend), npm (frontend), pip (AI) |

## Project Structure

```
smartfix/                          # Spring Boot backend
├── src/main/java/.../smartfix/
│   ├── controller/                # REST API endpoints
│   ├── model/                     # JPA entities
│   ├── repository/                # Data access layer
│   ├── service/                   # Business logic
│   ├── dto/                       # Request/Response DTOs
│   └── config/                    # CORS, security, data seeder
├── AI_BACKEND/                    # Python AI service
│   ├── app/
│   │   ├── main.py                # FastAPI endpoints
│   │   ├── brand_knowledge.py     # Brand-specific repair knowledge
│   │   └── models/
│   │       └── diagnosis_model.py # ML model (training + prediction)
│   └── data/raw/                  # Training CSV data
└── src/main/resources/
    └── application.properties

smartfix-frontend/                 # React frontend
├── src/
│   ├── features/
│   │   ├── auth/                  # Login, Registration
│   │   ├── dashboard/             # Role-based dashboards
│   │   ├── fault-diagnosis/       # AI diagnosis workflow
│   │   ├── inventory/             # Stock management
│   │   ├── repair-tasks/          # Repair job tracking
│   │   ├── sales/                 # Sales & checkout
│   │   ├── reports/               # Analytics & reports
│   │   ├── admin/                 # User & category management
│   │   └── notifications/         # Alerts
│   └── shared/                    # Reusable components
└── public/
```

## Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **Python 3.10+** and pip
- **PostgreSQL 14+**

## Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE smartfix_db;
```

### 2. Spring Boot Backend

```bash
cd smartfix
# Update database credentials in src/main/resources/application.properties if needed
./mvnw spring-boot:run
```

Runs on **http://localhost:8080**

### 3. AI Backend

```bash
cd smartfix/AI_BACKEND
pip install fastapi uvicorn scikit-learn pandas numpy
uvicorn app.main:app --host 0.0.0.0 --port 5000
```

Runs on **http://localhost:5000** - The ML model auto-trains on first startup from the CSV data.

### 4. React Frontend

```bash
cd smartfix-frontend
npm install
npm start
```

Runs on **http://localhost:3000**

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/smartfix_db` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | - | DB password |
| `AI_BACKEND_URL` | `http://localhost:5000` | AI service URL |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Allowed frontend origins |
| `REACT_APP_SYSTEM_BACKEND_URL` | `http://localhost:8080` | Backend URL for frontend |
| `REACT_APP_AI_BACKEND_URL` | `http://localhost:5000` | AI backend URL for frontend |

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access, user approval, category management |
| **Technician** | AI diagnosis, repair tasks, device management |
| **Inventory Manager** | Stock management, reorder alerts, stock reports |
| **Salesperson** | Sales checkout, receipt generation, customer handling |

## API Endpoints

### Spring Boot (`/api`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Authentication
- `GET/POST/PUT/DELETE /api/inventory` - Inventory CRUD
- `GET/POST/PUT /api/repair-tasks` - Repair task management
- `GET /api/dashboard/*` - Dashboard statistics
- `GET /api/reports/*` - Business reports

### AI Backend (`/api`)
- `POST /api/diagnosis` - AI fault diagnosis
- `POST /api/failure-prediction` - Component failure prediction
- `POST /api/repair-recommendation` - Repair recommendations

## License

This project is developed for Corex Ltd.
