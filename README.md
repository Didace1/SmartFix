# 🔧 Intelligent Corex - AI-Powered Electronics Repair Management System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Intelligent Corex** is a comprehensive, AI-powered electronics repair and inventory management system designed for Corex Ltd. The system integrates advanced machine learning capabilities for fault diagnosis, inventory optimization, and customer service automation.

### Key Highlights

- 🤖 **AI-Powered Fault Diagnosis** - Intelligent device troubleshooting
- 📊 **Smart Inventory Management** - AI-driven stock recommendations
- 💬 **Intelligent Chatbot** - Real-time customer support with product information
- 🔍 **QR Code Integration** - Quick product identification and tracking
- 📈 **Advanced Analytics** - Comprehensive business insights and reporting
- 👥 **Multi-Role System** - Admin, Inventory Manager, Sales, and Technician roles

## ✨ Features

### 🔧 Repair Management
- AI-powered fault diagnosis for electronic devices
- Repair task assignment and tracking
- Technician performance analytics
- Spare parts request management
- Complete repair history tracking

### 📦 Inventory Control
- Real-time stock monitoring
- Low stock alerts and notifications
- AI-based restocking recommendations
- QR code generation and scanning
- Multi-category product management
- Purchase cost and selling price tracking

### 💰 Sales Operations
- Point of Sale (POS) system
- Sales history and analytics
- Customer database management
- Revenue tracking and reporting
- Integration with repair services

### 🤖 AI Features
- **Fault Diagnosis**: Machine learning-based device troubleshooting
- **Inventory Optimization**: Predictive analytics for stock management
- **Customer Chatbot**: Natural language processing for customer queries
- **Smart Recommendations**: AI-driven product suggestions

### 📊 Analytics & Reporting
- Real-time dashboard with key metrics
- Sales performance reports
- Inventory valuation and turnover
- Repair analytics and trends
- Category-wise analysis

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  - Admin Dashboard    - Inventory Management                 │
│  - Sales Portal       - Technician Interface                 │
│  - Public Landing     - Customer Chatbot                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Backend (Spring Boot)                           │
│  - User Management    - Inventory Service                    │
│  - Sales Service      - Repair Management                    │
│  - QR Code Service    - Reports & Analytics                  │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼────────┐
│  PostgreSQL  │  │  AI Backend   │
│   Database   │  │   (FastAPI)   │
│              │  │  - Chatbot    │
│              │  │  - ML Models  │
└──────────────┘  └───────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend (Java)
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Primary database
- **Maven** - Build tool
- **JWT** - Token-based authentication
- **ZXing** - QR code generation

### AI Backend (Python)
- **FastAPI** - API framework
- **Scikit-learn** - Machine learning
- **NLTK** - Natural language processing
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **Python 3.11** or higher
- **PostgreSQL 15** or higher
- **Maven 3.8** or higher
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Didace1/intelligent_corex.git
cd intelligent_corex
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE smartfix_db;
CREATE USER smartfix_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartfix_db TO smartfix_user;
```

### 3. Backend Setup (Spring Boot)

```bash
cd smartfix

# Update application.properties with your database credentials
# src/main/resources/application.properties

# Build and run
mvnw clean install
mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. AI Backend Setup (Python)

```bash
cd smartfix/AI_BACKEND

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://smartfix_user:your_password@localhost:5432/smartfix_db" > .env

# Run the AI backend
uvicorn app.main:app --reload --port 8000
```

The AI backend will start on `http://localhost:8000`

### 5. Frontend Setup (React)

```bash
cd smartfix-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_SYSTEM_BACKEND_URL=http://localhost:8080" > .env
echo "REACT_APP_AI_BACKEND_URL=http://localhost:8000" >> .env

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

## ⚙️ Configuration

### Backend Configuration

Edit `smartfix/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/smartfix_db
spring.datasource.username=smartfix_user
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### AI Backend Configuration

Edit `smartfix/AI_BACKEND/.env`:

```env
DATABASE_URL=postgresql://smartfix_user:your_password@localhost:5432/smartfix_db
JAVA_BACKEND_URL=http://localhost:8080
FASTMCP_LOG_LEVEL=ERROR
```

### Frontend Configuration

Edit `smartfix-frontend/.env`:

```env
REACT_APP_SYSTEM_BACKEND_URL=http://localhost:8080
REACT_APP_AI_BACKEND_URL=http://localhost:8000
```

## 🎮 Running the Application

