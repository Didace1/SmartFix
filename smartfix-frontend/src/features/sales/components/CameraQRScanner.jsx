import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Camera-based QR Code Scanner using html5-qrcode library
 */
export const CameraQRScanner = ({ onScan, onClose, isOpen = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (isOpen && !html5QrCodeRef.current) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Create scanner instance
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Start scanning
      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback (can be ignored for continuous scanning)
          // console.log("Scan error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Failed to access camera. Please check permissions.");
      setIsScanning(false);
      toast.error("Failed to access camera");
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (decodedText) => {
    try {
      // Stop scanner
      await stopScanner();

      // Call parent callback
      await onScan(decodedText);
      
      toast.success('QR Code scanned successfully!');
      
      // Close modal after short delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (error) {
      console.error('Error processing scan:', error);
      toast.error('Failed to process QR code');
      // Restart scanner on error
      startScanner();
    }
  };

  const handleClose = async () => {
    await stopScanner();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Scan QR Code with Camera</h2>
              <p className="text-blue-100 text-sm">Point camera at QR code</p>
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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
          )}

          {/* Scanner Container */}
          <div className="relative">
            <div 
              id="qr-reader" 
              ref={scannerRef}
              className="w-full rounded-lg overflow-hidden border-4 border-blue-500"
              style={{ minHeight: '300px' }}
            />
            
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                  {/* Scanning animation corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">Instructions:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Hold your device steady</li>
              <li>• Position the QR code within the frame</li>
              <li>• Ensure good lighting for best results</li>
              <li>• Product will be added automatically when detected</li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full mt-4 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
