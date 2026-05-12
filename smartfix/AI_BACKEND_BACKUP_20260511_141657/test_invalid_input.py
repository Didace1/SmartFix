#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

# Initialize the diagnosis AI
diagnosis_ai = FaultDiagnosisAI()

# Test cases for invalid/unreadable input
test_cases = [
    {
        "name": "Repeated Characters",
        "symptoms": "ggsgsgsgsgsgsgsgsg",
        "description": "User typing random repeated characters"
    },
    {
        "name": "Gibberish Text",
        "symptoms": "asdfasdfasdfasdfasdf",
        "description": "User typing random keyboard patterns"
    },
    {
        "name": "Single Character Repeated",
        "symptoms": "aaaaaaaaaaaaaaaaaa",
        "description": "User holding down a single key"
    },
    {
        "name": "Empty Input",
        "symptoms": "",
        "description": "User submits empty form"
    },
    {
        "name": "Too Short",
        "symptoms": "ok",
        "description": "User provides minimal input"
    },
    {
        "name": "Mixed Invalid",
        "symptoms": "ggsgsgsgsgsgsgsgsg broken screen ggsgsgsgsgsgsgsgsg",
        "description": "Mix of gibberish with actual symptom"
    },
    {
        "name": "Numbers Only",
        "symptoms": "12345678901234567890",
        "description": "User typing only numbers"
    },
    {
        "name": "Special Characters",
        "symptoms": "!@#$%^&*()!@#$%^&*()",
        "description": "User typing only special characters"
    }
]

print("=" * 80)
print("INVALID INPUT HANDLING DEMONSTRATION")
print("=" * 80)

for i, test_case in enumerate(test_cases, 1):
    print(f"\n{i}. {test_case['name']}")
    print("-" * 40)
    print(f"Input: '{test_case['symptoms']}'")
    print(f"Description: {test_case['description']}")
    
    # Analyze symptoms
    analysis = diagnosis_ai.analyze_symptoms(
        symptoms=test_case['symptoms'],
        symptoms_list=None,
        additional_notes=None
    )
    
    print(f"\nInput Quality: {analysis['input_quality']['message']}")
    print(f"Requires Clarification: {analysis.get('requires_clarification', False)}")
    
    if analysis.get('requires_clarification'):
        print(f"Clarification Message: {analysis['clarification_message']}")
    
    print(f"Symptom Patterns: {', '.join(analysis['symptom_patterns'])}")
    print(f"Device Issues: {', '.join(analysis['device_issues'])}")
    print(f"Severity: {analysis['severity_indicators']['level']} ({analysis['severity_indicators']['urgency']})")
    
    # Get diagnosis
    diagnosis = diagnosis_ai.predict(
        device_type="laptop",
        brand="Dell",
        model="XPS 13",
        symptoms=test_case['symptoms']
    )
    
    print(f"\nDiagnosis Results:")
    print(f"Primary Fault: {diagnosis['primaryFault']}")
    print(f"Confidence: {diagnosis['confidence']:.2f}")
    
    if diagnosis['confidence'] < 0.3:
        print("Note: Low confidence indicates unclear input - user needs to provide better description")

print("\n" + "=" * 80)
print("Invalid input handling completed successfully!")
print("=" * 80)

# Test with valid input for comparison
print("\n" + "=" * 80)
print("COMPARISON WITH VALID INPUT")
print("=" * 80)

valid_test = {
    "symptoms": "My laptop won't turn on and the screen is black",
    "description": "Proper symptom description"
}

print(f"\nValid Input: '{valid_test['symptoms']}'")
print(f"Description: {valid_test['description']}")

analysis = diagnosis_ai.analyze_symptoms(
    symptoms=valid_test['symptoms'],
    symptoms_list=None,
    additional_notes=None
)

print(f"\nInput Quality: {analysis['input_quality']['message']}")
print(f"Requires Clarification: {analysis.get('requires_clarification', False)}")
print(f"Symptom Patterns: {', '.join(analysis['symptom_patterns'])}")
print(f"Device Issues: {', '.join(analysis['device_issues'])}")
print(f"Severity: {analysis['severity_indicators']['level']} ({analysis['severity_indicators']['urgency']})")

diagnosis = diagnosis_ai.predict(
    device_type="laptop",
    brand="Dell",
    model="XPS 13",
    symptoms=valid_test['symptoms']
)

print(f"\nDiagnosis Results:")
print(f"Primary Fault: {diagnosis['primaryFault']}")
print(f"Confidence: {diagnosis['confidence']:.2f}")
print(f"Components to Check: {', '.join(diagnosis['componentsToCheck'])}")

print("\n" + "=" * 80)
print("Comparison completed!")
print("=" * 80)
