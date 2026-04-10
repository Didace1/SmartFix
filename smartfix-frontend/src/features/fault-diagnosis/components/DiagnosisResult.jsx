// src/features/fault-diagnosis/components/DiagnosisResult.jsx
import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { TypewriterResult } from '../../../shared/components/Common/TypewriterResult';

export const DiagnosisResult = ({ diagnosis, repairRecommendations, onGenerateReport, onAskFollowUp }) => {
  const typingSpeed = 120;
  const [chatInput, setChatInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const lines = useMemo(() => {
    const output = [];

    if (diagnosis?.personalizedGreeting) {
      output.push(diagnosis.personalizedGreeting);
    }

    if (diagnosis?.primaryFault) {
      output.push({ text: 'Primary diagnosis:', type: 'title' });
      output.push({ text: diagnosis.primaryFault, type: 'text' });
    }

    if (diagnosis?.faultCode) {
      output.push({ text: 'Fault code:', type: 'title' });
      output.push({ text: diagnosis.faultCode, type: 'text' });
    }

    if (diagnosis?.confidence !== null && diagnosis?.confidence !== undefined) {
      output.push({ text: 'Confidence:', type: 'title' });
      output.push({ text: `${diagnosis.confidence}%`, type: 'text' });
    }

    if (diagnosis?.estimatedTime) {
      output.push({ text: 'Estimated repair time:', type: 'title' });
      output.push({ text: diagnosis.estimatedTime, type: 'text' });
    }

    if (diagnosis?.estimatedRepairCost !== null && diagnosis?.estimatedRepairCost !== undefined) {
      output.push({ text: 'Estimated repair cost:', type: 'title' });
      output.push({ text: `$${diagnosis.estimatedRepairCost}`, type: 'text' });
    }

    if (diagnosis?.skillLevel) {
      output.push({ text: 'Technician level:', type: 'title' });
      output.push({ text: diagnosis.skillLevel, type: 'text' });
    }

    if (Array.isArray(diagnosis?.recommendedActions) && diagnosis.recommendedActions.length > 0) {
      const actions = diagnosis.recommendedActions.filter(Boolean);
      if (actions.length > 0) {
        output.push({ text: 'Recommended actions:', type: 'title' });
        actions.forEach((action) => {
          output.push({ text: `- ${action}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(diagnosis?.possibleCauses) && diagnosis.possibleCauses.length > 0) {
      const causes = diagnosis.possibleCauses.filter(Boolean);
      if (causes.length > 0) {
        output.push({ text: 'Other possible causes:', type: 'title' });
        causes.forEach((cause) => {
          output.push({ text: `- ${cause}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(diagnosis?.affectedComponents) && diagnosis.affectedComponents.length > 0) {
      const components = diagnosis.affectedComponents.filter(Boolean);
      if (components.length > 0) {
        output.push({ text: 'Affected components:', type: 'title' });
        components.forEach((component) => {
          output.push({ text: `- ${component}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(diagnosis?.similarCases) && diagnosis.similarCases.length > 0) {
      output.push({ text: 'Similar past cases:', type: 'title' });
      diagnosis.similarCases.forEach((entry) => {
        if (!entry) return;
        const label = entry.deviceModel || entry.description;
        if (!label) return;
        const resolution = entry.resolution ? ` Resolution used: ${entry.resolution}.` : '';
        const success = entry.successRate !== null && entry.successRate !== undefined
          ? ` Observed success rate: ${entry.successRate}%.`
          : '';
        output.push({ text: `${label}.${success}${resolution}`, type: 'text' });
      });
    }

    if (repairRecommendations?.faultType) {
      output.push({ text: 'Repair guidance category:', type: 'title' });
      output.push({ text: repairRecommendations.faultType, type: 'text' });
    }

    if (repairRecommendations?.estimatedTime !== null && repairRecommendations?.estimatedTime !== undefined) {
      output.push({ text: 'Repair guidance estimated time:', type: 'title' });
      output.push({ text: `${repairRecommendations.estimatedTime} minutes`, type: 'text' });
    }

    if (repairRecommendations?.estimatedCost !== null && repairRecommendations?.estimatedCost !== undefined) {
      output.push({ text: 'Repair guidance estimated cost:', type: 'title' });
      output.push({ text: `$${repairRecommendations.estimatedCost}`, type: 'text' });
    }

    if (Array.isArray(repairRecommendations?.repairProcedure) && repairRecommendations.repairProcedure.length > 0) {
      const steps = repairRecommendations.repairProcedure.filter(Boolean);
      if (steps.length > 0) {
        output.push({ text: 'Suggested repair procedure:', type: 'title' });
        steps.forEach((step, index) => {
          output.push({ text: `${index + 1}. ${step}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(repairRecommendations?.requiredTools) && repairRecommendations.requiredTools.length > 0) {
      const tools = repairRecommendations.requiredTools.filter(Boolean);
      if (tools.length > 0) {
        output.push({ text: 'Recommended tools:', type: 'title' });
        tools.forEach((tool) => {
          output.push({ text: `- ${tool}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(repairRecommendations?.requiredParts) && repairRecommendations.requiredParts.length > 0) {
      const parts = repairRecommendations.requiredParts.filter(Boolean);
      if (parts.length > 0) {
        output.push({ text: 'Recommended spare parts:', type: 'title' });
        parts.forEach((part) => {
          output.push({ text: `- ${part}`, type: 'text' });
        });
      }
    }

    if (Array.isArray(repairRecommendations?.safetyPrecautions) && repairRecommendations.safetyPrecautions.length > 0) {
      const safety = repairRecommendations.safetyPrecautions.filter(Boolean);
      if (safety.length > 0) {
        output.push({ text: 'Safety precautions:', type: 'title' });
        safety.forEach((item) => {
          output.push({ text: `- ${item}`, type: 'text' });
        });
      }
    }

    if (diagnosis?.description) {
      output.push({ text: 'AI explanation:', type: 'title' });
      output.push({ text: diagnosis.description, type: 'text' });
    }

    if (
      diagnosis?.requiresClarification &&
      diagnosis?.clarificationMessage &&
      diagnosis?.clarificationMessage !== diagnosis?.description
    ) {
      output.push({ text: 'Clarification needed:', type: 'title' });
      output.push({ text: diagnosis.clarificationMessage, type: 'text' });
    }

    if (output.length === 0) {
      output.push({ text: 'No diagnosis details were returned by the AI service.', type: 'text' });
    }

    return output;
  }, [diagnosis, repairRecommendations]);

  const handleFollowUpSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuestion = chatInput.trim();
    if (!trimmedQuestion || isAsking) return;

    const typingId = `typing-${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmedQuestion },
      { id: typingId, role: 'assistant', isTyping: true }
    ]);
    setChatInput('');
    setIsAsking(true);

    try {
      const waitForTyping = new Promise((resolve) => setTimeout(resolve, 4000));
      if (onAskFollowUp) {
        const [answer] = await Promise.all([onAskFollowUp(trimmedQuestion), waitForTyping]);
        setChatMessages((prev) => prev.map((message) => {
          if (message.id !== typingId) return message;
          return {
            role: 'assistant',
            text: answer || 'I could not generate a follow-up response for that question.'
          };
        }));
      } else {
        await waitForTyping;
        setChatMessages((prev) => prev.map((message) => {
          if (message.id !== typingId) return message;
          return {
            role: 'assistant',
            text: 'Follow-up chat is not connected yet.'
          };
        }));
      }
    } catch (error) {
      setChatMessages((prev) => prev.map((message) => {
        if (message.id !== typingId) return message;
        return {
          role: 'assistant',
          text: error?.message || 'Unable to get a follow-up answer right now.'
        };
      }));
    } finally {
      setIsAsking(false);
    }
  };

  const lineDelays = useMemo(() => {
    let cumulativeDelay = 0;
    return lines.map((line) => {
      const startDelay = cumulativeDelay;
      const lineText = typeof line === 'string' ? line : line?.text;
      const lineLength = String(lineText || '').length;
      const typingDurationMs = 60 + (Math.max(lineLength, 1) * (1000 / typingSpeed));
      cumulativeDelay += typingDurationMs + 20;
      return startDelay;
    });
  }, [lines]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <TypewriterResult
          text="Diagnosis response"
          speed={typingSpeed}
          className="text-2xl font-bold text-gray-900"
        />
        <button
          onClick={onGenerateReport}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      <div className="space-y-2 border-t pt-4">
        {lines.map((line, index) => (
          (() => {
            const lineText = typeof line === 'string' ? line : line?.text;
            const lineType = typeof line === 'object' ? line?.type : 'text';
            const lineClassName = lineType === 'title'
              ? 'text-gray-900 font-semibold leading-relaxed'
              : 'text-gray-700 leading-relaxed';

            return (
          <TypewriterResult
            key={`${index}-${lineText}-${lineDelays[index]}`}
            text={lineText}
            speed={typingSpeed}
            delay={lineDelays[index]}
            className={lineClassName}
          />
            );
          })()
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 mb-2">Chat with AI</h3>
        <p className="text-sm text-gray-600 mb-3">
          Ask a follow-up question if the first answer does not solve the issue.
        </p>

        {chatMessages.length > 0 && (
          <div className="mb-3 max-h-64 overflow-y-auto space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-50 text-blue-900 border border-blue-100 mb-1'
                    : 'bg-gray-50 text-gray-800 border border-gray-100 mt-1'
                }`}
              >
                <p className="font-semibold mb-1">{message.role === 'user' ? 'You' : 'AI'}</p>
                {message.isTyping ? (
                  <div className="flex items-center gap-1 h-5">
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]"></span>
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleFollowUpSubmit} className="space-y-3">
          <textarea
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Example: No, this fix did not work. What should I check next?"
            className="w-full min-h-[90px] rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isAsking || !chatInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAsking ? 'AI is replying...' : 'Send to AI'}
          </button>
        </form>
      </div>

    </div>
  );
};
