from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from pathlib import Path

# Import AI models
from app.models.diagnosis_model import FaultDiagnosisAI
from app.models.prediction_model import FailurePredictionAI
from app.models.repair_model import RepairRecommendationAI

app = FastAPI(title="SmartFix AI System", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI models
diagnosis_ai = FaultDiagnosisAI()
prediction_ai = FailurePredictionAI()
repair_ai = RepairRecommendationAI()

# Request/Response Models
class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False

class LoginResponse(BaseModel):
    token: str
    requiresMfa: bool
    user: Dict[str, Any]

class DiagnosisRequest(BaseModel):
    deviceType: str
    brand: str
    model: str
    symptoms: str
    symptomsList: List[str] = []
    additionalNotes: Optional[str] = None
    userName: Optional[str] = None

class DiagnosisResponse(BaseModel):
    primaryFault: str
    confidence: float
    alternativeFaults: List[Dict[str, Any]]
    similarCases: List[Dict[str, Any]]
    recommendedActions: List[str]
    componentsToCheck: List[str]
    symptomAnalysis: Dict[str, Any]
    requiresClarification: bool = False
    clarificationMessage: Optional[str] = None
    personalizedGreeting: Optional[str] = None
    explanation: Optional[str] = None

class PredictionRequest(BaseModel):
    deviceId: str
    deviceType: str
    age_months: int
    usage_hours: int
    temperature_avg: float
    repair_history: List[Dict[str, Any]]

class PredictionResponse(BaseModel):
    component: str
    failureProbability: float
    remainingLife_months: int
    riskLevel: str
    preventiveActions: List[str]

# API Endpoints
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user (demo version)"""
    # Demo users - in production, check against database
    demo_users = {
        "admin@smartfix.com": {
            "password": "admin123",
            "user": {
                "id": "1",
                "email": "admin@smartfix.com",
                "role": "admin",
                "name": "Admin User"
            }
        },
        "technician@smartfix.com": {
            "password": "tech123",
            "user": {
                "id": "2",
                "email": "technician@smartfix.com",
                "role": "technician",
                "name": "John Technician"
            }
        }
    }
    
    if request.email in demo_users and demo_users[request.email]["password"] == request.password:
        return LoginResponse(
            token="mock-jwt-token-12345",
            requiresMfa=False,
            user=demo_users[request.email]["user"]
        )
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/diagnosis", response_model=DiagnosisResponse)
async def diagnose_fault(request: DiagnosisRequest):
    """AI-powered fault diagnosis with enhanced symptom analysis and input validation"""
    try:
        # Analyze symptoms first
        symptom_analysis = diagnosis_ai.analyze_symptoms(
            symptoms=request.symptoms,
            symptoms_list=request.symptomsList,
            additional_notes=request.additionalNotes
        )

        # Get diagnosis prediction
        result = diagnosis_ai.predict(
            device_type=request.deviceType,
            brand=request.brand,
            model=request.model,
            symptoms=request.symptoms,
            symptoms_list=request.symptomsList,
            additional_notes=request.additionalNotes
        )
        
        # Add symptom analysis to response
        result["symptomAnalysis"] = symptom_analysis
        
        # Add clarification information if needed
        result["requiresClarification"] = symptom_analysis.get("requires_clarification", False)
        result["clarificationMessage"] = symptom_analysis.get("clarification_message")

        # Build explanation grounded in what the user wrote and what we extracted
        input_quality = symptom_analysis.get("input_quality", {})
        is_valid = bool(input_quality.get("is_valid", True))
        primary_fault = result.get("primaryFault", "Unknown fault")
        confidence = result.get("confidence", 0.0)

        symptom_patterns = symptom_analysis.get("symptom_patterns", []) or []
        device_issues = symptom_analysis.get("device_issues", []) or []
        severity = symptom_analysis.get("severity_indicators", {}) or {}
        severity_level = severity.get("level") or "unknown"
        urgency = severity.get("urgency") or "unknown"

        referenced_text = request.symptoms or ""
        if request.additionalNotes:
            referenced_text = f"{referenced_text} {request.additionalNotes}".strip()
        referenced_text = referenced_text.strip()

        patterns_text = ", ".join(symptom_patterns[:3]) if symptom_patterns else "none"
        issues_text = ", ".join(device_issues[:3]) if device_issues else "none"
        components = result.get("componentsToCheck") or []
        first_component = components[0] if components else None
        actions = result.get("recommendedActions") or []
        top_actions = actions[:3]

        if is_valid:
            explanation = (
                f"You reported: '{referenced_text[:200]}{'...' if len(referenced_text) > 200 else ''}'. "
                f"From your description, I detected patterns: {patterns_text}. "
                f"Related device issues: {issues_text}. "
                f"Based on this, the most likely fault is '{primary_fault}' (confidence {confidence:.2f}). "
                f"Severity: {severity_level}; urgency: {urgency}."
            )
            if first_component:
                explanation += f" Start by inspecting: {first_component}."
            if components:
                explanation += f" Components to check: {', '.join(components[:5])}."
            if top_actions:
                explanation += f" Recommended steps: {', '.join(top_actions)}."
        else:
            explanation = (
                f"I received: '{referenced_text[:120]}{'...' if len(referenced_text) > 120 else ''}'. "
                f"This input looks unclear ({input_quality.get('issue')}). "
                "Please describe what is not working, when it started, and any error messages."
            )

        # Personalized greeting (optional)
        user_name = (request.userName or "").strip()
        if user_name:
            result["personalizedGreeting"] = f"Yes {user_name}, {explanation}"
        else:
            result["personalizedGreeting"] = f"Yes, {explanation}"
        result["explanation"] = explanation
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/diagnosis/with-image")
async def diagnose_with_image(
    deviceType: str,
    brand: str,
    model: str,
    symptoms: str,
    image: UploadFile = File(...)
):
    """Diagnose fault with image recognition"""
    try:
        # Process image
        image_data = await image.read()
        
        # Use AI to analyze image
        image_analysis = diagnosis_ai.analyze_image(image_data)
        
        # Combine with text symptoms
        result = diagnosis_ai.predict(
            device_type=deviceType,
            brand=brand,
            model=model,
            symptoms=symptoms,
            image_analysis=image_analysis
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/failure", response_model=PredictionResponse)
async def predict_failure(request: PredictionRequest):
    """Predict component failure"""
    try:
        prediction = prediction_ai.predict(
            device_id=request.deviceId,
            device_type=request.deviceType,
            age_months=request.age_months,
            usage_hours=request.usage_hours,
            temperature_avg=request.temperature_avg,
            repair_history=request.repair_history
        )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/predict/devices")
async def predict_devices():
    """Return failure predictions for devices derived from training data."""
    try:
        profiles = prediction_ai.get_device_profiles()
        results = []
        for profile in profiles:
            prediction = prediction_ai.predict(
                device_id=profile["deviceId"],
                device_type=profile["deviceType"],
                age_months=profile["age_months"],
                usage_hours=profile["usage_hours"],
                temperature_avg=profile["temperature_avg"],
                repair_history=profile["repair_history"]
            )
            results.append({
                "device": profile,
                "prediction": prediction
            })
        return {"items": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/repair/recommendations/{diagnosis_id}")
async def get_repair_recommendations(diagnosis_id: str):
    """Get repair recommendations based on diagnosis"""
    try:
        recommendations = repair_ai.get_recommendations(diagnosis_id)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/devices/models")
async def get_models(deviceType: str, brand: str):
    """Get known models for selected device type and brand."""
    try:
        models = diagnosis_ai.get_known_models(device_type=deviceType, brand=brand)
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)