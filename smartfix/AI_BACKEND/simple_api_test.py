#!/usr/bin/env python3

import requests
import json

# Test the API directly
def test_api():
    url = "http://localhost:8000/api/diagnosis"
    
    # Test with your exact issue: "ggsgsgsgsgsgsgsgsg"
    data = {
        "deviceType": "laptop",
        "brand": "Dell", 
        "model": "XPS 13",
        "symptoms": "ggsgsgsgsgsgsgsgsg",
        "symptomsList": [],
        "additionalNotes": ""
    }
    
    print("Testing API with invalid input: 'ggsgsgsgsgsgsgsgsg'")
    print("=" * 50)
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Primary Fault: {result.get('primaryFault')}")
        print(f"Confidence: {result.get('confidence')}")
        print(f"Requires Clarification: {result.get('requiresClarification')}")
        print(f"Clarification Message: {result.get('clarificationMessage')}")
        print(f"Components: {result.get('componentsToCheck')}")
        
    except Exception as e:
        print(f"Error: {e}")
    
    # Test with valid input
    print("\nTesting API with valid input: 'my laptop is slow'")
    print("=" * 50)
    
    data_valid = {
        "deviceType": "laptop",
        "brand": "Dell",
        "model": "XPS 13", 
        "symptoms": "my laptop is slow and programs take forever to open",
        "symptomsList": ["slow startup", "lag"],
        "additionalNotes": "started after update"
    }
    
    try:
        response = requests.post(url, json=data_valid)
        result = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Primary Fault: {result.get('primaryFault')}")
        print(f"Confidence: {result.get('confidence')}")
        print(f"Requires Clarification: {result.get('requiresClarification')}")
        print(f"Components: {result.get('componentsToCheck')}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
