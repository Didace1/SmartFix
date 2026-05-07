// src/features/fault-diagnosis/FaultDiagnosisPage.jsx
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [symptomError, setSymptomError] = useState('');
  const [sessionId, setSessionId] = useState(null); // Track conversation session

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
    setSymptomError('');
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
        userName: (user?.fullName || user?.name || '').trim() || null,
        sessionId: sessionId // Include session ID for conversation context
      };

      const response = await fetch(`${AI_BACKEND_BASE_URL}/api/diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const result = await response.json();

      if (response.status === 422) {
        const detail = result?.detail;
        const msg = (typeof detail === 'object' ? detail?.message : detail)
          || 'Your description is unclear. Please describe the fault in plain words.';
        setSymptomError(msg);
        setStep(2);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result?.detail || 'Failed to get diagnosis from AI backend');
      }

      const normalizedDiagnosis = {
        primaryFault: result?.primaryFault || null,
        confidence: result?.confidence || 0,
        personalizedGreeting: result?.personalizedGreeting || null,
        reportedSymptoms: result?.reportedSymptoms || mergedSymptomText,
        possibleCauses: (result?.alternativeFaults || [])
          .map((item) => item?.fault)
          .filter(Boolean),
        alternativeFaults: result?.alternativeFaults || [],
        affectedComponents: result?.componentsToCheck || [],
        recommendedActions: result?.recommendedActions || [],
        severityLevel: result?.symptomAnalysis?.severity_indicators?.level || 'unknown',
        urgency: result?.symptomAnalysis?.severity_indicators?.urgency || 'normal',
        requiresClarification: result?.symptomAnalysis?.requires_clarification || false,
        clarificationMessage: result?.symptomAnalysis?.clarification_message || null,
        isFollowUp: result?.isFollowUp || false
      };

      // Store session ID for future requests
      if (result?.sessionId) {
        setSessionId(result.sessionId);
      }

      setDiagnosis(normalizedDiagnosis);

      const repairResponse = await fetch(
        `${AI_BACKEND_BASE_URL}/api/repair/recommendations/${encodeURIComponent(result?.primaryFault || '')}`
      );
      if (repairResponse.ok) {
        const repairData = await repairResponse.json();
        setRepairRecommendations(repairData);
      }
    } catch (apiError) {
      setStep(3);
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

  const handleNewDiagnosis = () => {
    // Reset session and start over
    setSessionId(null);
    setStep(1);
    setDeviceInfo(null);
    setSymptoms([]);
    setAdditionalNotes('');
    setDiagnosis(null);
    setRepairRecommendations(null);
    setError('');
    setSymptomError('');
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = 20;

    const addLine = (extra = 4) => { y += extra; };
    const checkPage = (needed = 15) => {
      if (y + needed > 275) { doc.addPage(); y = 20; }
    };

    // ── Header banner ──
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Corex Ltd — AI Diagnosis Report', margin, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 20);
    doc.text('Powered by SmartFix AI', pageW - margin, 20, { align: 'right' });
    y = 36;
    doc.setTextColor(0, 0, 0);

    // ── Section helper ──
    const sectionTitle = (title) => {
      checkPage(14);
      doc.setFillColor(230, 238, 255);
      doc.rect(margin, y, contentW, 8, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(title, margin + 2, y + 5.5);
      doc.setTextColor(0, 0, 0);
      y += 11;
    };

    const labelValue = (label, value) => {
      checkPage(8);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin + 2, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(String(value || 'N/A'), contentW - 40);
      doc.text(lines, margin + 38, y);
      y += lines.length * 5 + 2;
    };

    const bulletList = (items = []) => {
      items.filter(Boolean).forEach((item) => {
        checkPage(7);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(`• ${item}`, contentW - 8);
        doc.text(lines, margin + 4, y);
        y += lines.length * 5 + 1;
      });
    };

    // ── 1. Device Information ──
    sectionTitle('1. Device Information');
    labelValue('Device Type', deviceInfo?.type);
    labelValue('Brand', deviceInfo?.brand);
    labelValue('Model', deviceInfo?.model);
    addLine(3);

    // ── 2. Reported Symptoms ──
    sectionTitle('2. Reported Symptoms');
    labelValue('Symptoms', diagnosis?.reportedSymptoms);
    addLine(3);

    // ── 3. Primary Diagnosis ──
    sectionTitle('3. Primary Diagnosis');
    labelValue('Primary Fault', diagnosis?.primaryFault);
    labelValue('Confidence', `${Math.round((diagnosis?.confidence || 0) * 100)}%`);
    labelValue('Severity Level', diagnosis?.severityLevel || 'Unknown');
    labelValue('Urgency', diagnosis?.urgency || 'Normal');
    addLine(3);

    // ── 4. Component Failure Prediction ──
    sectionTitle('4. Component Failure Prediction');
    const components = (diagnosis?.affectedComponents || []).filter(Boolean);
    if (components.length > 0) {
      doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.text('Components at Risk:', margin + 2, y); y += 6;
      bulletList(components);
    }
    const altFaults = (diagnosis?.alternativeFaults || []).filter(f => f?.fault);
    if (altFaults.length > 0) {
      checkPage(8);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.text('Other Possible Faults:', margin + 2, y); y += 5;
      autoTable(doc, {
        startY: y,
        margin: { left: margin + 2, right: margin },
        head: [['Fault', 'Probability']],
        body: altFaults.slice(0, 5).map(f => [
          f.fault, `${Math.round((f.probability || 0) * 100)}%`
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 255] },
      });
      y = doc.lastAutoTable.finalY + 4;
    }
    addLine(3);

    // ── 5. Recommended Actions ──
    sectionTitle('5. Recommended Actions');
    bulletList(diagnosis?.recommendedActions || []);
    addLine(3);

    // ── 6. Repair Recommendation ──
    sectionTitle('6. Repair Recommendation');
    const rec = repairRecommendations;
    if (rec) {
      labelValue('Fault Type', rec.faultType);
      labelValue('Estimated Time', rec.estimatedTime ? `${rec.estimatedTime} min` : 'N/A');
      labelValue('Estimated Cost', rec.estimatedCost ? `$${rec.estimatedCost}` : 'N/A');
      labelValue('Success Rate', rec.successRate ? `${rec.successRate}%` : 'N/A');
      labelValue('Skill Level', rec.skillLevel);
      addLine(2);
      if ((rec.repairProcedure || []).filter(Boolean).length > 0) {
        checkPage(8);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold');
        doc.text('Repair Procedure:', margin + 2, y); y += 6;
        rec.repairProcedure.filter(Boolean).forEach((step, i) => {
          checkPage(7);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
          const lines = doc.splitTextToSize(`${i + 1}. ${step}`, contentW - 8);
          doc.text(lines, margin + 4, y);
          y += lines.length * 5 + 1;
        });
        addLine(2);
      }
      if ((rec.requiredTools || []).filter(Boolean).length > 0) {
        checkPage(8);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold');
        doc.text('Required Tools:', margin + 2, y); y += 6;
        bulletList(rec.requiredTools);
        addLine(2);
      }
      if ((rec.requiredParts || []).filter(Boolean).length > 0) {
        checkPage(8);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold');
        doc.text('Spare Parts Needed:', margin + 2, y); y += 6;
        bulletList(rec.requiredParts);
        addLine(2);
      }
      if ((rec.safetyPrecautions || []).filter(Boolean).length > 0) {
        checkPage(8);
        doc.setFillColor(255, 240, 240);
        doc.rect(margin, y - 2, contentW, 7, 'F');
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(180, 30, 30);
        doc.text('Safety Precautions:', margin + 2, y + 3.5);
        doc.setTextColor(0, 0, 0);
        y += 9;
        bulletList(rec.safetyPrecautions);
      }
    } else {
      doc.setFontSize(9); doc.setFont('helvetica', 'italic');
      doc.text('Repair recommendations not available.', margin + 2, y);
      y += 6;
    }

    // ── Footer on every page ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(150);
      doc.text('Corex Ltd — SmartFix AI Diagnosis Report', margin, 290);
      doc.text(`Page ${i} of ${totalPages}`, pageW - margin, 290, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    }

    const filename = `SmartFix_Diagnosis_${(diagnosis?.primaryFault || 'Report').replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(filename);
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
        userName: (user?.fullName || user?.name || '').trim() || null,
        sessionId: sessionId // Include session ID for follow-up context
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.detail || 'Failed to get follow-up response from AI backend');
    }

    // Update session ID if returned
    if (result?.sessionId) {
      setSessionId(result.sessionId);
    }

    const fault = result?.primaryFault || 'Unknown fault';
    const actions = (result?.recommendedActions || []).filter(Boolean);
    const components = (result?.componentsToCheck || []).filter(Boolean);
    const isFollowUp = result?.isFollowUp || false;

    const parts = [];
    if (isFollowUp) {
      parts.push(`Since the previous solution didn't work, let's try: ${fault}.`);
    } else {
      parts.push(`Based on your follow-up, the most likely fault is: ${fault}.`);
    }

    if (actions.length > 0) {
      parts.push('\nRecommended actions:');
      actions.forEach((a) => parts.push(`- ${a}`));
    }

    if (components.length > 0) {
      parts.push('\nComponents to check:');
      components.forEach((c) => parts.push(`- ${c}`));
    }

    return parts.join('\n');
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
                  {step > index + 1 ? '\u2713' : index + 1}
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
          {step === 2 && <SymptomInput onSubmit={handleSymptomsSubmit} serverError={symptomError} />}
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
                  onNewDiagnosis={handleNewDiagnosis}
                  deviceInfo={deviceInfo}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};
