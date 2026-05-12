#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

# Initialize the diagnosis AI
diagnosis_ai = FaultDiagnosisAI()

# Test cases for symptom analysis
test_cases = [
    {
        "name": "Power Issue",
        "symptoms": "My laptop won't turn on, it's completely dead",
        "symptoms_list": ["no power", "black screen"],
        "additional_notes": "I tried charging it overnight but still nothing"
    },
    {
        "name": "Screen Problem",
        "symptoms": "Screen is cracked and touch not working properly",
        "symptoms_list": ["flickering display"],
        "additional_notes": "Dropped it yesterday from about 2 feet"
    },
    {
        "name": "Performance Issue",
        "symptoms": "Computer is very slow and keeps freezing",
        "symptoms_list": ["lag", "unresponsive mouse"],
        "additional_notes": "Started after the last software update"
    },
    {
        "name": "Overheating Issue",
        "symptoms": "Device gets very hot and fan is always loud",
        "symptoms_list": ["shuts down randomly"],
        "additional_notes": "Happens when watching videos or gaming"
    },
    {
        "name": "Water Damage",
        "symptoms": "Spilled coffee on keyboard, now some keys don't work",
        "symptoms_list": ["sticky keys"],
        "additional_notes": "It happened yesterday, tried to dry it"
    }
]

print("=" * 80)
print("ENHANCED SYMPTOM ANALYSIS DEMONSTRATION")
print("=" * 80)

for i, test_case in enumerate(test_cases, 1):
    print(f"\n{i}. {test_case['name']}")
    print("-" * 40)
    print(f"Original Symptoms: {test_case['symptoms']}")
    print(f"Symptom List: {test_case['symptoms_list']}")
    print(f"Additional Notes: {test_case['additional_notes']}")
    
    # Analyze symptoms
    analysis = diagnosis_ai.analyze_symptoms(
        symptoms=test_case['symptoms'],
        symptoms_list=test_case['symptoms_list'],
        additional_notes=test_case['additional_notes']
    )
    
    print(f"\nNormalized Symptoms: {analysis['normalized_symptoms']}")
    print(f"Symptom Patterns: {', '.join(analysis['symptom_patterns'])}")
    print(f"Severity Level: {analysis['severity_indicators']['level']} ({analysis['severity_indicators']['urgency']})")
    print(f"Device Issues: {', '.join(analysis['device_issues'])}")
    
    # Get diagnosis
    diagnosis = diagnosis_ai.predict(
        device_type="laptop",
        brand="Dell",
        model="XPS 13",
        symptoms=test_case['symptoms'],
        symptoms_list=test_case['symptoms_list'],
        additional_notes=test_case['additional_notes']
    )
    
    print(f"\nDiagnosis Results:")
    print(f"Primary Fault: {diagnosis['primaryFault']}")
    print(f"Confidence: {diagnosis['confidence']:.2f}")
    print(f"Components to Check: {', '.join(diagnosis['componentsToCheck'])}")
    print(f"Recommended Actions: {', '.join(diagnosis['recommendedActions'][:2])}")

print("\n" + "=" * 80)
print("Symptom analysis completed successfully!")
print("=" * 80)
