# SmartFix Defense Guide

## Project Title
AI-Powered Smart Electronic Device Fault Diagnosis, Component Failure Prediction, Intelligent Repair Recommendation, and Inventory & Sales Support System

## 1) What to say first (30-45 seconds)
- SmartFix is an AI-assisted platform for electronics service operations.
- It combines fault diagnosis, component failure prediction, repair guidance, inventory, and sales support.
- The objective is to improve accuracy, reduce repair turnaround time, and support operational decisions with data.

## 2) Implemented architecture (talking points)
- **Frontend:** React + role-based routing + role-based navigation.
- **Backend:** FastAPI serving AI endpoints.
- **AI data:** CSV-driven training records in `AI_BACKEND/data/raw/training_data.csv`.
- **Core flow:** Device info + symptoms -> AI diagnosis -> repair recommendations -> downloadable report.

## 3) Live demo order (safe path)
1. Login as `admin@smartfix.com / admin123` or `technician@smartfix.com / tech123`.
2. Open **Fault Diagnosis**.
3. Select device type/brand and a valid model (validated from backend model list).
4. Enter symptom checklist + additional notes, submit.
5. Show diagnosis confidence, causes, affected components, similar cases.
6. Show repair recommendations: procedures, tools, parts, safety precautions.
7. Download diagnosis report JSON.
8. Open **Failure Prediction** and show API-backed risk/remaining-life cards.
9. Open **Inventory** and **Sales** pages to show operational modules.

## 4) Objectives coverage statement
- Diagnose electronic faults using AI: **Implemented**
- Predict component failures using historical-like data: **Implemented**
- Provide intelligent repair recommendations: **Implemented**
- Support inventory and sales operations: **Implemented (UI module level)**
- Improve operational efficiency and service quality: **Demonstrated via integrated workflows**

## 5) High-value points to emphasize
- Diagnosis now uses real backend API, not frontend mock.
- Model validation is dynamic from backend data (`/api/devices/models`).
- Additional symptom notes are included in ML analysis.
- Repair recommendations are generated and displayed after diagnosis.
- Role-based system structure supports scaling to full enterprise workflow.

## 6) If examiners ask about limitations
- Some modules are currently scaffolded/iterative (customers, technicians, reports pages).
- Inventory and sales are functional UI modules and can be extended to backend persistence.
- The architecture is intentionally modular so each area can be upgraded independently.

## 7) Exact API endpoints to mention
- `POST /api/diagnosis`
- `GET /api/devices/models`
- `GET /api/repair/recommendations/{diagnosis}`
- `POST /api/predict/failure`
- `GET /api/health`

## 8) Quick startup reminder
- Backend: run FastAPI on `http://localhost:5000`
- Frontend: run React on `http://localhost:3000`
- Frontend env: `REACT_APP_AI_BACKEND_URL=http://localhost:5000`
