#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

# Initialize the AI
ai = FaultDiagnosisAI()

# Test with simple input
test_input = "my laptop is slow"
result = ai.predict('laptop', 'Dell', 'XPS 13', test_input)

print("=== DEBUG PREDICTION ===")
print(f"Input: '{test_input}'")
print(f"Primary Fault: {result['primaryFault']}")
print(f"Confidence: {result['confidence']}")
print(f"Components: {result['componentsToCheck']}")

print("\n=== TRAINING DATA ANALYSIS ===")
print("Training samples containing 'slow':")
slow_samples = []
for record in ai.training_records:
    if 'slow' in record['symptoms'].lower():
        slow_samples.append(record)
        print(f"- '{record['symptoms']}' -> '{record['fault']}'")

print(f"\nFound {len(slow_samples)} samples with 'slow'")

print("\n=== MODEL PREDICTION DETAILS ===")
# Check what the model predicts for various inputs
test_inputs = [
    "slow",
    "my laptop is slow", 
    "very slow performance",
    "device running slow",
    "ggsgsgsgsgsgsgsgsg"  # Your test case
]

for test in test_inputs:
    try:
        result = ai.predict('laptop', 'Dell', 'XPS 13', test)
        print(f"'{test}' -> {result['primaryFault']} (confidence: {result['confidence']:.2f})")
    except Exception as e:
        print(f"'{test}' -> ERROR: {e}")
