#!/usr/bin/env python3

import requests
import json

def test_backend_connection():
    """Test that the backend is accessible and working"""
    
    print("=" * 60)
    print("TESTING BACKEND CONNECTION")
    print("=" * 60)
    
    # Test endpoints
    endpoints = [
        ("Health Check", "http://localhost:8000/api/health"),
        ("Get Models", "http://localhost:8000/api/devices/models?deviceType=laptop&brand=Dell"),
        ("Diagnosis", "http://localhost:8000/api/diagnosis")
    ]
    
    for name, url in endpoints:
        print(f"\nTesting {name}: {url}")
        
        try:
            if name == "Diagnosis":
                # POST request for diagnosis
                data = {
                    "deviceType": "laptop",
                    "brand": "Dell",
                    "model": "XPS 13",
                    "symptoms": "my laptop is slow",
                    "symptomsList": [],
                    "additionalNotes": ""
                }
                response = requests.post(url, json=data, timeout=5)
            else:
                # GET request for other endpoints
                response = requests.get(url, timeout=5)
            
            print(f"  Status: {response.status_code}")
            
            if response.status_code == 200:
                if name == "Get Models":
                    models = response.json()
                    print(f"  Models: {models}")
                else:
                    result = response.json()
                    print(f"  Response: {json.dumps(result, indent=2)[:200]}...")
                print(f"  Status: SUCCESS")
            else:
                print(f"  Error: {response.text}")
                print(f"  Status: FAILED")
                
        except requests.exceptions.ConnectionError:
            print(f"  Status: CONNECTION REFUSED")
            print(f"  Make sure the backend is running on port 8000")
        except Exception as e:
            print(f"  Status: ERROR - {e}")
    
    print("\n" + "=" * 60)
    print("FRONTEND CONFIGURATION")
    print("=" * 60)
    
    # Check frontend config
    try:
        with open('../smartfix-frontend/.env', 'r') as f:
            config = f.read()
            print(f"Frontend .env file:")
            print(config)
            
        if "http://localhost:8000" in config:
            print("Status: Frontend is configured to use port 8000")
        else:
            print("Status: Frontend may be using wrong port")
            
    except FileNotFoundError:
        print("Status: Frontend .env file not found")
    
    print("\n" + "=" * 60)
    print("SOLUTION")
    print("=" * 60)
    print("1. Backend is running on: http://localhost:8000")
    print("2. Frontend should connect to: http://localhost:8000")
    print("3. Frontend .env updated to use port 8000")
    print("4. Restart frontend to pick up new configuration")
    print("5. Test the connection in browser")

if __name__ == "__main__":
    test_backend_connection()
