from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from pathlib import Path
import uuid

# Import AI models
from app.models.diagnosis_model import FaultDiagnosisAI
from app.models.prediction_model import FailurePredictionAI
from app.models.repair_model import RepairRecommendationAI
from app.brand_knowledge import get_brand_actions

app = FastAPI(title="SmartFix AI System", version="1.0.0")

# Session storage for conversation context
conversation_sessions = {}

class ConversationSession:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.created_at = datetime.now()
        self.last_updated = datetime.now()
        self.conversation_history = []
        self.device_context = {}
        self.previous_diagnosis = None
        
    def add_interaction(self, user_input: str, ai_response: Dict[str, Any]):
        self.conversation_history.append({
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "ai_response": ai_response
        })
        self.last_updated = datetime.now()
        
    def get_context_summary(self) -> str:
        """Get a summary of previous interactions for context"""
        if not self.conversation_history:
            return ""
        
        context_parts = []
        for interaction in self.conversation_history[-3:]:  # Last 3 interactions
            user_input = interaction["user_input"]
            ai_response = interaction["ai_response"]
            primary_fault = ai_response.get("primaryFault", "Unknown")
            context_parts.append(f"Previous issue: '{user_input}' -> Diagnosed as: {primary_fault}")
        
        return " | ".join(context_parts)
    
    def is_follow_up(self, current_input: str) -> bool:
        """Determine if current input is a follow-up to previous diagnosis"""
        if not self.conversation_history:
            return False
            
        follow_up_indicators = [
            # Direct failure indicators
            "it doesn't work", "didn't work", "still not working", "same issue",
            "tried that", "did that", "already did", "what next", "what can i do",
            "still broken", "not fixed", "same problem", "doesn't help",
            "what else", "next step", "another solution", "different approach",
            
            # Attempt indicators
            "let me try", "i'll try", "trying", "attempted", "i tried",
            "let me check", "checking", "i checked", "looked at",
            
            # Continuation indicators  
            "but", "however", "still", "yet", "though", "although",
            "even after", "after doing", "after trying",
            
            # Question indicators
            "now what", "what should", "what do", "how do", "where do",
            "any other", "anything else", "other options", "alternatives",
            
            # Progress indicators
            "done that", "finished", "completed", "followed", "performed"
        ]
        
        current_lower = current_input.lower().strip()
        
        # Check for exact matches
        for indicator in follow_up_indicators:
            if indicator in current_lower:
                return True
        
        # Check for short responses that are likely follow-ups
        short_follow_ups = [
            "ok", "okay", "done", "tried", "yes", "no", "nope", "yeah",
            "still", "same", "nothing", "no change", "not working"
        ]
        
        # If input is very short and matches common follow-up words
        if len(current_lower.split()) <= 3:
            for short_indicator in short_follow_ups:
                if current_lower == short_indicator or current_lower.startswith(short_indicator + " "):
                    return True
        
        return False

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
    model: Optional[str] = ''
    symptoms: str
    symptomsList: List[str] = []
    additionalNotes: Optional[str] = None
    userName: Optional[str] = None
    sessionId: Optional[str] = None  # Add session tracking

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
    reportedSymptoms: Optional[str] = None
    deviceType: Optional[str] = None
    deviceBrand: Optional[str] = None
    deviceModel: Optional[str] = None
    sessionId: Optional[str] = None  # Return session ID
    isFollowUp: bool = False  # Indicate if this is a follow-up

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
    """AI-powered fault diagnosis with enhanced symptom analysis and conversation context"""
    try:
        # Get or create session
        session_id = request.sessionId or str(uuid.uuid4())
        
        if session_id not in conversation_sessions:
            conversation_sessions[session_id] = ConversationSession(session_id)
        
        session = conversation_sessions[session_id]
        
        # Check if this is a follow-up to previous diagnosis
        is_follow_up = session.is_follow_up(request.symptoms)
        
        # Add debugging
        print(f"DEBUG: Session ID: {session_id}")
        print(f"DEBUG: Input: '{request.symptoms}'")
        print(f"DEBUG: Is follow-up detected: {is_follow_up}")
        print(f"DEBUG: Previous diagnosis exists: {session.previous_diagnosis is not None}")
        
        # If it's a follow-up, provide alternative solutions
        if is_follow_up and session.previous_diagnosis:
            print("DEBUG: Handling as follow-up question")
            return handle_follow_up_diagnosis(session, request)
        
        # Store device context for session
        session.device_context = {
            "deviceType": request.deviceType,
            "brand": request.brand,
            "model": request.model
        }
        
        # Analyze symptoms first
        symptom_analysis = diagnosis_ai.analyze_symptoms(
            symptoms=request.symptoms,
            symptoms_list=request.symptomsList,
            additional_notes=request.additionalNotes
        )

        # Reject meaningless / gibberish input before running full diagnosis
        input_quality = symptom_analysis.get("input_quality", {})
        if not input_quality.get("is_valid", True):
            clarification = (
                symptom_analysis.get("clarification_message")
                or input_quality.get("message")
                or "Please describe the device fault clearly (e.g. 'screen is cracked', 'won\\'t turn on')."
            )
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "invalid_input",
                    "message": clarification,
                    "issue": input_quality.get("issue", "unknown"),
                }
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
        
        # Add session and context information
        result["sessionId"] = session_id
        result["isFollowUp"] = False
        result["symptomAnalysis"] = symptom_analysis
        result["requiresClarification"] = symptom_analysis.get("requires_clarification", False)
        result["clarificationMessage"] = symptom_analysis.get("clarification_message")

        # Build explanation
        referenced_text = request.symptoms or ""
        if request.additionalNotes:
            referenced_text = f"{referenced_text} {request.additionalNotes}".strip()
        
        primary_fault = result.get("primaryFault", "Unknown fault")
        result["reportedSymptoms"] = referenced_text
        result["explanation"] = f"Based on your description, the most likely fault is: {primary_fault}."

        # Replace generic actions with brand-specific instructions
        result["recommendedActions"] = get_brand_actions(
            brand=request.brand,
            fault=primary_fault,
            symptoms=referenced_text,
        )

        # Personalized greeting
        user_name = (request.userName or "").strip()
        if user_name:
            result["personalizedGreeting"] = f"Hello {user_name}!"
        else:
            result["personalizedGreeting"] = None

        # Attach device context
        result["deviceType"] = request.deviceType
        result["deviceBrand"] = request.brand
        result["deviceModel"] = request.model
        
        # Store this diagnosis in session
        session.previous_diagnosis = result
        session.add_interaction(referenced_text, result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def handle_follow_up_diagnosis(session: ConversationSession, request: DiagnosisRequest) -> DiagnosisResponse:
    """Handle follow-up questions when previous solution didn't work"""
    previous_diagnosis = session.previous_diagnosis
    previous_fault = previous_diagnosis.get("primaryFault", "Unknown")
    
    print(f"DEBUG: Previous fault was: {previous_fault}")
    
    # Get alternative faults from previous diagnosis
    alternative_faults = previous_diagnosis.get("alternativeFaults", [])
    print(f"DEBUG: Available alternatives: {len(alternative_faults)}")
    
    # Count how many follow-ups we've had in this session
    follow_up_count = len([h for h in session.conversation_history if "follow-up" in h.get("user_input", "").lower()])
    print(f"DEBUG: Follow-up count: {follow_up_count}")
    
    # If we have alternatives, suggest the next most likely one
    if alternative_faults and follow_up_count < len(alternative_faults):
        next_fault = alternative_faults[follow_up_count] if follow_up_count < len(alternative_faults) else alternative_faults[0]
        primary_fault = next_fault.get("fault", "Hardware failure")
        confidence = next_fault.get("confidence", 0.7)
        
        # Get new actions for the alternative fault
        new_actions = get_brand_actions(
            brand=request.brand,
            fault=primary_fault,
            symptoms=f"Follow-up: {request.symptoms}",
        )
        
        explanation = f"Since the previous solution didn't work, let's try the next most likely cause: {primary_fault}."
        
    elif "cooling" in previous_fault.lower() or "thermal" in previous_fault.lower():
        # If previous was cooling issue, try different hardware problems
        primary_fault = "Power supply or motherboard issue"
        confidence = 0.75
        new_actions = [
            "Test with a different power adapter to rule out power supply issues",
            "Check for swollen capacitors on the motherboard",
            "Run a memory test (MemTest86) to check for RAM issues",
            "Check if the issue occurs in BIOS/UEFI (rules out OS problems)",
            "Try booting from a USB drive to test if the hard drive is failing",
            "Check all internal connections are secure (RAM, hard drive, etc.)"
        ]
        explanation = "Since cooling solutions didn't work, let's check for power or motherboard issues."
        
    elif "power" in previous_fault.lower():
        # If previous was power issue, try software/driver problems
        primary_fault = "Software or driver conflict"
        confidence = 0.7
        new_actions = [
            "Boot into Safe Mode to check if the issue persists",
            "Update all device drivers, especially graphics and chipset drivers",
            "Run Windows System File Checker: sfc /scannow",
            "Check Event Viewer for critical errors around shutdown times",
            "Perform a clean boot to identify conflicting software",
            "Consider a system restore to a point before the issue started"
        ]
        explanation = "Since hardware checks didn't help, let's investigate software-related causes."
        
    else:
        # Generic escalation for other cases
        primary_fault = "Complex hardware issue requiring professional diagnosis"
        confidence = 0.8
        new_actions = [
            "Contact manufacturer support for advanced diagnostics",
            "Visit an authorized service center for professional inspection",
            "Consider hardware replacement if device is under warranty",
            "Run comprehensive hardware diagnostic tools",
            "Check for firmware updates that might resolve the issue"
        ]
        explanation = "Since multiple solutions haven't worked, this appears to be a complex problem requiring professional diagnosis."
    
    # Create follow-up response
    follow_up_response = {
        "primaryFault": primary_fault,
        "confidence": confidence,
        "alternativeFaults": alternative_faults[follow_up_count+1:] if len(alternative_faults) > follow_up_count+1 else [],
        "similarCases": [],
        "recommendedActions": new_actions,
        "componentsToCheck": previous_diagnosis.get("componentsToCheck", []),
        "symptomAnalysis": {"input_quality": {"is_valid": True}},
        "requiresClarification": False,
        "clarificationMessage": None,
        "personalizedGreeting": None,
        "explanation": explanation,
        "reportedSymptoms": request.symptoms,
        "deviceType": request.deviceType,
        "deviceBrand": request.brand,
        "deviceModel": request.model,
        "sessionId": session.session_id,
        "isFollowUp": True
    }
    
    print(f"DEBUG: Follow-up response fault: {primary_fault}")
    
    # Update session
    session.previous_diagnosis = follow_up_response
    session.add_interaction(f"Follow-up: {request.symptoms}", follow_up_response)
    
    return DiagnosisResponse(**follow_up_response)

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

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)