"""
Comprehensive Training Data Generator for SmartFix AI
Generates realistic, device-specific fault scenarios with accurate diagnostics
"""

import pandas as pd
import random
from pathlib import Path
from typing import List, Dict, Tuple

class TrainingDataGenerator:
    def __init__(self):
        # Load device specifications
        self.device_specs_path = Path(__file__).resolve().parents[1] / "data" / "raw" / "device_specifications.csv"
        self.device_specs = pd.read_csv(self.device_specs_path)
        
        # Define comprehensive fault categories with realistic symptoms
        self.fault_categories = {
            # Power-related issues
            "Power supply failure": {
                "symptoms": [
                    "won't turn on no power black screen",
                    "completely dead not responding to power button",
                    "no lights no signs of life",
                    "power button not working device dead",
                    "tried charging overnight still won't turn on"
                ],
                "components": {
                    "laptop": ["Power adapter", "Battery", "Motherboard", "Power jack", "DC-in board"],
                    "smartphone": ["Battery", "Charging port", "Logic board", "Power IC"],
                    "tablet": ["Battery", "Charging port", "Logic board", "Power management IC"],
                    "smartwatch": ["Battery", "Charging contacts", "Power IC"],
                    "smarttv": ["Power supply board", "Main board", "Power cable"],
                    "headphones": ["Battery", "Charging port", "Power circuit"],
                    "iot": ["Power adapter", "Power circuit", "Main board"]
                },
                "repair_time": 60,
                "success_rate": 90.0,
                "skill_level": "Intermediate"
            },
            
            "Battery failure": {
                "symptoms": [
                    "dead battery not charging",
                    "battery drains very fast only lasts 30 minutes",
                    "charging but percentage not increasing",
                    "battery swollen device bulging",
                    "shows charging but battery percentage drops"
                ],
                "components": {
                    "laptop": ["Battery", "Charging port", "Battery connector"],
                    "smartphone": ["Battery", "Charging port", "Charging IC"],
                    "tablet": ["Battery", "Charging port", "Battery management IC"],
                    "smartwatch": ["Battery", "Charging contacts"],
                    "headphones": ["Battery", "Charging case battery"],
                    "iot": ["Internal battery", "Charging circuit"]
                },
                "repair_time": 45,
                "success_rate": 95.0,
                "skill_level": "Beginner"
            },
            
            # Display issues
            "Screen damage": {
                "symptoms": [
                    "screen cracked broken display",
                    "display shattered touch not working",
                    "black spots on screen after drop",
                    "screen flickering lines across display",
                    "half screen not working after fall"
                ],
                "components": {
                    "laptop": ["Display", "LCD panel", "Touch digitizer", "Display cable"],
                    "smartphone": ["Display", "Touch screen", "Digitizer", "OLED panel"],
                    "tablet": ["Display", "Touch screen", "LCD assembly"],
                    "smartwatch": ["Display", "Touch screen", "Glass cover"],
                    "smarttv": ["Display panel", "T-CON board", "LED backlight"],
                    "iot": ["Display", "Touch panel"]
                },
                "repair_time": 75,
                "success_rate": 95.0,
                "skill_level": "Advanced"
            },
            
            "Display malfunction": {
                "symptoms": [
                    "screen stays black but device is on",
                    "display very dim can barely see anything",
                    "screen flickers when moving lid",
                    "vertical lines on display",
                    "screen goes black randomly"
                ],
                "components": {
                    "laptop": ["Display cable", "LCD panel", "Inverter board", "Backlight"],
                    "smartphone": ["Display connector", "Display IC", "Flex cable"],
                    "tablet": ["Display connector", "LCD controller"],
                    "smartwatch": ["Display connector", "Display driver"],
                    "smarttv": ["T-CON board", "Main board", "Display panel"],
                    "iot": ["Display module", "Display driver"]
                },
                "repair_time": 60,
                "success_rate": 85.0,
                "skill_level": "Intermediate"
            },
            
            # Performance issues
            "Software issue": {
                "symptoms": [
                    "slow performance lag freezing",
                    "apps crash constantly won't stay open",
                    "system freezes need to force restart",
                    "very slow takes forever to open anything",
                    "keeps restarting on its own"
                ],
                "components": {
                    "laptop": ["RAM", "SSD", "Operating system", "Drivers"],
                    "smartphone": ["RAM", "Storage", "Operating system", "System apps"],
                    "tablet": ["RAM", "Storage", "Operating system"],
                    "smartwatch": ["Storage", "Operating system", "Watch OS"],
                    "smarttv": ["RAM", "Flash storage", "Smart TV OS"],
                    "headphones": ["Firmware", "Bluetooth module"],
                    "iot": ["Firmware", "Operating system"]
                },
                "repair_time": 90,
                "success_rate": 85.0,
                "skill_level": "Intermediate"
            },
            
            # Cooling issues
            "Cooling system failure": {
                "symptoms": [
                    "overheating fan loud hot",
                    "device gets extremely hot can't touch it",
                    "fan running at full speed very noisy",
                    "shuts down due to overheating",
                    "bottom gets burning hot during use"
                ],
                "components": {
                    "laptop": ["Fan", "Heat sink", "Thermal paste", "Cooling system"],
                    "smartphone": ["Thermal sensor", "Processor", "Battery"],
                    "tablet": ["Thermal management", "Processor"],
                    "smartwatch": ["Processor", "Battery"],
                    "smarttv": ["Cooling fan", "Heat sink", "Processor"],
                    "iot": ["Processor", "Power circuit"]
                },
                "repair_time": 60,
                "success_rate": 88.0,
                "skill_level": "Intermediate"
            },
            
            # Connectivity issues
            "Network failure": {
                "symptoms": [
                    "wifi not connecting no internet",
                    "bluetooth won't turn on greyed out",
                    "wifi keeps disconnecting every few minutes",
                    "can't find any wifi networks",
                    "network adapter not detected"
                ],
                "components": {
                    "laptop": ["Wifi card", "Network drivers", "Antenna", "Bluetooth module"],
                    "smartphone": ["Wifi chip", "Antenna", "Network IC"],
                    "tablet": ["Wifi module", "Antenna"],
                    "smartwatch": ["Wifi chip", "Bluetooth module"],
                    "smarttv": ["WiFi module", "Network card"],
                    "headphones": ["Bluetooth module", "Antenna"],
                    "iot": ["WiFi module", "Network chip"]
                },
                "repair_time": 30,
                "success_rate": 92.0,
                "skill_level": "Beginner"
            },
            
            # Input device issues
            "Keyboard failure": {
                "symptoms": [
                    "keyboard not working some keys",
                    "several keys don't respond when pressed",
                    "keyboard types wrong characters",
                    "spacebar and enter key not working",
                    "liquid spilled on keyboard not working"
                ],
                "components": {
                    "laptop": ["Keyboard", "Ribbon cable", "Keyboard controller"],
                    "tablet": ["On-screen keyboard", "Touch digitizer"]
                },
                "repair_time": 45,
                "success_rate": 90.0,
                "skill_level": "Intermediate"
            },
            
            "Touch failure": {
                "symptoms": [
                    "touch screen not working",
                    "touch not responding after screen replacement",
                    "ghost touches screen taps by itself",
                    "touch works only in some areas",
                    "multitouch not working"
                ],
                "components": {
                    "smartphone": ["Digitizer", "Touch IC", "Display connector"],
                    "tablet": ["Touch digitizer", "Touch controller"],
                    "smartwatch": ["Touch screen", "Touch sensor"]
                },
                "repair_time": 45,
                "success_rate": 82.0,
                "skill_level": "Intermediate"
            },
            
            # Audio issues
            "Audio failure": {
                "symptoms": [
                    "no sound speaker audio issue",
                    "speakers crackling distorted sound",
                    "microphone not working during calls",
                    "audio only works with headphones",
                    "one speaker not working"
                ],
                "components": {
                    "laptop": ["Speakers", "Audio jack", "Audio drivers", "Sound card"],
                    "smartphone": ["Speakers", "Microphone", "Audio IC"],
                    "tablet": ["Speakers", "Audio board"],
                    "smartwatch": ["Speaker", "Microphone"],
                    "smarttv": ["Speakers", "Audio board", "Audio processor"],
                    "headphones": ["Drivers", "Audio cable", "Bluetooth module"],
                    "iot": ["Speaker array", "Microphone array"]
                },
                "repair_time": 30,
                "success_rate": 85.0,
                "skill_level": "Beginner"
            },
            
            # Port issues
            "USB failure": {
                "symptoms": [
                    "usb ports not working",
                    "usb devices not recognized",
                    "charging port loose not connecting properly",
                    "usb port physically damaged",
                    "some usb ports work others don't"
                ],
                "components": {
                    "laptop": ["USB ports", "Motherboard", "USB controller"],
                    "smartphone": ["USB-C port", "Charging port", "Port connector"],
                    "tablet": ["USB port", "Charging port"],
                    "smarttv": ["USB ports", "Main board"]
                },
                "repair_time": 45,
                "success_rate": 87.0,
                "skill_level": "Intermediate"
            },
            
            # Camera issues
            "Camera failure": {
                "symptoms": [
                    "camera not working",
                    "camera shows black screen",
                    "camera blurry won't focus",
                    "front camera works but rear camera doesn't",
                    "camera app crashes when opened"
                ],
                "components": {
                    "laptop": ["Webcam", "Camera cable", "Camera drivers"],
                    "smartphone": ["Camera module", "Lens", "Camera connector", "Camera IC"],
                    "tablet": ["Camera module", "Camera software"],
                    "smartwatch": ["Camera module"]
                },
                "repair_time": 45,
                "success_rate": 87.0,
                "skill_level": "Intermediate"
            },
            
            # Storage issues
            "Storage failure": {
                "symptoms": [
                    "hard drive not detected",
                    "storage full can't save anything",
                    "ssd failed system won't boot",
                    "corrupted storage data loss",
                    "disk errors constant warnings"
                ],
                "components": {
                    "laptop": ["SSD", "HDD", "Storage controller", "SATA cable"],
                    "smartphone": ["NAND storage", "Storage IC"],
                    "tablet": ["Internal storage", "Storage controller"],
                    "smartwatch": ["Internal storage"],
                    "smarttv": ["Flash storage", "Storage module"]
                },
                "repair_time": 75,
                "success_rate": 70.0,
                "skill_level": "Advanced"
            },
            
            # Physical damage
            "Water damage": {
                "symptoms": [
                    "dropped in water won't turn on",
                    "liquid damage corrosion visible",
                    "water indicator triggered device wet",
                    "coffee spilled on device not working",
                    "moisture inside screen foggy display"
                ],
                "components": {
                    "laptop": ["Motherboard", "Keyboard", "Battery", "Display"],
                    "smartphone": ["Logic board", "Battery", "Display", "Charging port"],
                    "tablet": ["Logic board", "Battery", "Display"],
                    "smartwatch": ["Main board", "Battery", "Display"],
                    "headphones": ["Circuit board", "Drivers", "Battery"]
                },
                "repair_time": 120,
                "success_rate": 60.0,
                "skill_level": "Expert"
            },
            
            "Physical damage": {
                "symptoms": [
                    "dropped device cracked case",
                    "bent frame after sitting on it",
                    "buttons physically broken",
                    "housing cracked from impact",
                    "device dented from fall"
                ],
                "components": {
                    "laptop": ["Chassis", "Hinges", "Case", "Frame"],
                    "smartphone": ["Back glass", "Frame", "Housing"],
                    "tablet": ["Housing", "Frame", "Back panel"],
                    "smartwatch": ["Case", "Housing", "Glass"],
                    "headphones": ["Headband", "Ear cushions", "Housing"]
                },
                "repair_time": 60,
                "success_rate": 80.0,
                "skill_level": "Intermediate"
            },
            
            # Motherboard/Logic board issues
            "Motherboard failure": {
                "symptoms": [
                    "device powers on but no display",
                    "random shutdowns motherboard issue",
                    "short circuit smell burning",
                    "no boot beep codes",
                    "device turns on for few seconds then dies"
                ],
                "components": {
                    "laptop": ["Motherboard", "CPU", "GPU", "Chipset"],
                    "smartphone": ["Logic board", "Processor", "Power IC"],
                    "tablet": ["Logic board", "Processor"],
                    "smartwatch": ["Main board", "Processor"],
                    "smarttv": ["Main board", "Processor"],
                    "iot": ["Main board", "Processor"]
                },
                "repair_time": 150,
                "success_rate": 65.0,
                "skill_level": "Expert"
            },
            
            # Sensor issues
            "Sensor failure": {
                "symptoms": [
                    "screen rotation not working",
                    "proximity sensor not working screen stays on",
                    "fingerprint sensor not recognizing",
                    "face id not working",
                    "heart rate sensor not detecting"
                ],
                "components": {
                    "smartphone": ["Proximity sensor", "Accelerometer", "Gyroscope", "Fingerprint sensor"],
                    "tablet": ["Accelerometer", "Gyroscope", "Ambient light sensor"],
                    "smartwatch": ["Heart rate sensor", "Blood oxygen sensor", "Accelerometer", "Gyroscope"],
                    "iot": ["Motion sensor", "Temperature sensor", "Ambient light sensor"]
                },
                "repair_time": 45,
                "success_rate": 75.0,
                "skill_level": "Advanced"
            }
        }
    
    def generate_training_data(self, samples_per_device: int = 15) -> pd.DataFrame:
        """Generate comprehensive training data for all devices"""
        
        training_records = []
        
        for _, device in self.device_specs.iterrows():
            device_type = device['device_type']
            brand = device['brand']
            model = device['model']
            
            # Get applicable faults for this device type
            applicable_faults = self._get_applicable_faults(device_type)
            
            # Generate samples for each applicable fault
            for fault_name, fault_info in applicable_faults.items():
                # Get device-specific components
                components = fault_info['components'].get(device_type, fault_info['components'].get('laptop', []))
                
                # Generate multiple symptom variations
                num_samples = min(len(fault_info['symptoms']), samples_per_device)
                for i in range(num_samples):
                    symptom = fault_info['symptoms'][i % len(fault_info['symptoms'])]
                    
                    # Add some variation to repair time and success rate
                    repair_time = fault_info['repair_time'] + random.randint(-10, 10)
                    success_rate = min(100.0, max(50.0, fault_info['success_rate'] + random.uniform(-5, 5)))
                    
                    record = {
                        'device_type': device_type,
                        'brand': brand,
                        'model': model,
                        'symptom_text': symptom,
                        'diagnosis': fault_name,
                        'components': ';'.join(components[:4]),  # Limit to top 4 components
                        'repair_time': repair_time,
                        'success_rate': round(success_rate, 1),
                        'technician_level': fault_info['skill_level']
                    }
                    
                    training_records.append(record)
        
        df = pd.DataFrame(training_records)
        return df
    
    def _get_applicable_faults(self, device_type: str) -> Dict:
        """Get faults applicable to specific device type"""
        applicable = {}
        
        for fault_name, fault_info in self.fault_categories.items():
            if device_type in fault_info['components']:
                applicable[fault_name] = fault_info
        
        return applicable
    
    def save_training_data(self, output_path: str = None):
        """Generate and save comprehensive training data"""
        
        if output_path is None:
            output_path = Path(__file__).resolve().parents[1] / "data" / "raw" / "comprehensive_training_data_v2.csv"
        
        print("Generating comprehensive training data...")
        df = self.generate_training_data(samples_per_device=15)
        
        print(f"Generated {len(df)} training samples")
        print(f"Device types: {df['device_type'].unique()}")
        print(f"Unique brands: {df['brand'].nunique()}")
        print(f"Unique models: {df['model'].nunique()}")
        print(f"Fault categories: {df['diagnosis'].nunique()}")
        
        # Save to CSV
        df.to_csv(output_path, index=False)
        print(f"\nTraining data saved to: {output_path}")
        
        # Print statistics
        print("\n=== Training Data Statistics ===")
        print(f"Total samples: {len(df)}")
        print(f"\nSamples per device type:")
        print(df['device_type'].value_counts())
        print(f"\nSamples per fault category:")
        print(df['diagnosis'].value_counts())
        
        return df

if __name__ == "__main__":
    generator = TrainingDataGenerator()
    df = generator.save_training_data()
