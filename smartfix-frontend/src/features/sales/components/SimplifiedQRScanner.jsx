import React, { useState, useRef } from 'react';
import { QrCode, Keyboard, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Simplified QR Scanner that avoids DOM manipulation conflicts
 * Uses manual input only to ensure reliability
 */
export const SimplifiedQRScanner = ({ onScan, onClose, isOpen = false }) => {
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    // Reset auto-submit flag when modal opens
    if (isOpen) {
      hasAutoSubmitted.current = false;
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const qrCode = manualInput.trim();
    
    if (!qrCode) {
      toast.error('Please enter a QR code');
      return;
    }
    
    if (qrCode.length < 4) {
      toast.error('QR code must be at least 4 characters long');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call the scan callback
      await onScan(qrCode);
      
      setResult({ success: true, message: 'QR code scanned successfully!' });
      toast.success('Product added to cart');
      
      // Reset and close after short delay
      setTimeout(() => {
        setManualInput('');
        setResult(null);
        hasAutoSubmitted.current = false;
        if (onClose) {
          onClose();
        }
      }, 1000);
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setResult({ success: false, message: error.message || 'Failed to scan QR code' });
      toast.error('Failed to scan QR code');
      hasAutoSubmitted.current = false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-submit when QR code format is detected (for USB scanners)
  React.useEffect(() => {
    const qrCode = manualInput.trim();
    // Auto-submit if code starts with SFQR and has at least 10 characters
    // Only auto-submit once per scan session
    if (qrCode.startsWith('SFQR') && qrCode.length >= 10 && !isProcessing && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      handleSubmit();
    }
  }, [manualInput, isProcessing]);

  const handleClose = () => {
    setManualInput('');
    setResult(null);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-3">
            <QrCode className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Scan QR Code</h2>
              <p className="text-blue-100 text-sm">Enter QR code manually</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Result Message */}
          {result && (
            <div className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Keyboard className="w-4 h-4 inline mr-2" />
                QR Code Data
              </label>
              <input
                ref={inputRef}
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter QR code value (e.g., SFQREL00010001)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                autoComplete="off"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: You can also use a USB QR code scanner to input the code automatically
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-900 font-medium mb-2">How to use:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>USB Scanner:</strong> Just scan - product adds automatically!</li>
                <li>• <strong>Manual Entry:</strong> Type code and press Enter or click "Add"</li>
                <li>• QR codes start with "SFQR" followed by numbers</li>
                <li>• No need to click button after scanning with USB scanner</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!manualInput.trim() || isProcessing}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
