#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

# Test the diagnosis model
diagnosis_ai = FaultDiagnosisAI()

# Test getting models for Dell laptops
models = diagnosis_ai.get_known_models("laptop", "Dell")
print(f"Available Dell laptop models: {models}")

# Test getting models for Apple smartphones
models = diagnosis_ai.get_known_models("smartphone", "Apple")
print(f"Available Apple smartphone models: {models}")

# Test getting models for Samsung tablets
models = diagnosis_ai.get_known_models("tablet", "Samsung")
print(f"Available Samsung tablet models: {models}")
