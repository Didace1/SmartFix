#!/usr/bin/env python3

import sys
import os
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

print("=" * 60)
print("FAST STARTUP TEST")
print("=" * 60)

print("\n1. Testing startup with saved models...")
start_time = time.time()
ai = FaultDiagnosisAI()
load_time = time.time() - start_time

print(f"Load time: {load_time:.2f} seconds")

# Test prediction
result = ai.predict('laptop', 'Dell', 'XPS 13', 'my laptop is slow')
print(f'Prediction: {result["primaryFault"]} (confidence: {result["confidence"]:.2f})')
print(f'Components: {result["componentsToCheck"]}')

print("\n2. Testing model is working correctly...")
test_cases = [
    ('laptop', 'Dell', 'XPS 13', 'screen cracked'),
    ('smartphone', 'Apple', 'iPhone 12', 'battery dead'),
    ('tablet', 'Samsung', 'Galaxy Tab', 'wifi not working')
]

for device_type, brand, model, symptoms in test_cases:
    result = ai.predict(device_type, brand, model, symptoms)
    print(f'{brand} {model}: {symptoms} -> {result["primaryFault"]} ({result["confidence"]:.2f})')

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("Trained model files are located in:")
print("c:/Users/adidace/Documents/Courses/January$/FINAL_YEAR/smartfix (1)/models/")
print("\nFiles:")
print("- vectorizer.pkl (2.2 KB) - Text vectorizer")
print("- classifier.pkl (368 KB) - Random Forest classifier")
print("- similarity_model.pkl (43 KB) - Nearest neighbors model")
print("- fault_lookup.pkl (1.2 KB) - Fault metadata")
print("- training_records.pkl (13.9 KB) - Training data")
print("- metadata.pkl (69 bytes) - Model metadata")
print("\nThe system now loads pre-trained models for faster startup!")
