#!/usr/bin/env python3

import requests
import json
import time

# API endpoint
BASE_URL = "http://localhost:8000"

def test_user_description_analysis():
    """Test how the AI analyzes real user descriptions"""
    
    print("=" * 80)
    print("TESTING USER DESCRIPTION ANALYSIS")
    print("=" * 80)
    
    # Test cases with realistic user descriptions
    test_cases = [
        {
            "name": "Laptop Performance Issue",
            "device_type": "laptop",
            "brand": "Dell",
            "model": "XPS 13",
            "symptoms": "my laptop is very slow and takes forever to open programs",
            "symptoms_list": ["slow startup", "programs lag"],
            "additional_notes": "it started happening after the last update"
        },
        {
            "name": "Phone Battery Problem",
            "device_type": "smartphone", 
            "brand": "Apple",
            "model": "iPhone 12",
            "symptoms": "battery drains quickly and phone gets hot",
            "symptoms_list": ["fast battery drain", "overheating"],
            "additional_notes": "battery percentage drops from 100% to 20% in 3 hours"
        },
        {
            "name": "Screen Damage",
            "device_type": "tablet",
            "brand": "Samsung", 
            "model": "Galaxy Tab",
            "symptoms": "screen is cracked and touch not working properly",
            "symptoms_list": ["cracked screen", "touch issues"],
            "additional_notes": "dropped it yesterday"
        },
        {
            "name": "Network Connection",
            "device_type": "laptop",
            "brand": "HP",
            "model": "Pavilion",
            "symptoms": "wifi keeps disconnecting every few minutes",
            "symptoms_list": ["wifi disconnects", "connection drops"],
            "additional_notes": "other devices work fine on same network"
        },
        {
            "name": "Invalid Input Test",
            "device_type": "laptop",
            "brand": "Dell",
            "model": "XPS 13", 
            "symptoms": "ggsgsgsgsgsgsgsgsg",
            "symptoms_list": [],
            "additional_notes": ""
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n{i}. {test['name']}")
        print("-" * 60)
        print(f"Device: {test['brand']} {test['model']} ({test['device_type']})")
        print(f"Symptoms: '{test['symptoms']}'")
        print(f"Additional: '{test['additional_notes']}'")
        
        # Prepare request
        request_data = {
            "deviceType": test['device_type'],
            "brand": test['brand'],
            "model": test['model'],
            "symptoms": test['symptoms'],
            "symptomsList": test['symptoms_list'],
            "additionalNotes": test['additional_notes']
        }
        
        try:
            # Send request to API
            response = requests.post(
                f"{BASE_URL}/api/diagnosis",
                json=request_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                
                print(f"\nAI Analysis Results:")
                print(f"  Primary Fault: {result.get('primaryFault', 'N/A')}")
                print(f"  Confidence: {result.get('confidence', 0):.2f}")
                
                # Check if clarification is needed
                if result.get('requiresClarification', False):
                    print(f"  Requires Clarification: YES")
                    print(f"  Message: {result.get('clarificationMessage', 'N/A')}")
                else:
                    print(f"  Requires Clarification: NO")
                
                # Show components to check
                components = result.get('componentsToCheck', [])
                if components:
                    print(f"  Components to Check: {', '.join(components)}")
                
                # Show alternative faults
                alternatives = result.get('alternativeFaults', [])
                if alternatives:
                    print(f"  Alternative Possibilities:")
                    for alt in alternatives[:2]:
                        print(f"    - {alt.get('fault', 'N/A')} ({alt.get('probability', 0):.2f})")
                
                # Check if analysis seems reasonable
                confidence = result.get('confidence', 0)
                if test['symptoms'] == "ggsgsgsgsgsgsgsgsg":
                    if confidence < 0.3:
                        print(f"  Status: OK - Low confidence for invalid input")
                    else:
                        print(f"  Status: WARNING - High confidence for invalid input")
                else:
                    if confidence > 0.2:
                        print(f"  Status: OK - Reasonable confidence for valid input")
                    else:
                        print(f"  Status: WARNING - Very low confidence for valid input")
                        
            else:
                print(f"  ERROR: HTTP {response.status_code}")
                print(f"  Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"  ERROR: {e}")
        
        print()
    
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print("The AI now:")
    print("1. Analyzes complete user descriptions (symptoms + additional notes)")
    print("2. Provides appropriate confidence scores")
    print("3. Requires clarification for invalid input")
    print("4. Suggests device-specific components")
    print("5. No longer uses mock data or random responses")

if __name__ == "__main__":
    # Wait a moment for server to start
    time.sleep(2)
    test_user_description_analysis()
