#!/usr/bin/env python3

import sys
import os
import pickle
import joblib
from pathlib import Path

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diagnosis_model import FaultDiagnosisAI

def save_trained_models(ai_model, save_dir: str = None):
    """Save trained models to disk for faster loading"""
    
    if save_dir is None:
        save_dir = Path(__file__).resolve().parents[2] / "models"
    
    save_dir = Path(save_dir)
    save_dir.mkdir(exist_ok=True)
    
    if not ai_model.is_trained:
        print("Model is not trained yet!")
        return False
    
    # Save individual components
    model_files = {
        'vectorizer.pkl': ai_model.vectorizer,
        'classifier.pkl': ai_model.classifier,
        'similarity_model.pkl': ai_model.similarity_model,
        'fault_lookup.pkl': ai_model.fault_lookup,
        'training_records.pkl': ai_model.training_records
    }
    
    try:
        for filename, model in model_files.items():
            filepath = save_dir / filename
            joblib.dump(model, filepath)
            print(f"Saved {filename}")
        
        # Save metadata
        metadata = {
            'is_trained': ai_model.is_trained,
            'training_samples': len(ai_model.training_records),
            'unique_faults': len(set(record['fault'] for record in ai_model.training_records))
        }
        
        metadata_path = save_dir / 'metadata.pkl'
        joblib.dump(metadata, metadata_path)
        print(f"Saved metadata.pkl")
        
        print(f"\nAll models saved to: {save_dir}")
        return True
        
    except Exception as e:
        print(f"Error saving models: {e}")
        return False

def load_trained_models(ai_model, save_dir: str = None):
    """Load pre-trained models from disk"""
    
    if save_dir is None:
        save_dir = Path(__file__).resolve().parents[2] / "models"
    
    save_dir = Path(save_dir)
    
    if not save_dir.exists():
        print(f"Models directory not found: {save_dir}")
        return False
    
    model_files = {
        'vectorizer.pkl': 'vectorizer',
        'classifier.pkl': 'classifier', 
        'similarity_model.pkl': 'similarity_model',
        'fault_lookup.pkl': 'fault_lookup',
        'training_records.pkl': 'training_records'
    }
    
    try:
        for filename, attr_name in model_files.items():
            filepath = save_dir / filename
            if filepath.exists():
                loaded_model = joblib.load(filepath)
                setattr(ai_model, attr_name, loaded_model)
                print(f"Loaded {filename}")
            else:
                print(f"Missing file: {filename}")
                return False
        
        # Load metadata
        metadata_path = save_dir / 'metadata.pkl'
        if metadata_path.exists():
            metadata = joblib.load(metadata_path)
            ai_model.is_trained = metadata['is_trained']
            print(f"Loaded metadata: {metadata['training_samples']} samples, {metadata['unique_faults']} faults")
        
        print(f"\nAll models loaded from: {save_dir}")
        return True
        
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

def main():
    """Main function to save or load models"""
    
    print("=" * 60)
    print("MODEL SAVE/LOAD UTILITY")
    print("=" * 60)
    
    # Initialize AI model
    ai = FaultDiagnosisAI()
    
    print("\n1. Saving trained models...")
    success = save_trained_models(ai)
    
    if success:
        print("\n2. Testing model loading...")
        
        # Create new AI instance and load models
        new_ai = FaultDiagnosisAI()
        
        # Load saved models
        load_success = load_trained_models(new_ai)
        
        if load_success:
            print("\n3. Testing loaded model...")
            
            # Test prediction
            result = new_ai.predict('laptop', 'Dell', 'XPS 13', 'my laptop is slow')
            print(f"Prediction: {result['primaryFault']} (confidence: {result['confidence']:.2f})")
            print(f"Components: {result['componentsToCheck']}")
            
            print("\nModel save/load test successful!")
        else:
            print("Model loading failed!")
    else:
        print("Model saving failed!")

if __name__ == "__main__":
    main()
