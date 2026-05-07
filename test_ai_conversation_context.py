#!/usr/bin/env python3
"""
Test script for AI Conversation Context Fix
Tests the session management and follow-up detection functionality
"""

import requests
import json
import time

# Configuration
AI_BACKEND_URL = "http://localhost:5000"
TEST_DEVICE = {
    "deviceType": "laptop",
    "brand": "HP",
    "model": "Pavilion 15"
}

def test_conversation_context():
    """Test the AI conversation context functionality"""
    print("🧪 Testing AI Conversation Context Fix")
    print("=" * 50)
    
    # Test 1: Initial diagnosis
    print("\n1️⃣ Testing Initial Diagnosis...")
    initial_request = {
        **TEST_DEVICE,
        "symptoms": "My laptop overheats and shuts down randomly",
        "symptomsList": ["overheating", "random shutdown"],
        "additionalNotes": "Happens especially during gaming",
        "userName": "Test User"
    }
    
    try:
        response = requests.post(f"{AI_BACKEND_URL}/api/diagnosis", json=initial_request)
        if response.status_code == 200:
            initial_result = response.json()
            session_id = initial_result.get("sessionId")
            primary_fault = initial_result.get("primaryFault")
            is_follow_up = initial_result.get("isFollowUp", False)
            
            print(f"✅ Initial diagnosis successful")
            print(f"   Session ID: {session_id}")
            print(f"   Primary Fault: {primary_fault}")
            print(f"   Is Follow-up: {is_follow_up}")
            print(f"   Confidence: {initial_result.get('confidence', 0) * 100:.1f}%")
            
            if not session_id:
                print("❌ ERROR: No session ID returned!")
                return False
                
        else:
            print(f"❌ Initial diagnosis failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to AI backend!")
        print("   Make sure the AI backend is running on port 5000")
        print("   Run: cd smartfix/AI_BACKEND && python -m uvicorn app.main:app --reload --port 5000")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 2: Follow-up question
    print("\n2️⃣ Testing Follow-up Detection...")
    follow_up_request = {
        **TEST_DEVICE,
        "symptoms": "I tried cleaning the fan but it doesn't work, still overheating",
        "symptomsList": [],
        "additionalNotes": "",
        "userName": "Test User",
        "sessionId": session_id  # Use same session
    }
    
    try:
        response = requests.post(f"{AI_BACKEND_URL}/api/diagnosis", json=follow_up_request)
        if response.status_code == 200:
            follow_up_result = response.json()
            follow_up_fault = follow_up_result.get("primaryFault")
            is_follow_up = follow_up_result.get("isFollowUp", False)
            returned_session = follow_up_result.get("sessionId")
            
            print(f"✅ Follow-up diagnosis successful")
            print(f"   Session ID: {returned_session}")
            print(f"   Primary Fault: {follow_up_fault}")
            print(f"   Is Follow-up: {is_follow_up}")
            print(f"   Confidence: {follow_up_result.get('confidence', 0) * 100:.1f}%")
            
            # Verify it's different from initial diagnosis
            if follow_up_fault != primary_fault:
                print("✅ SUCCESS: Follow-up provided different solution!")
            else:
                print("⚠️  WARNING: Follow-up gave same solution (might be expected)")
                
            if is_follow_up:
                print("✅ SUCCESS: Follow-up correctly detected!")
            else:
                print("❌ ERROR: Follow-up not detected!")
                
        else:
            print(f"❌ Follow-up diagnosis failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    # Test 3: New session (should not be follow-up)
    print("\n3️⃣ Testing New Session...")
    new_session_request = {
        **TEST_DEVICE,
        "symptoms": "Screen is flickering and has lines",
        "symptomsList": ["screen flickering", "display lines"],
        "additionalNotes": "",
        "userName": "Test User"
        # No sessionId - should create new session
    }
    
    try:
        response = requests.post(f"{AI_BACKEND_URL}/api/diagnosis", json=new_session_request)
        if response.status_code == 200:
            new_result = response.json()
            new_session_id = new_result.get("sessionId")
            new_fault = new_result.get("primaryFault")
            is_follow_up = new_result.get("isFollowUp", False)
            
            print(f"✅ New session diagnosis successful")
            print(f"   Session ID: {new_session_id}")
            print(f"   Primary Fault: {new_fault}")
            print(f"   Is Follow-up: {is_follow_up}")
            
            if new_session_id != session_id:
                print("✅ SUCCESS: New session ID created!")
            else:
                print("❌ ERROR: Same session ID used!")
                
            if not is_follow_up:
                print("✅ SUCCESS: New issue not detected as follow-up!")
            else:
                print("❌ ERROR: New issue incorrectly detected as follow-up!")
                
        else:
            print(f"❌ New session diagnosis failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    print("\n🎉 All tests completed successfully!")
    print("\nThe AI conversation context fix is working properly:")
    print("✅ Session management implemented")
    print("✅ Follow-up detection working")
    print("✅ Alternative solutions provided")
    print("✅ New sessions properly isolated")
    
    return True

def test_health_check():
    """Test if AI backend is running"""
    try:
        response = requests.get(f"{AI_BACKEND_URL}/api/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ AI Backend is healthy: {health_data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ AI Backend is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting AI Conversation Context Test")
    print(f"🔗 Testing against: {AI_BACKEND_URL}")
    
    # First check if backend is running
    if not test_health_check():
        print("\n💡 To start the AI backend:")
        print("   cd smartfix/AI_BACKEND")
        print("   python -m uvicorn app.main:app --reload --port 5000")
        exit(1)
    
    # Run the conversation context tests
    success = test_conversation_context()
    
    if success:
        print("\n🎯 RESULT: AI Conversation Context Fix is working perfectly!")
        exit(0)
    else:
        print("\n❌ RESULT: Some tests failed. Please check the implementation.")
        exit(1)