#!/usr/bin/env python3
"""
Test script for follow-up detection
Tests if the AI properly detects "let me try" and other follow-up phrases
"""

import requests
import json

# Configuration
AI_BACKEND_URL = "http://localhost:5000"
TEST_DEVICE = {
    "deviceType": "laptop",
    "brand": "Dell",
    "model": "Inspiron 15"
}

def test_follow_up_detection():
    """Test the follow-up detection with various phrases"""
    print("🧪 Testing Follow-up Detection")
    print("=" * 50)
    
    # Test 1: Initial diagnosis
    print("\n1️⃣ Initial Diagnosis...")
    initial_request = {
        **TEST_DEVICE,
        "symptoms": "My laptop overheats and shuts down",
        "symptomsList": ["overheating", "shutdown"],
        "additionalNotes": "",
        "userName": "Test User"
    }
    
    try:
        response = requests.post(f"{AI_BACKEND_URL}/api/diagnosis", json=initial_request)
        if response.status_code == 200:
            initial_result = response.json()
            session_id = initial_result.get("sessionId")
            primary_fault = initial_result.get("primaryFault")
            
            print(f"✅ Initial diagnosis: {primary_fault}")
            print(f"   Session ID: {session_id}")
            
        else:
            print(f"❌ Initial diagnosis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 2: Follow-up phrases
    follow_up_phrases = [
        "let me try",
        "I tried that but it doesn't work",
        "still not working",
        "what next",
        "tried",
        "ok done that",
        "still overheating"
    ]
    
    for i, phrase in enumerate(follow_up_phrases, 2):
        print(f"\n{i}️⃣ Testing phrase: '{phrase}'")
        
        follow_up_request = {
            **TEST_DEVICE,
            "symptoms": phrase,
            "symptomsList": [],
            "additionalNotes": "",
            "userName": "Test User",
            "sessionId": session_id
        }
        
        try:
            response = requests.post(f"{AI_BACKEND_URL}/api/diagnosis", json=follow_up_request)
            if response.status_code == 200:
                result = response.json()
                is_follow_up = result.get("isFollowUp", False)
                fault = result.get("primaryFault")
                
                if is_follow_up:
                    print(f"   ✅ DETECTED as follow-up: {fault}")
                else:
                    print(f"   ❌ NOT detected as follow-up: {fault}")
                    
            else:
                print(f"   ❌ Request failed: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ ERROR: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Testing Follow-up Detection")
    
    # Check if backend is running
    try:
        response = requests.get(f"{AI_BACKEND_URL}/api/health")
        if response.status_code == 200:
            print(f"✅ AI Backend is running on {AI_BACKEND_URL}")
        else:
            print(f"❌ AI Backend health check failed")
            exit(1)
    except:
        print(f"❌ Cannot connect to AI Backend at {AI_BACKEND_URL}")
        print("   Make sure it's running: python -m uvicorn app.main:app --reload --port 5000")
        exit(1)
    
    test_follow_up_detection()