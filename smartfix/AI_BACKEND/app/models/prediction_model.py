import numpy as np
import pandas as pd
import warnings
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, List
from pathlib import Path

# Suppress sklearn warnings
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

class FailurePredictionAI:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.device_component_risk: Dict[str, Dict[str, float]] = {}
        self.device_profiles: List[Dict[str, Any]] = []
        self.aging_patterns: Dict[str, Dict[str, Any]] = {}
        
        # Initialize with real training data when available.
        self.initialize_model()
        self.load_aging_patterns()
    
    def initialize_model(self):
        """Train regression model from CSV-derived synthetic aging features."""
        data_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "training_data.csv"

        X_train = []
        y_train = []

        if data_path.exists():
            try:
                df = pd.read_csv(data_path)
                required_columns = {"device_type", "components", "repair_time", "success_rate"}
                if required_columns.issubset(set(df.columns)):
                    for _, row in df.iterrows():
                        device_type_raw = str(row.get("device_type", "unknown")).strip().lower()
                        brand = str(row.get("brand", "Unknown")).strip()
                        model = str(row.get("model", "Unknown")).strip()
                        repair_time = float(row.get("repair_time", 60))
                        success_rate = float(row.get("success_rate", 85))
                        components = [c.strip() for c in str(row.get("components", "")).split(";") if c.strip()]
                        component_count = max(1, len(components))

                        # Build plausible usage profile from historical repair signal.
                        age_months = int(max(6, min(60, repair_time * 0.6)))
                        usage_hours = int(max(150, min(4500, repair_time * 30)))
                        temperature_avg = float(max(28, min(70, 30 + (100 - success_rate) * 0.25)))
                        repair_count = int(max(0, min(6, component_count - 1)))

                        # Lower success rates and higher complexity imply lower remaining life.
                        remaining_life = float(max(10, min(98, success_rate - repair_count * 3)))

                        X_train.append([age_months, usage_hours, temperature_avg, repair_count])
                        y_train.append(remaining_life)

                        device_type = device_type_raw
                        if device_type not in self.device_component_risk:
                            self.device_component_risk[device_type] = {}
                        for component in components:
                            current = self.device_component_risk[device_type].get(component, 0.0)
                            # Risk weight grows when success rate is lower.
                            self.device_component_risk[device_type][component] = current + (100.0 - success_rate)

                        self.device_profiles.append({
                            "deviceId": f"{device_type}-{brand}-{model}".lower().replace(" ", "-"),
                            "deviceLabel": f"{brand} {model}",
                            "deviceType": device_type_raw,
                            "brand": brand,
                            "model": model,
                            "age_months": age_months,
                            "usage_hours": usage_hours,
                            "temperature_avg": temperature_avg,
                            "repair_history": [{"issue": "historical repair"}] * max(1, repair_count)
                        })
            except Exception:
                X_train = []
                y_train = []
                self.device_profiles = []

        if not X_train:
            # Fallback training set.
            X_train = [
                [12, 500, 35, 1],
                [24, 1200, 42, 2],
                [36, 2000, 48, 3],
                [48, 3000, 55, 4],
            ]
            y_train = [88, 68, 52, 30]
            self.device_component_risk = {
                "laptop": {"Battery": 25.0, "SSD": 18.0, "Fan": 22.0},
                "smartphone": {"Battery": 20.0, "Charging port": 15.0, "Display": 12.0},
            }
            self.device_profiles = [
                {
                    "deviceId": "fallback-laptop-1",
                    "deviceLabel": "Generic Laptop A",
                    "deviceType": "laptop",
                    "brand": "Generic",
                    "model": "Model A",
                    "age_months": 24,
                    "usage_hours": 1200,
                    "temperature_avg": 40,
                    "repair_history": [{"issue": "battery aging"}]
                },
                {
                    "deviceId": "fallback-phone-1",
                    "deviceLabel": "Generic Smartphone B",
                    "deviceType": "smartphone",
                    "brand": "Generic",
                    "model": "Model B",
                    "age_months": 18,
                    "usage_hours": 900,
                    "temperature_avg": 38,
                    "repair_history": [{"issue": "charging instability"}]
                }
            ]
        
        # Ensure we have enough samples
        if len(X_train) < 5:
            print("Warning: Not enough training samples for reliable prediction")
            self.is_trained = False
            return
        
        # Scale features
        X_scaled = self.scaler.fit_transform(np.array(X_train))
        
        # Train model
        self.model.fit(X_scaled, np.array(y_train))
        self.is_trained = True
    
    def load_aging_patterns(self):
        """Load component aging patterns from CSV data"""
        aging_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "aging_patterns.csv"
        
        if aging_path.exists():
            try:
                df = pd.read_csv(aging_path)
                required_columns = {"device_type", "component", "failure_rate_per_month", "base_failure_risk", 
                                  "aging_factor", "usage_multiplier", "temperature_multiplier", "repair_impact"}
                
                if required_columns.issubset(set(df.columns)):
                    for _, row in df.iterrows():
                        device_type = str(row["device_type"]).strip().lower()
                        component = str(row["component"]).strip()
                        
                        if device_type not in self.aging_patterns:
                            self.aging_patterns[device_type] = {}
                        
                        self.aging_patterns[device_type][component] = {
                            "failure_rate_per_month": float(row["failure_rate_per_month"]),
                            "base_failure_risk": float(row["base_failure_risk"]),
                            "aging_factor": float(row["aging_factor"]),
                            "usage_multiplier": float(row["usage_multiplier"]),
                            "temperature_multiplier": float(row["temperature_multiplier"]),
                            "repair_impact": float(row["repair_impact"])
                        }
            except Exception as e:
                print(f"Error loading aging patterns: {e}")
                self.aging_patterns = {}
    
    def predict(self, device_id: str, device_type: str, age_months: int,
                usage_hours: int, temperature_avg: float, 
                repair_history: List[Dict]) -> Dict[str, Any]:
        """Predict component failure probability"""
        
        # Calculate features
        repair_count = len(repair_history)
        features = np.array([[age_months, usage_hours, temperature_avg, repair_count]])
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Get prediction
        if self.is_trained:
            remaining_life_percent = self.model.predict(features_scaled)[0]
        else:
            remaining_life_percent = 50
        
        # Calculate remaining months (assume max 60 months lifespan)
        max_life_months = 60
        remaining_months = int((remaining_life_percent / 100) * max_life_months)
        
        # Calculate failure probability
        failure_probability = 1 - (remaining_life_percent / 100)
        
        # Determine risk level
        if failure_probability > 0.7:
            risk_level = "High"
            preventive_actions = [
                "Immediate inspection required",
                "Replace component proactively",
                "Schedule urgent maintenance"
            ]
        elif failure_probability > 0.4:
            risk_level = "Medium"
            preventive_actions = [
                "Monitor closely",
                "Order replacement part",
                "Schedule next month maintenance"
            ]
        else:
            risk_level = "Low"
            preventive_actions = [
                "Regular monitoring",
                "Routine maintenance",
                "Check during next service"
            ]
        
        # Determine most likely failing component using aging patterns
        device_key = (device_type or "").strip().lower()
        
        # Get component risk from aging patterns or fallback to device_component_risk
        if device_key in self.aging_patterns:
            component_patterns = self.aging_patterns[device_key]
            component_probabilities = {}
            
            for component, pattern in component_patterns.items():
                # Calculate realistic failure probability based on aging patterns
                base_risk = pattern["base_failure_risk"] / 100.0  # Convert to probability
                failure_rate = pattern["failure_rate_per_month"] / 100.0
                
                # Apply aging factor based on device age
                aging_multiplier = 1 + (age_months * pattern["aging_factor"] / 100)
                
                # Apply usage multiplier
                usage_factor = min(2.0, usage_hours / 1000) * pattern["usage_multiplier"]
                
                # Apply temperature multiplier
                temp_factor = max(1.0, (temperature_avg - 25) / 10) * pattern["temperature_multiplier"]
                
                # Apply repair impact (previous repairs increase failure risk)
                repair_factor = 1 + (repair_count * pattern["repair_impact"])
                
                # Calculate final probability
                component_failure_prob = min(0.95, base_risk + (failure_rate * age_months * aging_multiplier * usage_factor * temp_factor * repair_factor))
                
                component_probabilities[component] = float(component_failure_prob)
        else:
            # Fallback to original method
            component_risk_map = self.device_component_risk.get(device_key) or {
                "Battery": 20.0,
                "Storage": 16.0,
                "Cooling Fan": 14.0,
                "Display": 12.0,
                "Motherboard": 10.0
            }
            total_weight = sum(component_risk_map.values()) or 1.0
            component_probabilities = {
                component: float(min(0.95, max(0.05, failure_probability * (weight / total_weight) * 5)))
                for component, weight in component_risk_map.items()
            }
        
        most_likely_component = max(component_probabilities, key=component_probabilities.get)
        
        return {
            "component": most_likely_component,
            "failureProbability": float(failure_probability),
            "remainingLife_months": remaining_months,
            "riskLevel": risk_level,
            "preventiveActions": preventive_actions,
            "componentProbabilities": component_probabilities
        }

    def get_device_profiles(self) -> List[Dict[str, Any]]:
        """Return device profiles derived from real training data."""
        return self.device_profiles