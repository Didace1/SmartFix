"""
Comprehensive AI Testing Script
Tests the retrained AI with real-world scenarios across all device types
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))

from app.models.diagnosis_model import FaultDiagnosisAI

def print_diagnosis_result(device_info, result):
    """Pretty print diagnosis results"""
    print("\n" + "="*70)
    print(f"Device: {device_info['brand']} {device_info['model']} ({device_info['type']})")
    print(f"Symptoms: {device_info['symptoms']}")
    print("-"*70)
    print(f"Primary Diagnosis: {result['primaryFault']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print(f"\nComponents to Check:")
    for component in result['componentsToCheck'][:5]:
        print(f"  - {component}")
    print(f"\nRecommended Actions:")
    for action in result['recommendedActions'][:3]:
        print(f"  - {action}")
    
    if result.get('alternativeFaults'):
        print(f"\nAlternative Diagnoses:")
        for alt in result['alternativeFaults'][:3]:
            print(f"  - {alt['fault']} ({alt['probability']:.1%})")
    print("="*70)

def test_laptops():
    """Test laptop diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING LAPTOPS")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'laptop',
            'brand': 'Dell',
            'model': 'XPS 15',
            'symptoms': 'laptop won\'t turn on at all, tried everything, completely dead'
        },
        {
            'type': 'laptop',
            'brand': 'HP',
            'model': 'Spectre',
            'symptoms': 'screen is cracked and half of it is black, touch not working'
        },
        {
            'type': 'laptop',
            'brand': 'Lenovo',
            'model': 'ThinkPad',
            'symptoms': 'very slow, takes forever to open programs, keeps freezing'
        },
        {
            'type': 'laptop',
            'brand': 'Apple',
            'model': 'MacBook Pro',
            'symptoms': 'gets extremely hot, fan is very loud, shuts down randomly'
        },
        {
            'type': 'laptop',
            'brand': 'Asus',
            'model': 'ROG Zephyrus',
            'symptoms': 'keyboard keys not working, spilled coffee on it yesterday'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_smartphones():
    """Test smartphone diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING SMARTPHONES")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'smartphone',
            'brand': 'Apple',
            'model': 'iPhone 14',
            'symptoms': 'battery drains super fast, only lasts 2 hours, need to charge constantly'
        },
        {
            'type': 'smartphone',
            'brand': 'Samsung',
            'model': 'Galaxy S21',
            'symptoms': 'dropped it and screen is completely shattered, touch doesn\'t work'
        },
        {
            'type': 'smartphone',
            'brand': 'Google',
            'model': 'Pixel 6',
            'symptoms': 'wifi won\'t connect, can\'t find any networks, bluetooth also not working'
        },
        {
            'type': 'smartphone',
            'brand': 'OnePlus',
            'model': '9 Pro',
            'symptoms': 'camera is blurry, won\'t focus properly, rear camera not working'
        },
        {
            'type': 'smartphone',
            'brand': 'Xiaomi',
            'model': 'Note 10',
            'symptoms': 'dropped in water, won\'t turn on, moisture inside screen'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_tablets():
    """Test tablet diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING TABLETS")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'tablet',
            'brand': 'Apple',
            'model': 'iPad Pro',
            'symptoms': 'touch screen not responding, ghost touches, taps by itself'
        },
        {
            'type': 'tablet',
            'brand': 'Samsung',
            'model': 'Galaxy Tab S8',
            'symptoms': 'no sound from speakers, audio only works with headphones'
        },
        {
            'type': 'tablet',
            'brand': 'Microsoft',
            'model': 'Surface Pro 9',
            'symptoms': 'usb ports not working, can\'t connect keyboard or mouse'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_smartwatches():
    """Test smartwatch diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING SMARTWATCHES")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'smartwatch',
            'brand': 'Apple',
            'model': 'Watch Series 8',
            'symptoms': 'battery dies in 3 hours, used to last all day'
        },
        {
            'type': 'smartwatch',
            'brand': 'Samsung',
            'model': 'Galaxy Watch 5',
            'symptoms': 'screen cracked after fall, touch not working properly'
        },
        {
            'type': 'smartwatch',
            'brand': 'Garmin',
            'model': 'Fenix 7',
            'symptoms': 'heart rate sensor not working, no readings'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_smart_tvs():
    """Test smart TV diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING SMART TVs")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'smarttv',
            'brand': 'Samsung',
            'model': 'QN90B',
            'symptoms': 'won\'t turn on, no power light, completely dead'
        },
        {
            'type': 'smarttv',
            'brand': 'LG',
            'model': 'OLED C1',
            'symptoms': 'no sound from speakers, picture is fine but audio not working'
        },
        {
            'type': 'smarttv',
            'brand': 'Sony',
            'model': 'X95K',
            'symptoms': 'wifi not connecting, can\'t access smart features'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_headphones():
    """Test headphones diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING HEADPHONES")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'headphones',
            'brand': 'Sony',
            'model': 'WH-1000XM4',
            'symptoms': 'battery dies quickly, only lasts 2 hours instead of 30'
        },
        {
            'type': 'headphones',
            'brand': 'Apple',
            'model': 'AirPods Pro',
            'symptoms': 'no sound from left earbud, right one works fine'
        },
        {
            'type': 'headphones',
            'brand': 'Bose',
            'model': 'QC35',
            'symptoms': 'bluetooth won\'t connect, can\'t pair with phone'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_iot_devices():
    """Test IoT device diagnostics"""
    print("\n" + "#"*70)
    print("# TESTING IoT DEVICES")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'iot',
            'brand': 'Amazon',
            'model': 'Echo Dot',
            'symptoms': 'microphone not working, alexa can\'t hear me'
        },
        {
            'type': 'iot',
            'brand': 'Google',
            'model': 'Nest Hub',
            'symptoms': 'wifi keeps disconnecting, can\'t stay connected'
        },
        {
            'type': 'iot',
            'brand': 'Apple',
            'model': 'HomePod',
            'symptoms': 'speaker crackling, distorted sound at high volume'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def test_complex_scenarios():
    """Test complex multi-symptom scenarios"""
    print("\n" + "#"*70)
    print("# TESTING COMPLEX SCENARIOS")
    print("#"*70)
    
    ai = FaultDiagnosisAI()
    
    test_cases = [
        {
            'type': 'laptop',
            'brand': 'Dell',
            'model': 'XPS 13',
            'symptoms': 'laptop overheating and fan very loud, also battery drains fast and performance is slow'
        },
        {
            'type': 'smartphone',
            'brand': 'Apple',
            'model': 'iPhone 12',
            'symptoms': 'dropped in toilet, screen has water damage, won\'t charge, moisture detected'
        },
        {
            'type': 'tablet',
            'brand': 'Samsung',
            'model': 'Galaxy Tab A9',
            'symptoms': 'fell from table, screen cracked, touch not working, also wifi stopped working'
        }
    ]
    
    for test in test_cases:
        result = ai.predict(
            device_type=test['type'],
            brand=test['brand'],
            model=test['model'],
            symptoms=test['symptoms']
        )
        print_diagnosis_result(test, result)

def run_all_tests():
    """Run all test suites"""
    print("\n" + "="*70)
    print("SMARTFIX AI COMPREHENSIVE TESTING")
    print("Testing AI with real-world scenarios across all device types")
    print("="*70)
    
    test_laptops()
    test_smartphones()
    test_tablets()
    test_smartwatches()
    test_smart_tvs()
    test_headphones()
    test_iot_devices()
    test_complex_scenarios()
    
    print("\n" + "="*70)
    print("ALL TESTS COMPLETED")
    print("="*70)

if __name__ == "__main__":
    run_all_tests()
