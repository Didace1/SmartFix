// src/features/fault-diagnosis/components/SymptomInput.jsx
import React, { useState } from 'react';

export const SymptomInput = ({ onSubmit }) => {
  const [symptomText, setSymptomText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const commonSymptoms = {
    'No Power': 'Device does not turn on or respond to power button',
    'Overheating': 'Device gets unusually hot during normal use',
    'Slow Performance': 'Device runs slowly, lags, or freezes frequently',
    'Screen Issues': 'Display problems, flickering, dead pixels, or cracks',
    'Battery Drain': 'Battery discharges quickly or doesn\'t hold charge',
    'No Sound': 'No audio output from speakers or headphone jack',
    'Connectivity': 'WiFi, Bluetooth, or other connection problems',
    'Blue Screen': 'System crashes with blue screen error'
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const additionalNotes = symptomText.trim();
    const allSymptoms = [...selectedSymptoms];
    if (additionalNotes) {
      allSymptoms.push(additionalNotes);
    }
    if (allSymptoms.length > 0) {
      onSubmit({
        selectedSymptoms,
        additionalNotes
      });
    } else {
      alert('Please select or describe at least one symptom');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Common Symptoms
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(commonSymptoms).map(([symptom, description]) => (
            <button
              key={symptom}
              type="button"
              onClick={() => handleSymptomToggle(symptom)}
              className={`p-3 text-left rounded-lg border transition-all ${
                selectedSymptoms.includes(symptom)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{symptom}</div>
              <div className="text-xs text-gray-500 mt-1">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            Selected: {selectedSymptoms.join(', ')}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe Additional Symptoms
        </label>
        <textarea
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          placeholder="Describe any additional issues or details..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Analyze Symptoms →
      </button>
    </form>
  );
};