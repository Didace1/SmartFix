import numpy as np
import pandas as pd
import warnings
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
from pathlib import Path
from typing import List, Dict, Any

# Suppress sklearn warnings
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

class FaultDiagnosisAI:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.similarity_model = NearestNeighbors(n_neighbors=5, metric='cosine')
        self.is_trained = False
        self.training_records: List[Dict[str, Any]] = []
        self.fault_lookup: Dict[str, Dict[str, Any]] = {}
        
        # Load training data from real dataset first, fallback to bundled sample.
        self.load_training_data()
        
    def load_training_data(self):
        """Load historical fault data from CSV dataset, with safe fallback."""
        
        # Try to load pre-trained models first for faster startup
        if self._load_saved_models():
            print("Loaded pre-trained models successfully")
            return
        
        # If no saved models, train from scratch
        print("No saved models found, training from scratch...")
        
        # Try comprehensive dataset first
        comprehensive_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "comprehensive_training_data_fixed.csv"
        original_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "training_data.csv"

        if comprehensive_path.exists():
            try:
                self.training_records = self._load_csv_records(comprehensive_path)
                print(f"Loaded {len(self.training_records)} comprehensive training records")
            except Exception as e:
                print(f"Failed to load comprehensive dataset: {e}")
                self.training_records = self._load_sample_records()
        elif original_path.exists():
            try:
                self.training_records = self._load_csv_records(original_path)
                print(f"Loaded {len(self.training_records)} original training records")
            except Exception:
                self.training_records = self._load_sample_records()
        else:
            self.training_records = self._load_sample_records()

        self._build_fault_lookup()
        self.prepare_training_vectors()
    
    def _load_saved_models(self) -> bool:
        """Load pre-trained models from disk for faster startup"""
        try:
            models_dir = Path(__file__).resolve().parents[2] / "models"
            
            if not models_dir.exists():
                return False
            
            model_files = {
                'vectorizer.pkl': 'vectorizer',
                'classifier.pkl': 'classifier',
                'similarity_model.pkl': 'similarity_model',
                'fault_lookup.pkl': 'fault_lookup',
                'training_records.pkl': 'training_records'
            }
            
            for filename, attr_name in model_files.items():
                filepath = models_dir / filename
                if not filepath.exists():
                    return False
                
                loaded_model = joblib.load(filepath)
                setattr(self, attr_name, loaded_model)
            
            # Load metadata
            metadata_path = models_dir / 'metadata.pkl'
            if metadata_path.exists():
                metadata = joblib.load(metadata_path)
                self.is_trained = metadata['is_trained']
            
            return True
            
        except Exception as e:
            print(f"Error loading saved models: {e}")
            return False

    def _load_csv_records(self, data_path: Path) -> List[Dict[str, Any]]:
        """Parse diagnosis training records from CSV."""
        df = pd.read_csv(data_path)
        expected_columns = {
            "device_type",
            "brand",
            "model",
            "symptom_text",
            "diagnosis",
            "components",
            "repair_time",
            "success_rate",
            "technician_level",
        }

        if not expected_columns.issubset(set(df.columns)):
            missing = sorted(expected_columns.difference(set(df.columns)))
            raise ValueError(f"Training CSV missing columns: {', '.join(missing)}")

        records: List[Dict[str, Any]] = []
        for _, row in df.iterrows():
            components = [
                item.strip()
                for item in str(row["components"]).split(";")
                if item and item.strip()
            ]
            records.append(
                {
                    "device_type": str(row["device_type"]).strip().lower(),
                    "brand": str(row["brand"]).strip(),
                    "model": str(row["model"]).strip(),
                    "symptoms": str(row["symptom_text"]).strip(),
                    "fault": str(row["diagnosis"]).strip(),
                    "components": components,
                    "repair_time": int(row["repair_time"]) if pd.notna(row["repair_time"]) else 60,
                    "success_rate": float(row["success_rate"]) if pd.notna(row["success_rate"]) else 85.0,
                    "skill_level": str(row["technician_level"]).strip() if pd.notna(row["technician_level"]) and str(row["technician_level"]).strip() else "Intermediate",
                }
            )

        if not records:
            raise ValueError("No rows in training CSV")

        return records

    def _load_sample_records(self) -> List[Dict[str, Any]]:
        """Fallback records used only when CSV is missing/invalid."""
        return [
            {
                "device_type": "laptop",
                "brand": "Generic",
                "model": "Generic",
                "symptoms": "won't turn on, no power, black screen",
                "fault": "Power supply failure",
                "components": ["Power adapter", "Battery", "Motherboard"],
                "repair_time": 60,
                "success_rate": 90.0,
                "skill_level": "Intermediate",
            },
            {
                "device_type": "laptop",
                "brand": "Generic",
                "model": "Generic",
                "symptoms": "overheating, fan loud, shutdowns",
                "fault": "Cooling system failure",
                "components": ["Fan", "Heat sink", "Thermal paste"],
                "repair_time": 60,
                "success_rate": 88.0,
                "skill_level": "Intermediate",
            },
            {
                "device_type": "smartphone",
                "brand": "Generic",
                "model": "Generic",
                "symptoms": "cracked screen, touch not working",
                "fault": "Screen damage",
                "components": ["Display", "Touch digitizer"],
                "repair_time": 75,
                "success_rate": 95.0,
                "skill_level": "Advanced",
            },
        ]

    def _build_fault_lookup(self):
        """Pre-compute average metadata per fault for fast response mapping."""
        grouped: Dict[str, Dict[str, Any]] = {}
        for record in self.training_records:
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

        self.fault_lookup = {}
        for fault, meta in grouped.items():
            avg_time = int(np.mean(meta["repair_times"])) if meta["repair_times"] else 60
            avg_success = float(np.mean(meta["success_rates"])) if meta["success_rates"] else 85.0
            skill = max(set(meta["skill_levels"]), key=meta["skill_levels"].count) if meta["skill_levels"] else "Intermediate"
            self.fault_lookup[fault] = {
                "repair_time": avg_time,
                "success_rate": avg_success,
                "skill_level": skill,
                "components": sorted(meta["components"]),
            }
    
    def prepare_training_vectors(self):
        """Prepare text vectors for ML models"""
        # Skip training if already trained to avoid sklearn warnings
        if self.is_trained:
            return
            
        all_symptoms = []
        all_faults = []
        
        for record in self.training_records:
            all_symptoms.append(record["symptoms"])
            all_faults.append(record["fault"])
        
        # Ensure we have enough samples for classification
        if len(all_symptoms) < 10:
            print("Warning: Not enough training samples for reliable classification")
            self.is_trained = False
            return
        
        if all_symptoms:
            self.symptom_vectors = self.vectorizer.fit_transform(all_symptoms)
            
            # Check if we have reasonable class distribution
            unique_faults = len(set(all_faults))
            total_samples = len(all_faults)
            
            if unique_faults > total_samples * 0.5:
                print(f"Warning: Too many unique classes ({unique_faults}) for samples ({total_samples})")
                # Group similar faults to reduce classes
                grouped_faults = []
                for fault in all_faults:
                    # Simple grouping by first word
                    first_word = fault.split()[0].lower()
                    grouped_faults.append(first_word)
                
                self.classifier.fit(self.symptom_vectors, grouped_faults)
            else:
                self.classifier.fit(self.symptom_vectors, all_faults)
            
            self.similarity_model.fit(self.symptom_vectors.toarray())
            self.is_trained = True
    
    def analyze_symptoms(self, symptoms: str, symptoms_list: List[str] = None, 
                       additional_notes: str = None) -> Dict[str, Any]:
        """Analyze and preprocess user-entered symptoms for better diagnosis"""
        
        # Combine all symptom inputs
        all_symptoms = [symptoms] if symptoms else []
        if symptoms_list:
            all_symptoms.extend(symptoms_list)
        if additional_notes:
            all_symptoms.append(additional_notes)
        
        combined_symptoms = " ".join(all_symptoms)
        
        # Validate input quality
        input_quality = self._validate_input_quality(combined_symptoms)
        
        if input_quality['is_valid']:
            # Process valid symptoms
            normalized_symptoms = self._normalize_symptoms(combined_symptoms)
            symptom_patterns = self._extract_symptom_patterns(normalized_symptoms)
            severity_indicators = self._identify_severity(normalized_symptoms)
            device_issues = self._detect_device_issues(normalized_symptoms)
        else:
            # Handle invalid input
            return self._handle_invalid_input(combined_symptoms, input_quality)
        
        return {
            "normalized_symptoms": normalized_symptoms,
            "symptom_patterns": symptom_patterns,
            "severity_indicators": severity_indicators,
            "device_issues": device_issues,
            "combined_text": combined_symptoms,
            "input_quality": input_quality
        }
    
    def _validate_input_quality(self, symptoms: str) -> Dict[str, Any]:
        """Validate the quality and readability of user input"""
        if not symptoms or len(symptoms.strip()) < 3:
            return {
                'is_valid': False,
                'issue': 'too_short',
                'message': 'Input is too short or empty',
                'confidence': 0.1
            }
        
        # Check for random/repeated characters
        import re
        repeated_pattern = re.compile(r'(.)\1{4,}')  # Same character repeated 5+ times
        if repeated_pattern.search(symptoms.lower()):
            return {
                'is_valid': False,
                'issue': 'repeated_characters',
                'message': 'Input contains repeated characters',
                'confidence': 0.1
            }
        
        # Check for gibberish (low word diversity)
        words = symptoms.split()
        if len(words) > 0:
            unique_words = len(set(word.lower() for word in words if len(word) > 2))
            if unique_words < 2 and len(words) > 3:
                return {
                    'is_valid': False,
                    'issue': 'low_diversity',
                    'message': 'Input appears to be gibberish',
                    'confidence': 0.1
                }
        
        # Check for meaningful content
        meaningful_keywords = [
            'won\'t', 'doesn\'t', 'can\'t', 'broken', 'cracked', 'slow', 'fast', 'hot', 'cold',
            'power', 'battery', 'screen', 'display', 'keyboard', 'mouse', 'touch', 'button',
            'sound', 'audio', 'speaker', 'microphone', 'camera', 'wifi', 'bluetooth',
            'internet', 'network', 'connection', 'usb', 'port', 'charging', 'overheat',
            'freeze', 'crash', 'lag', 'slow', 'fast', 'restart', 'shutdown', 'turn on',
            'turn off', 'work', 'working', 'not working', 'problem', 'issue', 'error',
            'fail', 'failure', 'damage', 'water', 'liquid', 'drop', 'fall', 'hit'
        ]
        
        symptoms_lower = symptoms.lower()
        has_meaningful_content = any(keyword in symptoms_lower for keyword in meaningful_keywords)
        
        if not has_meaningful_content and len(symptoms) > 10:
            return {
                'is_valid': False,
                'issue': 'no_meaningful_content',
                'message': 'Input does not contain recognizable symptom descriptions',
                'confidence': 0.2
            }
        
        return {
            'is_valid': True,
            'issue': None,
            'message': 'Input appears valid',
            'confidence': 0.9
        }
    
    def _handle_invalid_input(self, symptoms: str, quality_info: Dict) -> Dict[str, Any]:
        """Handle cases where user input is invalid or unreadable"""
        
        # Provide generic analysis for invalid input
        generic_patterns = ['general_malfunction']
        generic_issues = ['unknown_issue']
        
        severity = {
            'level': 'unknown',
            'urgency': 'assessment_needed',
            'indicators': ['unclear_description']
        }
        
        # Try to extract any possible meaning
        symptoms_lower = symptoms.lower()
        
        # Basic keyword detection even in invalid input
        if any(word in symptoms_lower for word in ['power', 'turn', 'on', 'off']):
            generic_patterns.append('power_issues')
            generic_issues.append('power_problem')
        
        if any(word in symptoms_lower for word in ['screen', 'display']):
            generic_patterns.append('screen_problems')
            generic_issues.append('screen_issue')
        
        if any(word in symptoms_lower for word in ['slow', 'fast', 'lag']):
            generic_patterns.append('performance')
            generic_issues.append('performance_issue')
        
        return {
            "normalized_symptoms": symptoms,
            "symptom_patterns": generic_patterns,
            "severity_indicators": severity,
            "device_issues": generic_issues,
            "combined_text": symptoms,
            "input_quality": quality_info,
            "requires_clarification": True,
            "clarification_message": self._get_clarification_message(quality_info['issue'])
        }
    
    def _get_clarification_message(self, issue_type: str) -> str:
        """Get appropriate clarification message based on input issue"""
        
        messages = {
            'too_short': 'Please provide more details about the issue you\'re experiencing. For example: "My laptop won\'t turn on" or "The screen is cracked".',
            'repeated_characters': 'Please describe the issue in clear words instead of repeating characters. For example: "The keyboard is not working" or "The device is overheating".',
            'low_diversity': 'Please describe your issue using different words. For example: "My phone is running very slow and apps keep crashing".',
            'no_meaningful_content': 'Please describe the specific problem you\'re experiencing. Include details like what\'s not working, when it started, and any error messages you see.'
        }
        
        return messages.get(issue_type, 'Please provide a clear description of the issue you\'re experiencing with your device.')
    
    def _normalize_symptoms(self, symptoms: str) -> str:
        """Normalize and clean symptom text"""
        import re
        
        # Convert to lowercase
        normalized = symptoms.lower()
        
        # Remove extra whitespace
        normalized = re.sub(r'\s+', ' ', normalized.strip())
        
        # Common symptom normalization mappings
        symptom_mappings = {
            'wont': 'won\'t',
            'dont': 'don\'t',
            'doesnt': 'doesn\'t',
            'didnt': 'didn\'t',
            'cant': 'can\'t',
            'cannot': 'can\'t',
            'wifi': 'wi-fi',
            'wifi': 'wi-fi',
            'bluetooth': 'bluetooth',
            'usb': 'usb',
            'lcd': 'screen',
            'led': 'indicator',
            'cpu': 'processor',
            'gpu': 'graphics',
            'ram': 'memory',
            'ssd': 'storage',
            'hdd': 'storage',
            'battery': 'battery',
            'power': 'power',
            'charging': 'charging',
            'screen': 'screen',
            'display': 'screen',
            'touch': 'touch',
            'keyboard': 'keyboard',
            'mouse': 'mouse',
            'trackpad': 'trackpad',
            'speaker': 'speaker',
            'audio': 'audio',
            'sound': 'audio',
            'microphone': 'microphone',
            'camera': 'camera',
            'webcam': 'camera',
            'fan': 'fan',
            'overheat': 'overheating',
            'hot': 'overheating',
            'temperature': 'temperature',
            'slow': 'slow',
            'lag': 'slow',
            'freeze': 'freezing',
            'crash': 'crashing',
            'restart': 'restarting',
            'reboot': 'restarting',
            'shutdown': 'shutting down',
            'turn off': 'shutting down',
            'power off': 'shutting down'
        }
        
        # Apply mappings
        for old, new in symptom_mappings.items():
            normalized = re.sub(rf'\b{old}\b', new, normalized)
        
        return normalized
    
    def _extract_symptom_patterns(self, symptoms: str) -> List[str]:
        """Extract key symptom patterns from user input"""
        patterns = []
        
        # Common symptom patterns
        pattern_keywords = {
            'power_issues': ['won\'t turn on', 'no power', 'dead', 'not charging', 'battery drain'],
            'screen_problems': ['cracked', 'broken', 'black screen', 'white screen', 'flickering', 'dim'],
            'performance': ['slow', 'lag', 'freeze', 'hang', 'crash', 'unresponsive'],
            'connectivity': ['wifi', 'bluetooth', 'internet', 'network', 'connection'],
            'audio': ['no sound', 'speaker', 'microphone', 'audio', 'volume'],
            'input': ['keyboard', 'mouse', 'trackpad', 'touch', 'button'],
            'overheating': ['hot', 'overheat', 'fan', 'temperature', 'burning'],
            'storage': ['storage', 'memory', 'space', 'disk', 'ssd', 'hdd'],
            'software': ['update', 'install', 'app', 'software', 'driver', 'os'],
            'physical_damage': ['dropped', 'water', 'liquid', 'damage', 'bent', 'scratched']
        }
        
        symptoms_lower = symptoms.lower()
        
        for pattern, keywords in pattern_keywords.items():
            for keyword in keywords:
                if keyword in symptoms_lower:
                    patterns.append(pattern)
                    break
        
        return list(set(patterns))
    
    def _identify_severity(self, symptoms: str) -> Dict[str, Any]:
        """Identify severity indicators from symptoms"""
        severity = {
            'level': 'low',
            'indicators': [],
            'urgency': 'normal'
        }
        
        high_severity_keywords = [
            'won\'t turn on', 'dead', 'smoke', 'burning', 'sparks', 
            'water damage', 'liquid damage', 'dropped', 'cracked screen',
            'completely broken', 'totally dead', 'no power at all'
        ]
        
        medium_severity_keywords = [
            'slow', 'lag', 'freeze', 'crash', 'overheating', 'fan loud',
            'not charging', 'battery drain', 'intermittent', 'sometimes'
        ]
        
        symptoms_lower = symptoms.lower()
        
        for keyword in high_severity_keywords:
            if keyword in symptoms_lower:
                severity['level'] = 'high'
                severity['urgency'] = 'urgent'
                severity['indicators'].append(keyword)
                break
        
        if severity['level'] == 'low':
            for keyword in medium_severity_keywords:
                if keyword in symptoms_lower:
                    severity['level'] = 'medium'
                    severity['urgency'] = 'soon'
                    severity['indicators'].append(keyword)
                    break
        
        return severity
    
    def _detect_device_issues(self, symptoms: str) -> List[str]:
        """Detect device-specific issues from symptoms"""
        issues = []
        
        # Device-specific issue detection
        issue_mapping = {
            'battery_failure': ['battery', 'charging', 'power', 'drain'],
            'screen_damage': ['screen', 'display', 'cracked', 'broken', 'flickering'],
            'motherboard_issue': ['won\'t turn on', 'dead', 'power', 'short circuit'],
            'overheating': ['hot', 'overheat', 'fan', 'temperature', 'burning'],
            'software_conflict': ['crash', 'freeze', 'slow', 'lag', 'app', 'software'],
            'connectivity_problem': ['wifi', 'bluetooth', 'network', 'connection'],
            'storage_failure': ['storage', 'disk', 'ssd', 'hdd', 'corrupt'],
            'input_device_failure': ['keyboard', 'mouse', 'trackpad', 'touch', 'button'],
            'audio_failure': ['sound', 'speaker', 'microphone', 'audio', 'volume'],
            'water_damage': ['water', 'liquid', 'moisture', 'spill']
        }
        
        symptoms_lower = symptoms.lower()
        
        for issue, keywords in issue_mapping.items():
            if any(keyword in symptoms_lower for keyword in keywords):
                issues.append(issue)
        
        return issues
    
    def predict(self, device_type: str, brand: str, model: str, 
                symptoms: str, symptoms_list: List[str] = None,
                image_analysis: Dict = None, additional_notes: str = None) -> Dict[str, Any]:
        """Predict fault based on symptoms with enhanced analysis"""
        
        # Analyze symptoms first
        symptom_analysis = self.analyze_symptoms(symptoms, symptoms_list, additional_notes)
        
        # Use normalized symptoms for prediction
        combined_symptoms = symptom_analysis["combined_text"]
        
        # Vectorize input
        input_vector = self.vectorizer.transform([combined_symptoms])
        
        # Get primary fault prediction
        if self.is_trained:
            primary_fault = self.classifier.predict(input_vector)[0]
            confidence = max(self.classifier.predict_proba(input_vector)[0])
            
            # Find similar cases
            distances, indices = self.similarity_model.kneighbors(input_vector.toarray())
            similar_cases = []
            
            for idx in indices[0][:3]:
                if idx < len(self.training_records):
                    record = self.training_records[idx]
                    similar_cases.append({
                        "description": f"{record.get('brand', '')} {record.get('model', '')}: {record.get('symptoms', '')}".strip(),
                        "resolution": f"Repair success rate: {int(record.get('success_rate', 85))}%"
                    })
        else:
            # Fallback logic
            primary_fault = "Unknown fault"
            confidence = 0.5
            similar_cases = []
        
        fault_meta = self.fault_lookup.get(primary_fault, {})
        all_components = fault_meta.get("components", [])
        
        # Filter components based on device type
        device_specific_components = self._filter_components_by_device_type(
            all_components, device_type, brand, model
        )
        
        components_to_check = device_specific_components if device_specific_components else all_components
        recommended_actions = [
            f"Inspect {component}" for component in components_to_check
        ] or ["Run standard diagnostic workflow"]
        
        # Generate alternative faults
        alternative_faults = []
        if self.is_trained:
            probabilities = self.classifier.predict_proba(input_vector)[0]
            classes = self.classifier.classes_
            ranked = sorted(
                zip(classes, probabilities),
                key=lambda item: item[1],
                reverse=True
            )
            for fault, probability in ranked[1:4]:
                alternative_faults.append({
                    "fault": fault,
                    "probability": float(probability)
                })
        
        return {
            "primaryFault": primary_fault,
            "confidence": float(confidence),
            "alternativeFaults": alternative_faults,
            "similarCases": similar_cases,
            "recommendedActions": recommended_actions,
            "componentsToCheck": components_to_check
        }
    
    def analyze_image(self, image_data: bytes) -> Dict[str, Any]:
        """Analyze image for fault detection - simplified non-random implementation"""
        
        # Initialize damage indicators with no detections
        damage_indicators = {
            "screen_cracks": {
                "detected": False,
                "severity": "none",
                "affected_area": "none",
                "impact": "none"
            },
            "water_damage": {
                "detected": False,
                "corrosion_signs": False,
                "liquid_residue": False,
                "severity": "none"
            },
            "burn_marks": {
                "detected": False,
                "location": "none",
                "severity": "none",
                "component_risk": "none"
            },
            "physical_damage": {
                "detected": False,
                "type": "none",
                "severity": "none",
                "repair_complexity": "simple"
            },
            "component_failure": {
                "detected": False,
                "affected_components": [],
                "failure_mode": "none",
                "urgency": "low"
            },
            "error_codes": {
                "detected": False,
                "code": None,
                "meaning": "none",
                "action_required": "none"
            }
        }
        
        # Simple, non-random analysis based on image data characteristics
        try:
            # Basic image validation
            if not image_data or len(image_data) < 100:
                return {
                    "overall_assessment": "invalid_image",
                    "critical_issues": ["Invalid or empty image data"],
                    "damage_indicators": damage_indicators,
                    "recommended_inspections": ["Please provide a valid image"],
                    "confidence_score": 0.0,
                    "analysis_timestamp": pd.Timestamp.now().isoformat()
                }
            
            # Check for common image signatures
            image_signatures = {
                b'\xFF\xD8\xFF': "JPEG",
                b'\x89PNG\r\n\x1a\n': "PNG",
                b'GIF87a': "GIF",
                b'GIF89a': "GIF",
                b'RIFF': "WEBP/BMP"
            }
            
            image_type = "unknown"
            for signature, format_name in image_signatures.items():
                if image_data.startswith(signature):
                    image_type = format_name
                    break
            
            # Simple analysis based on image size and type
            image_size = len(image_data)
            
            # Very basic heuristics (non-random)
            if image_size < 1000:  # Very small image
                damage_indicators["physical_damage"]["detected"] = True
                damage_indicators["physical_damage"]["type"] = "low_quality"
                damage_indicators["physical_damage"]["severity"] = "minor"
                overall_assessment = "attention_needed"
            elif image_size > 5000000:  # Very large image might indicate high resolution damage
                damage_indicators["screen_cracks"]["detected"] = True
                damage_indicators["screen_cracks"]["severity"] = "minor"
                damage_indicators["screen_cracks"]["affected_area"] = "unknown"
                overall_assessment = "attention_needed"
            else:
                overall_assessment = "normal"
            
            critical_issues = []
            for category, details in damage_indicators.items():
                if details.get("detected"):
                    critical_issues.append(f"Potential {category.replace('_', ' ')} detected")
            
            return {
                "overall_assessment": overall_assessment,
                "critical_issues": critical_issues,
                "damage_indicators": damage_indicators,
                "recommended_inspections": self._generate_image_recommendations(damage_indicators),
                "confidence_score": 0.5 if overall_assessment == "normal" else 0.3,
                "analysis_timestamp": pd.Timestamp.now().isoformat(),
                "image_info": {
                    "type": image_type,
                    "size_bytes": image_size
                }
            }
            
        except Exception as e:
            return {
                "overall_assessment": "error",
                "critical_issues": [f"Analysis error: {str(e)}"],
                "damage_indicators": damage_indicators,
                "recommended_inspections": ["Please try again with a different image"],
                "confidence_score": 0.0,
                "analysis_timestamp": pd.Timestamp.now().isoformat()
            }
    
    def _generate_image_recommendations(self, damage_indicators: Dict) -> List[str]:
        """Generate specific recommendations based on image analysis"""
        recommendations = []
        
        if damage_indicators["screen_cracks"]["detected"]:
            severity = damage_indicators["screen_cracks"]["severity"]
            if severity == "severe":
                recommendations.append("Immediate screen replacement required")
            elif severity == "moderate":
                recommendations.append("Screen repair or replacement recommended")
            else:
                recommendations.append("Monitor crack progression, consider screen protector")
        
        if damage_indicators["water_damage"]["detected"]:
            recommendations.append("Power down device immediately")
            recommendations.append("Remove battery if possible")
            recommendations.append("Place in dry, warm environment for 48-72 hours")
            if damage_indicators["water_damage"]["corrosion_signs"]:
                recommendations.append("Professional cleaning required")
        
        if damage_indicators["burn_marks"]["detected"]:
            recommendations.append("Do not power on device")
            recommendations.append("Professional inspection required")
            recommendations.append("Check for component replacement needs")
        
        if damage_indicators["physical_damage"]["detected"]:
            complexity = damage_indicators["physical_damage"]["repair_complexity"]
            if complexity == "expert":
                recommendations.append("Professional repair service recommended")
            elif complexity == "complex":
                recommendations.append("Advanced repair skills required")
        
        if damage_indicators["error_codes"]["detected"]:
            action = damage_indicators["error_codes"]["action_required"]
            recommendations.append(f"Error code action: {action}")
        
        if not recommendations:
            recommendations.append("No critical issues detected from image analysis")
        
        return recommendations

    def get_known_models(self, device_type: str, brand: str) -> List[str]:
        """Return known models for a brand and device type from training data."""
        device_key = (device_type or "").strip().lower()
        brand_key = (brand or "").strip().lower()
        models = set()
        for record in self.training_records:
            if record.get("device_type", "").strip().lower() == device_key and record.get("brand", "").strip().lower() == brand_key:
                model_name = str(record.get("model", "")).strip()
                if model_name:
                    models.add(model_name)
        return sorted(models)
    
    def _filter_components_by_device_type(self, components: List[str], device_type: str, brand: str, model: str) -> List[str]:
        """Filter components to only include those relevant to the specific device type"""
        device_type_lower = device_type.lower()
        
        # Define component compatibility by device type
        device_components = {
            'laptop': {
                'common': ['RAM', 'SSD', 'Operating system', 'Processor', 'Fan', 'Heat sink', 'Thermal paste'],
                'brand_specific': {
                    'apple': ['Logic board', 'AirPort card', 'Audio board', 'Assembly'],
                    'dell': ['Motherboard', 'Wifi card', 'Network drivers'],
                    'hp': ['Motherboard', 'Wifi card', 'Network drivers'],
                    'lenovo': ['Motherboard', 'Wifi card', 'Network drivers']
                }
            },
            'smartphone': {
                'common': ['Processor', 'RAM', 'Battery', 'Charging port', 'Display', 'Touch screen', 'Wifi chip', 'Antenna'],
                'brand_specific': {
                    'apple': ['Logic board', 'Digitizer', 'Camera module', 'Lens', 'iOS'],
                    'samsung': ['Android', 'Camera module', 'Lens']
                }
            },
            'tablet': {
                'common': ['Processor', 'RAM', 'Battery', 'Charging port', 'Display', 'Touch screen', 'Wifi chip', 'Antenna'],
                'brand_specific': {
                    'apple': ['Logic board', 'Digitizer', 'Camera module', 'Lens', 'iPadOS'],
                    'samsung': ['Android', 'Camera module', 'Lens']
                }
            }
        }
        
        if device_type_lower not in device_components:
            return components  # Return all components if device type not recognized
        
        # Get relevant components for this device type
        relevant_components = set(device_components[device_type_lower]['common'])
        
        # Add brand-specific components
        brand_lower = brand.lower()
        if brand_lower in device_components[device_type_lower]['brand_specific']:
            relevant_components.update(device_components[device_type_lower]['brand_specific'][brand_lower])
        
        # Filter input components
        filtered = []
        for component in components:
            # Check if component is relevant to this device type
            for relevant in relevant_components:
                if relevant.lower() in component.lower():
                    filtered.append(component)
                    break
        
        return filtered if filtered else components[:3]  # Return top 3 if no matches