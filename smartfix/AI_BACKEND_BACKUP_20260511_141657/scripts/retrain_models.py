"""
Model Retraining Script for SmartFix AI
Retrains the AI models with comprehensive training data
"""

import sys
from pathlib import Path
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import numpy as np

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.models.diagnosis_model import FaultDiagnosisAI

class ModelRetrainer:
    def __init__(self):
        self.data_path = Path(__file__).resolve().parents[1] / "data" / "raw"
        self.models_dir = Path(__file__).resolve().parents[2] / "models"
        self.models_dir.mkdir(exist_ok=True)
        
    def load_training_data(self, use_v2: bool = True):
        """Load training data from CSV"""
        
        if use_v2:
            csv_path = self.data_path / "comprehensive_training_data_v2.csv"
        else:
            csv_path = self.data_path / "comprehensive_training_data_fixed.csv"
        
        if not csv_path.exists():
            raise FileNotFoundError(f"Training data not found at {csv_path}")
        
        print(f"Loading training data from: {csv_path}")
        df = pd.read_csv(csv_path)
        
        print(f"Loaded {len(df)} training samples")
        print(f"Unique faults: {df['diagnosis'].nunique()}")
        print(f"Unique devices: {df['model'].nunique()}")
        
        return df
    
    def prepare_training_data(self, df: pd.DataFrame):
        """Prepare data for model training"""
        
        # Extract features and labels
        symptoms = df['symptom_text'].values
        faults = df['diagnosis'].values
        
        # Create training records for similarity search
        training_records = []
        for _, row in df.iterrows():
            components = [
                item.strip()
                for item in str(row["components"]).split(";")
                if item and item.strip()
            ]
            
            record = {
                "device_type": str(row["device_type"]).strip().lower(),
                "brand": str(row["brand"]).strip(),
                "model": str(row["model"]).strip(),
                "symptoms": str(row["symptom_text"]).strip(),
                "fault": str(row["diagnosis"]).strip(),
                "components": components,
                "repair_time": int(row["repair_time"]) if pd.notna(row["repair_time"]) else 60,
                "success_rate": float(row["success_rate"]) if pd.notna(row["success_rate"]) else 85.0,
                "skill_level": str(row["technician_level"]).strip() if pd.notna(row["technician_level"]) else "Intermediate",
            }
            training_records.append(record)
        
        return symptoms, faults, training_records
    
    def build_fault_lookup(self, training_records):
        """Build fault lookup dictionary"""
        
        grouped = {}
        for record in training_records:
            fault = record["fault"]
            if fault not in grouped:
                grouped[fault] = {
                    "repair_times": [],
                    "success_rates": [],
                    "skill_levels": [],
                    "components": set(),
                }
            grouped[fault]["repair_times"].append(record.get("repair_time", 60))
            grouped[fault]["success_rates"].append(record.get("success_rate", 85.0))
            grouped[fault]["skill_levels"].append(record.get("skill_level", "Intermediate"))
            grouped[fault]["components"].update(record.get("components", []))

        fault_lookup = {}
        for fault, meta in grouped.items():
            avg_time = int(np.mean(meta["repair_times"])) if meta["repair_times"] else 60
            avg_success = float(np.mean(meta["success_rates"])) if meta["success_rates"] else 85.0
            skill = max(set(meta["skill_levels"]), key=meta["skill_levels"].count) if meta["skill_levels"] else "Intermediate"
            fault_lookup[fault] = {
                "repair_time": avg_time,
                "success_rate": avg_success,
                "skill_level": skill,
                "components": sorted(meta["components"]),
            }
        
        return fault_lookup
    
    def train_models(self, symptoms, faults, training_records):
        """Train all models"""
        
        print("\n=== Training Models ===")
        
        # Split data for validation
        X_train, X_test, y_train, y_test = train_test_split(
            symptoms, faults, test_size=0.2, random_state=42, stratify=faults
        )
        
        print(f"Training samples: {len(X_train)}")
        print(f"Test samples: {len(X_test)}")
        
        # 1. Train TF-IDF Vectorizer
        print("\n1. Training TF-IDF Vectorizer...")
        vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        X_train_vectors = vectorizer.fit_transform(X_train)
        X_test_vectors = vectorizer.transform(X_test)
        print(f"   Vocabulary size: {len(vectorizer.vocabulary_)}")
        
        # 2. Train Random Forest Classifier
        print("\n2. Training Random Forest Classifier...")
        classifier = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        classifier.fit(X_train_vectors, y_train)
        
        # Evaluate classifier
        y_pred = classifier.predict(X_test_vectors)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"   Accuracy: {accuracy:.2%}")
        
        # 3. Train Similarity Model
        print("\n3. Training Similarity Model...")
        all_vectors = vectorizer.transform(symptoms)
        similarity_model = NearestNeighbors(n_neighbors=5, metric='cosine')
        similarity_model.fit(all_vectors.toarray())
        
        # 4. Build fault lookup
        print("\n4. Building fault lookup...")
        fault_lookup = self.build_fault_lookup(training_records)
        print(f"   Fault categories: {len(fault_lookup)}")
        
        return {
            'vectorizer': vectorizer,
            'classifier': classifier,
            'similarity_model': similarity_model,
            'fault_lookup': fault_lookup,
            'training_records': training_records,
            'accuracy': accuracy
        }
    
    def save_models(self, models_dict):
        """Save trained models to disk"""
        
        print("\n=== Saving Models ===")
        
        # Save each model
        model_files = {
            'vectorizer.pkl': models_dict['vectorizer'],
            'classifier.pkl': models_dict['classifier'],
            'similarity_model.pkl': models_dict['similarity_model'],
            'fault_lookup.pkl': models_dict['fault_lookup'],
            'training_records.pkl': models_dict['training_records']
        }
        
        for filename, model in model_files.items():
            filepath = self.models_dir / filename
            joblib.dump(model, filepath)
            print(f"   Saved: {filename}")
        
        # Save metadata
        metadata = {
            'is_trained': True,
            'num_samples': len(models_dict['training_records']),
            'num_faults': len(models_dict['fault_lookup']),
            'accuracy': models_dict['accuracy']
        }
        metadata_path = self.models_dir / 'metadata.pkl'
        joblib.dump(metadata, metadata_path)
        print(f"   Saved: metadata.pkl")
        
        print(f"\nAll models saved to: {self.models_dir}")
    
    def evaluate_models(self, models_dict, test_symptoms, test_faults):
        """Evaluate model performance"""
        
        print("\n=== Model Evaluation ===")
        
        vectorizer = models_dict['vectorizer']
        classifier = models_dict['classifier']
        
        # Transform test data
        X_test = vectorizer.transform(test_symptoms)
        
        # Predictions
        y_pred = classifier.predict(X_test)
        
        # Metrics
        accuracy = accuracy_score(test_faults, y_pred)
        print(f"\nOverall Accuracy: {accuracy:.2%}")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(test_faults, y_pred, zero_division=0))
        
        # Confidence analysis
        probabilities = classifier.predict_proba(X_test)
        max_probs = np.max(probabilities, axis=1)
        avg_confidence = np.mean(max_probs)
        print(f"\nAverage Confidence: {avg_confidence:.2%}")
        print(f"High Confidence (>80%): {np.sum(max_probs > 0.8) / len(max_probs):.2%}")
        print(f"Medium Confidence (50-80%): {np.sum((max_probs >= 0.5) & (max_probs <= 0.8)) / len(max_probs):.2%}")
        print(f"Low Confidence (<50%): {np.sum(max_probs < 0.5) / len(max_probs):.2%}")
    
    def retrain_all(self, use_v2: bool = True, evaluate: bool = True):
        """Complete retraining pipeline"""
        
        print("=" * 60)
        print("SmartFix AI Model Retraining")
        print("=" * 60)
        
        # Load data
        df = self.load_training_data(use_v2=use_v2)
        
        # Prepare data
        symptoms, faults, training_records = self.prepare_training_data(df)
        
        # Train models
        models_dict = self.train_models(symptoms, faults, training_records)
        
        # Evaluate if requested
        if evaluate:
            X_train, X_test, y_train, y_test = train_test_split(
                symptoms, faults, test_size=0.2, random_state=42, stratify=faults
            )
            self.evaluate_models(models_dict, X_test, y_test)
        
        # Save models
        self.save_models(models_dict)
        
        print("\n" + "=" * 60)
        print("Retraining Complete!")
        print("=" * 60)
        print(f"\nModel Statistics:")
        print(f"  - Total training samples: {len(training_records)}")
        print(f"  - Fault categories: {len(models_dict['fault_lookup'])}")
        print(f"  - Model accuracy: {models_dict['accuracy']:.2%}")
        print(f"  - Models saved to: {self.models_dir}")
        
        return models_dict

if __name__ == "__main__":
    retrainer = ModelRetrainer()
    
    # Retrain with comprehensive v2 data
    models = retrainer.retrain_all(use_v2=True, evaluate=True)
