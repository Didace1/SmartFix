#!/usr/bin/env python3

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

# Initialize the AI
ai = FaultDiagnosisAI()

print("=" * 80)
print("DEBUGGING MOCK DATA ISSUE")
print("=" * 80)

# Test with very specific input that shouldn't exist in training data
test_cases = [
    "my keyboard is typing wrong letters",
    "the screen shows purple lines",
    "device makes clicking noise when charging",
    "battery percentage jumps randomly",
    "touch screen responds with delay",
    "wifi disconnects every 5 minutes"
]

print("\n1. Testing with specific user input (not in training data):")
for i, symptoms in enumerate(test_cases, 1):
    print(f"\n{i}. Input: '{symptoms}'")
    
    # Check if this exact symptom exists in training data
    exact_match = False
    for record in ai.training_records:
        if symptoms.lower() == record['symptoms'].lower():
            exact_match = True
            print(f"   WARNING: Exact match found in training data!")
            break
    
    if not exact_match:
        print(f"   Good: No exact match in training data")
    
    # Get prediction
    result = ai.predict('laptop', 'Dell', 'XPS 13', symptoms)
    
    print(f"   Predicted: {result['primaryFault']} (confidence: {result['confidence']:.2f})")
    print(f"   Components: {result['componentsToCheck']}")
    
    # Check if result seems reasonable
    if result['confidence'] > 0.8:
        print(f"   WARNING: Very high confidence for unknown input - may be using mock logic")
    elif result['confidence'] < 0.2:
        print(f"   OK: Low confidence for unknown input")
    else:
        print(f"   OK: Moderate confidence for unknown input")

print("\n2. Checking training data for similar patterns:")
for record in ai.training_records[:5]:  # Check first 5 records
    print(f"   '{record['symptoms']}' -> '{record['fault']}'")

print("\n3. Testing edge case - completely random input:")
random_input = "xyz abc def 123 test"
print(f"Input: '{random_input}'")

result = ai.predict('laptop', 'Dell', 'XPS 13', random_input)
print(f"Predicted: {result['primaryFault']} (confidence: {result['confidence']:.2f})")

if result['confidence'] > 0.5:
    print("WARNING: High confidence for random input - definitely using mock logic!")
else:
    print("OK: Low confidence for random input")

print("\n4. Checking if similarity model is working:")
# Find the most similar training record to our test input
test_symptom = "my keyboard is typing wrong letters"

if hasattr(ai, 'symptom_vectors') and ai.is_trained:
    # Vectorize our test input
    input_vector = ai.vectorizer.transform([test_symptom])
    
    # Find nearest neighbors
    distances, indices = ai.similarity_model.kneighbors(input_vector.toarray())
    
    print(f"Most similar training records to '{test_symptom}':")
    for idx in indices[0][:3]:
        if idx < len(ai.training_records):
            record = ai.training_records[idx]
            print(f"   '{record['symptoms']}' -> '{record['fault']}' (distance: {distances[0][list(indices[0]).index(idx)]:.3f})")
else:
    print("Model not properly trained!")

print("\n" + "=" * 80)
print("DIAGNOSIS")
print("=" * 80)

# Check if the issue is in the image analysis or other parts
print("\n5. Checking if issue is in image analysis (mock data):")
from app.models.diagnosis_model import FaultDiagnosisAI

# Test image analysis
test_ai = FaultDiagnosisAI()
image_result = test_ai.analyze_image(b"fake_image_data")

print(f"Image analysis result: {image_result['overall_assessment']}")
print(f"Damage indicators detected: {sum(1 for v in image_result['damage_indicators'].values() if v.get('detected', False))}")

if image_result['damage_indicators']['screen_cracks']['detected']:
    print("WARNING: Image analysis is using mock/random data!")
else:
    print("OK: Image analysis seems to be working normally")