### Development Mode

1. **Start PostgreSQL Database**
   ```bash
   # Ensure PostgreSQL service is running
   ```

2. **Start Backend (Terminal 1)**
   ```bash
   cd smartfix
   mvnw spring-boot:run
   ```

3. **Start AI Backend (Terminal 2)**
   ```bash
   cd smartfix/AI_BACKEND
   .venv\Scripts\activate  # Windows
   uvicorn app.main:app --reload --port 8000
   ```

4. **Start Frontend (Terminal 3)**
   ```bash
   cd smartfix-frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - AI Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Production Build

```bash
# Build Frontend
cd smartfix-frontend
npm run build

# Build Backend
cd ../smartfix
mvnw clean package -DskipTests

# The JAR file will be in target/smartfix-0.0.1-SNAPSHOT.jar
```

## 📁 Project Structure

```
intelligent_corex/
├── smartfix/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aidevice/smartfix/
│   │   │   │   ├── config/           # Configuration classes
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── model/            # JPA entities
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── security/         # Security configuration
│   │   │   │   └── util/             # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/     # Database migrations
│   │   └── test/                     # Unit tests
│   ├── AI_BACKEND/                   # Python AI Backend
│   │   ├── api/                      # API endpoints
│   │   │   ├── chatbot.py           # Chatbot API
│   │   │   └── inventory.py         # Inventory AI API
│   │   ├── app/                      # Application core
│   │   │   └── main.py              # FastAPI app
│   │   ├── models/                   # ML models (pickled)
│   │   ├── requirements.txt
│   │   └── .env
│   ├── qr-codes/                     # Generated QR codes
│   └── pom.xml
├── smartfix-frontend/                # React Frontend
│   ├── public/
│   │   └── images/                   # Static images
│   ├── src/
│   │   ├── features/                 # Feature modules
│   │   │   ├── auth/                # Authentication
│   │   │   ├── dashboard/           # Dashboard
│   │   │   ├── inventory/           # Inventory management
│   │   │   ├── sales/               # Sales module
│   │   │   ├── public/              # Public pages
│   │   │   └── test/                # Test pages
│   │   ├── shared/                   # Shared components
│   │   │   ├── components/          # Reusable components
│   │   │   ├── layouts/             # Layout components
│   │   │   ├── services/            # API services
│   │   │   └── utils/               # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── index.js                 # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── models/                           # Trained ML models
├── README.md
└── .gitignore
```

## 📚 API Documentation

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item
- `GET /api/inventory/analytics` - Get inventory analytics

#### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/analytics` - Get sales analytics

#### QR Codes
- `GET /api/qrcodes` - Get all QR codes
- `POST /api/qrcodes/generate/{itemId}` - Generate QR code
- `GET /api/qrcodes/item/{itemId}` - Get QR code for item

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### AI Backend API Endpoints

#### Chatbot
- `POST /api/chatbot` - Send message to chatbot
- `GET /api/chatbot/devices` - Get available devices

#### Inventory AI
- `POST /api/inventory/recommendations` - Get AI recommendations

For detailed API documentation, visit:
- Backend: http://localhost:8080/swagger-ui.html (if Swagger is configured)
- AI Backend: http://localhost:8000/docs

## 👥 User Roles

### 1. Admin
- Full system access
- User management and approvals
- System configuration
- All reports and analytics

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

### 2. Inventory Manager
- Inventory management
- Stock alerts
- AI recommendations
- QR code management
- Inventory reports

### 3. Sales Representative
- Point of Sale
- Customer management
- Sales history
- Sales reports

### 4. Technician
- Repair task management
- Fault diagnosis
- Spare parts requests
- Repair history

## 🖼️ Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Inventory Management
![Inventory](docs/screenshots/inventory.png)

### AI Chatbot
![Chatbot](docs/screenshots/chatbot.png)

### Sales Portal
![Sales](docs/screenshots/sales.png)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Didace** - *Initial work* - [Didace1](https://github.com/Didace1)

## 🙏 Acknowledgments

- Corex Ltd for the project requirements
- Spring Boot community
- React community
- FastAPI community
- All contributors and testers

## 📞 Support

For support, email support@corexltd.com or open an issue in the GitHub repository.

## 🔄 Version History

- **v1.0.0** (2026-05-12)
  - Initial release
  - Core features implemented
  - AI integration complete
  - Multi-role system
  - QR code support

---

Made with ❤️ by the Corex Development Team
