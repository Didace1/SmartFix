// src/features/fault-diagnosis/FaultDiagnosisPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DeviceInfoForm } from './components/DeviceInfoForm';
import { SymptomInput } from './components/SymptomInput';
import { DiagnosisResult } from './components/DiagnosisResult';
import { SimpleFourSecondLoader } from '../../shared/components/Common/SimpleFourSecondLoader';

export const FaultDiagnosisPage = () => {
  const AI_BACKEND_BASE_URL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:5000';
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [repairRecommendations, setRepairRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeviceInfoSubmit = (info) => {
    setDeviceInfo(info);
    setStep(2);
  };

  const handleSymptomsSubmit = async ({ selectedSymptoms, additionalNotes: userNotes }) => {
    const trimmedNotes = userNotes?.trim() || '';
    setSymptoms(selectedSymptoms);
    setAdditionalNotes(userNotes?.trim() || '');

    const loadingStartedAt = Date.now();
    const minLoadingMs = 4000;
    setLoading(true);
    setStep(3);
    setError('');
    setRepairRecommendations(null);

    try {
      const selectedSymptomsText = selectedSymptoms.join(', ').trim();
      const mergedSymptomText = selectedSymptomsText || trimmedNotes;

      const requestPayload = {
        deviceType: deviceInfo?.type?.toLowerCase() || '',
        brand: deviceInfo?.brand || '',
        model: deviceInfo?.model || '',
        symptoms: mergedSymptomText,
        symptomsList: selectedSymptoms,
        additionalNotes: trimmedNotes,
        userName: (user?.fullName || user?.name || '').trim() || null
      };


      const response = await fetch(`${AI_BACKEND_BASE_URL}/api/diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.detail || 'Failed to get diagnosis from AI backend');
      }

      const normalizedConfidence = Number(result?.confidence || 0);
      const confidencePercent = Number.isFinite(normalizedConfidence)
        ? (normalizedConfidence <= 1
          ? Math.round(normalizedConfidence * 100)
          : Math.round(normalizedConfidence))
        : null;

      const normalizedDiagnosis = {
        primaryFault: result?.primaryFault || null,
        faultCode: result?.faultCode || null,
        description: result?.explanation || result?.symptomAnalysis?.clarification_message || null,
        personalizedGreeting: result?.personalizedGreeting || null,
        confidence: confidencePercent,
        possibleCauses: (result?.alternativeFaults || [])
          .map((item) => item?.fault)
          .filter(Boolean),
        affectedComponents: result?.componentsToCheck || [],
        estimatedRepairCost: result?.estimatedRepairCost ?? null,
        estimatedTime: result?.estimatedTime ?? null,
        skillLevel: result?.technicianLevel || result?.skillLevel || null,
        similarCases: result?.similarCases || [],
        recommendedActions: result?.recommendedActions || [],
        requiresClarification: result?.symptomAnalysis?.requires_clarification || false,
        clarificationMessage: result?.symptomAnalysis?.clarification_message || null
      };

      setDiagnosis(normalizedDiagnosis);

      const repairResponse = await fetch(
        `${AI_BACKEND_BASE_URL}/api/repair/recommendations/${encodeURIComponent(result?.primaryFault || '')}`
      );
      if (repairResponse.ok) {
        const repairData = await repairResponse.json();
        setRepairRecommendations(repairData);
      }
    } catch (apiError) {
      setError(apiError.message || 'Unable to diagnose issue right now.');
      setDiagnosis(null);
      setRepairRecommendations(null);
    } finally {
      const elapsed = Date.now() - loadingStartedAt;
      const remaining = minLoadingMs - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };

  const handleGenerateReport = () => {
    const report = {
      deviceInfo,
      symptoms,
      additionalNotes,
      diagnosis,
      repairRecommendations,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnosis_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAskFollowUp = async (followUpQuestion) => {
    const followUpText = followUpQuestion?.trim() || '';
    if (!followUpText) return 'Please describe what is still not working.';

    const response = await fetch(`${AI_BACKEND_BASE_URL}/api/diagnosis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deviceType: deviceInfo?.type?.toLowerCase() || '',
        brand: deviceInfo?.brand || '',
        model: deviceInfo?.model || '',
        symptoms: followUpText,
        symptomsList: [],
        additionalNotes: '',
        userName: (user?.fullName || user?.name || '').trim() || null
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.detail || 'Failed to get follow-up response from AI backend');
    }

    const reply = result?.personalizedGreeting || result?.explanation || result?.primaryFault || 'AI returned no follow-up details.';

    return reply;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Fault Diagnosis</h1>
          <p className="text-gray-600 mt-2">Enter device information and symptoms for intelligent diagnosis</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Device Info', 'Symptoms', 'Results'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-green-500 text-white' :
                  step === index + 1 ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 ${step === index + 1 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  {label}
                </span>
                {index < 2 && <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && <DeviceInfoForm onDeviceInfoSubmit={handleDeviceInfoSubmit} />}
          {step === 2 && <SymptomInput onSubmit={handleSymptomsSubmit} />}
          {step === 3 && (
            loading ? (
              <div className="py-12">
                <SimpleFourSecondLoader 
                  message="AI is analyzing symptoms..." 
                />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 font-medium">{error}</p>
                <p className="text-gray-600 mt-2">Please make sure AI backend is running and try again.</p>
              </div>
            ) : (
              diagnosis && (
                <DiagnosisResult
                  diagnosis={diagnosis}
                  repairRecommendations={repairRecommendations}
                  onGenerateReport={handleGenerateReport}
                  onAskFollowUp={handleAskFollowUp}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};