from typing import Dict, Any, List
import pandas as pd
from pathlib import Path

class RepairRecommendationAI:
    def __init__(self):
        self.repair_database = self.load_repair_database()
        self.parts_inventory = self.load_parts_inventory()
        self.repair_procedures = self.load_repair_procedures()
    
    def load_repair_database(self):
        """Load repair procedures database from real training CSV data."""
        data_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "training_data.csv"
        repair_db: Dict[str, Dict[str, Any]] = {}

        if data_path.exists():
            try:
                df = pd.read_csv(data_path)
                required_columns = {"diagnosis", "components", "repair_time", "success_rate", "technician_level"}
                if required_columns.issubset(set(df.columns)):
                    grouped = df.groupby("diagnosis", dropna=True)
                    for diagnosis, group in grouped:
                        all_parts = set()
                        for components in group["components"].fillna(""):
                            for part in str(components).split(";"):
                                cleaned = part.strip()
                                if cleaned:
                                    all_parts.add(cleaned)

                        avg_time = int(group["repair_time"].fillna(60).astype(float).mean())
                        avg_success = int(group["success_rate"].fillna(85).astype(float).mean())
                        common_skill = (
                            group["technician_level"]
                            .fillna("Intermediate")
                            .astype(str)
                            .mode()
                            .iloc[0]
                        )

                        sorted_parts = sorted(all_parts) if all_parts else ["General internal components"]
                        repair_db[str(diagnosis)] = {
                            "steps": [
                                f"1. Confirm '{diagnosis}' using diagnostic checks",
                                f"2. Inspect affected components: {', '.join(sorted_parts[:4])}",
                                "3. Repair or replace faulty components",
                                "4. Reassemble device and run verification tests",
                                "5. Perform post-repair stability check",
                            ],
                            "tools": [
                                "Precision screwdriver set",
                                "Multimeter",
                                "ESD protection kit",
                                "Diagnostic software toolkit",
                            ],
                            "parts": sorted_parts,
                            "time_minutes": avg_time,
                            "skill_level": common_skill,
                            "cost_estimate": max(30, avg_time * 2),
                            "success_rate": avg_success,
                            "safety_precautions": [
                                "Disconnect power before opening the device",
                                "Use anti-static protection",
                                "Verify no short-circuit before powering on",
                            ],
                        }
            except Exception:
                repair_db = {}

        if repair_db:
            return repair_db

        # Fallback if CSV is unavailable.
        return {
            "General fault": {
                "steps": [
                    "1. Run diagnostics",
                    "2. Inspect internal components",
                    "3. Replace failing part",
                    "4. Validate fix with stress tests",
                ],
                "tools": ["Screwdriver set", "Multimeter", "Diagnostic toolkit"],
                "parts": ["To be determined"],
                "time_minutes": 60,
                "skill_level": "Intermediate",
                "cost_estimate": 120,
                "success_rate": 80,
                "safety_precautions": ["Disconnect power", "Use ESD protection"],
            }
        }

    def load_parts_inventory(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load parts inventory from CSV database"""
        parts_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "parts_inventory.csv"
        inventory: Dict[str, List[Dict[str, Any]]] = {}
        
        if parts_path.exists():
            try:
                df = pd.read_csv(parts_path)
                required_columns = {"device_type", "brand", "model", "part_name", "part_number", 
                                  "compatibility", "average_cost", "availability", 
                                  "replacement_difficulty", "estimated_time"}
                
                if required_columns.issubset(set(df.columns)):
                    for _, row in df.iterrows():
                        device_key = f"{str(row['device_type']).lower()}_{str(row['brand']).lower()}_{str(row['model']).lower()}"
                        
                        if device_key not in inventory:
                            inventory[device_key] = []
                        
                        inventory[device_key].append({
                            "part_name": str(row["part_name"]).strip(),
                            "part_number": str(row["part_number"]).strip(),
                            "compatibility": str(row["compatibility"]).strip(),
                            "average_cost": float(row["average_cost"]),
                            "availability": str(row["availability"]).strip(),
                            "replacement_difficulty": str(row["replacement_difficulty"]).strip(),
                            "estimated_time": int(row["estimated_time"])
                        })
            except Exception as e:
                print(f"Error loading parts inventory: {e}")
        
        return inventory
    
    def load_repair_procedures(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load repair procedures from CSV database"""
        procedures_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "repair_procedures.csv"
        procedures: Dict[str, List[Dict[str, Any]]] = {}
        
        if procedures_path.exists():
            try:
                df = pd.read_csv(procedures_path)
                required_columns = {"device_type", "brand", "model", "procedure_name", 
                                  "difficulty_level", "estimated_time", "required_tools", 
                                  "safety_precautions", "steps"}
                
                if required_columns.issubset(set(df.columns)):
                    for _, row in df.iterrows():
                        device_key = f"{str(row['device_type']).lower()}_{str(row['brand']).lower()}_{str(row['model']).lower()}"
                        
                        if device_key not in procedures:
                            procedures[device_key] = []
                        
                        procedures[device_key].append({
                            "procedure_name": str(row["procedure_name"]).strip(),
                            "difficulty_level": str(row["difficulty_level"]).strip(),
                            "estimated_time": int(row["estimated_time"]),
                            "required_tools": [tool.strip() for tool in str(row["required_tools"]).split(";")],
                            "safety_precautions": [precaution.strip() for precaution in str(row["safety_precautions"]).split(";")],
                            "steps": str(row["steps"]).strip()
                        })
            except Exception as e:
                print(f"Error loading repair procedures: {e}")
        
        return procedures
    
    def _resolve_fault_type(self, diagnosis_id: str) -> str:
        """Interpret diagnosis_id as fault label where possible."""
        if diagnosis_id in self.repair_database:
            return diagnosis_id

        normalized = diagnosis_id.replace("-", " ").replace("_", " ").strip().lower()
        for fault in self.repair_database:
            if fault.lower() == normalized:
                return fault

        for fault in self.repair_database:
            if normalized and normalized in fault.lower():
                return fault

        return next(iter(self.repair_database))
    
    def get_recommendations(self, diagnosis_id: str, device_type: str = None, brand: str = None, model: str = None) -> Dict[str, Any]:
        """Get repair recommendations based on diagnosis with device-specific details"""
        fault_type = self._resolve_fault_type(diagnosis_id)
        
        # Get base repair information
        if fault_type in self.repair_database:
            repair_info = self.repair_database[fault_type]
        else:
            repair_info = {
                "steps": ["Consult professional technician", "Run advanced diagnostics"],
                "tools": ["Diagnostic equipment"],
                "parts": ["To be determined"],
                "time_minutes": 90,
                "skill_level": "Expert",
                "cost_estimate": 200,
                "success_rate": 75,
                "safety_precautions": ["Seek professional help"]
            }
        
        # Get device-specific parts and procedures if provided
        device_parts = []
        device_procedures = []
        parts_cost = 0
        
        if device_type and brand and model:
            device_key = f"{device_type.lower()}_{brand.lower()}_{model.lower()}"
            
            # Get parts inventory
            if device_key in self.parts_inventory:
                device_parts = self.parts_inventory[device_key]
                parts_cost = sum(part["average_cost"] for part in device_parts)
            
            # Get repair procedures
            if device_key in self.repair_procedures:
                device_procedures = self.repair_procedures[device_key]
        
        # Build comprehensive recommendation
        recommendation = {
            "faultType": fault_type,
            "repairProcedure": repair_info["steps"],
            "requiredTools": repair_info["tools"],
            "requiredParts": repair_info["parts"],
            "estimatedTime": repair_info["time_minutes"],
            "estimatedCost": repair_info["cost_estimate"],
            "skillLevel": repair_info["skill_level"],
            "safetyPrecautions": repair_info["safety_precautions"],
            "successRate": repair_info.get("success_rate", 80),
            "alternativeSolutions": [
                "Professional repair service",
                "Device replacement if cost-prohibitive",
                "Warranty claim if applicable"
            ],
            "deviceSpecificParts": device_parts,
            "deviceSpecificProcedures": device_procedures,
            "partsCost": parts_cost,
            "totalEstimatedCost": repair_info["cost_estimate"] + parts_cost
        }
        
        return recommendation
    
    def get_device_parts(self, device_type: str, brand: str, model: str) -> List[Dict[str, Any]]:
        """Get available parts for a specific device"""
        device_key = f"{device_type.lower()}_{brand.lower()}_{model.lower()}"
        return self.parts_inventory.get(device_key, [])
    
    def get_device_procedures(self, device_type: str, brand: str, model: str) -> List[Dict[str, Any]]:
        """Get repair procedures for a specific device"""
        device_key = f"{device_type.lower()}_{brand.lower()}_{model.lower()}"
        return self.repair_procedures.get(device_key, [])