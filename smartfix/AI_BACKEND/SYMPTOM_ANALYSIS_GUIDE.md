# Enhanced Symptom Analysis System

## Overview

The SmartFix AI backend now includes an advanced symptom analysis system that processes user-entered symptoms to provide more accurate fault diagnosis. This system analyzes multiple input formats and extracts meaningful patterns to improve diagnostic accuracy.

## Features

### 1. Multi-Input Symptom Processing
- **Primary Symptoms**: Main symptom description
- **Symptom List**: Structured list of individual symptoms
- **Additional Notes**: Extra context and details

### 2. Symptom Normalization
- Text preprocessing and cleaning
- Common term mapping (e.g., "wont" -> "won't", "wifi" -> "wi-fi")
- Technical term standardization
- Whitespace normalization

### 3. Pattern Recognition
The system identifies key symptom patterns:
- **Power Issues**: Battery, charging, power-related problems
- **Screen Problems**: Display, touch, visual issues
- **Performance**: Speed, lag, freezing, crashes
- **Connectivity**: WiFi, Bluetooth, network problems
- **Audio**: Sound, speaker, microphone issues
- **Input**: Keyboard, mouse, touch, button problems
- **Overheating**: Temperature, fan, heat-related issues
- **Storage**: Memory, disk, space problems
- **Software**: Apps, updates, driver issues
- **Physical Damage**: Drops, water, impact damage

### 4. Severity Assessment
- **High Severity**: Critical issues requiring immediate attention
  - Won't turn on, smoke, burning, water damage
  - Urgent priority required
- **Medium Severity**: Important issues needing soon attention
  - Slow performance, overheating, intermittent problems
  - Soon priority recommended
- **Low Severity**: Minor issues with normal priority
  - Cosmetic issues, minor inconveniences

### 5. Device-Specific Issue Detection
- Battery failure detection
- Screen damage identification
- Motherboard issue recognition
- Overheating pattern detection
- Software conflict identification
- Connectivity problem detection
- Storage failure recognition
- Input device failure detection
- Audio failure detection
- Water damage detection

## API Usage

### Request Format
```json
{
  "deviceType": "laptop",
  "brand": "Dell",
  "model": "XPS 13",
  "symptoms": "My laptop won't turn on, it's completely dead",
  "symptomsList": ["no power", "black screen"],
  "additionalNotes": "I tried charging it overnight but still nothing"
}
```

### Response Format
```json
{
  "primaryFault": "power",
  "confidence": 0.85,
  "alternativeFaults": [...],
  "similarCases": [...],
  "recommendedActions": [...],
  "componentsToCheck": [...],
  "symptomAnalysis": {
    "normalized_symptoms": "my laptop won't turn on, it's completely dead no power black screen i tried charging it overnight but still nothing",
    "symptom_patterns": ["screen_problems", "power_issues"],
    "severity_indicators": {
      "level": "high",
      "urgency": "urgent",
      "indicators": ["won't turn on"]
    },
    "device_issues": ["battery_failure", "screen_damage", "motherboard_issue"],
    "combined_text": "My laptop won't turn on, it's completely dead no power black screen I tried charging it overnight but still nothing"
  }
}
```

## Implementation Details

### Core Methods

#### `analyze_symptoms(symptoms, symptoms_list, additional_notes)`
Main method that orchestrates the symptom analysis process.

#### `_normalize_symptoms(symptoms)`
Preprocesses and normalizes symptom text for better analysis.

#### `_extract_symptom_patterns(symptoms)`
Identifies key symptom patterns using keyword matching.

#### `_identify_severity(symptoms)`
Assesses the severity level based on detected indicators.

#### `_detect_device_issues(symptoms)`
Detects device-specific issues from symptom descriptions.

## Benefits

### 1. Improved Accuracy
- Multiple input sources provide richer context
- Pattern recognition reduces misinterpretation
- Normalization ensures consistent processing

### 2. Better User Experience
- Users can describe symptoms in natural language
- System understands various terminology
- Provides structured feedback on symptoms

### 3. Enhanced Diagnostics
- Severity assessment helps prioritize repairs
- Device-specific detection narrows down issues
- Pattern recognition identifies related problems

### 4. Comprehensive Analysis
- Combines text, lists, and notes effectively
- Provides detailed symptom breakdown
- Offers insights into problem nature

## Testing

The system includes comprehensive test cases covering:
- Power issues
- Screen problems
- Performance issues
- Overheating problems
- Water damage

Run tests with:
```bash
python test_symptom_analysis.py
```

## Future Enhancements

1. **Machine Learning Enhancement**: Train on historical data for better pattern recognition
2. **Multi-language Support**: Extend to other languages
3. **Voice Input**: Process spoken symptom descriptions
4. **Image Integration**: Combine visual analysis with text symptoms
5. **Real-time Analysis**: Provide live symptom analysis as user types

## Integration Notes

The enhanced symptom analysis is fully integrated with:
- Diagnosis API endpoint (`/api/diagnosis`)
- Image analysis endpoint (`/api/diagnosis/with-image`)
- Prediction model for failure forecasting
- Repair recommendation system

This creates a comprehensive diagnostic ecosystem that processes symptoms from multiple angles to provide the most accurate fault detection possible.
