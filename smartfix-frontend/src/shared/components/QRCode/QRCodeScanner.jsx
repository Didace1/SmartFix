import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  RotateCcw,
  Smartphone,
  Monitor,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  Keyboard,
  QrCode,
  Scan
} from 'lucide-react';
import toast from 'react-hot-toast';

export const QRCodeScanner = ({ 
  onScan, 
  onClose, 
  isOpen = false,
  title = "QR Code Scanner"
}) => {
  const [scanMode, setScanMode] = useState('manual'); // 'manual' or 'camera'
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [containerKey, setContainerKey] = useState(0);

  const html5QrCodeRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const cleanupTimeoutRef = useRef(null);

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      
      if (isMobile && !isTablet) {
        setDeviceType('mobile');
      } else if (isTablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();
  }, []);

  // Focus input when modal opens in manual mode
  useEffect(() => {
    if (isOpen && scanMode === 'manual' && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scanMode]);

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser. Please use manual input instead.');
      }
      
      // Check if we're in a secure context (HTTPS or localhost)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        throw new Error('Camera access requires HTTPS or localhost. Please use manual input instead.');
      }
      
      try {
        // First, try to get cameras without requesting permissions
        let devices = [];
        try {
          devices = await Html5Qrcode.getCameras();
        } catch (getCameraError) {
          // If getCameras fails, try requesting permission first
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 }
            } 
          });
          
          // Stop the test stream immediately
          stream.getTracks().forEach(track => track.stop());
          
          // Now try to get cameras again
          devices = await Html5Qrcode.getCameras();
        }
        
        setCameras(devices);
        
        if (devices.length > 0) {
          // Prefer back camera on mobile, front camera on desktop
          const preferredCamera = deviceType === 'mobile' 
            ? devices.find(camera => camera.label.toLowerCase().includes('back')) || devices[0]
            : devices.find(camera => camera.label.toLowerCase().includes('front')) || devices[0];
          
          setSelectedCamera(preferredCamera);
        } else {
          throw new Error('No cameras found on this device');
        }
      } catch (permissionError) {
        if (permissionError.name === 'NotAllowedError') {
          throw new Error('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
        } else if (permissionError.name === 'NotFoundError') {
          throw new Error('No camera found on this device. Please use manual input instead.');
        } else if (permissionError.name === 'NotReadableError') {
          throw new Error('Camera is being used by another application. Please close other camera apps and try again.');
        } else if (permissionError.name === 'OverconstrainedError') {
          throw new Error('Camera constraints not supported. Please try manual input instead.');
        } else {
          throw new Error(`Camera error: ${permissionError.message}`);
        }
      }
      
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError(err.message || 'Camera access failed. Please use manual input instead.');
    } finally {
      setIsLoading(false);
    }
  }, [deviceType]);

  // Initialize cameras when switching to camera mode
  useEffect(() => {
    if (isOpen && scanMode === 'camera') {
      getCameras();
    }
  }, [isOpen, scanMode, getCameras]);

  // Auto-start scanning when camera is selected
  useEffect(() => {
    if (isOpen && scanMode === 'camera' && selectedCamera && !isScanning && !error && !isLoading) {
      // Auto-start scanning after a short delay
      const timer = setTimeout(() => {
        startHtml5Scanner();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scanMode, selectedCamera, isScanning, error, isLoading, startHtml5Scanner]);

  // Safe DOM cleanup function
  const safeDOMCleanup = useCallback(() => {
    try {
      // Clear any pending timeouts
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }

      // Stop HTML5 scanner without touching DOM
      if (html5QrCodeRef.current) {
        try {
          const scanner = html5QrCodeRef.current;
          html5QrCodeRef.current = null; // Clear reference immediately
          
          // Just stop the scanner, let React handle DOM cleanup
          Promise.resolve().then(async () => {
            try {
              if (scanner.getState && scanner.getState() === 2) {
                await scanner.stop();
              }
              // Don't call scanner.clear() - let React handle DOM
            } catch (error) {
              // Ignore all errors
            }
          }).catch(() => {
            // Ignore promise errors
          });
        } catch (error) {
          // Ignore all errors
        }
      }

    } catch (error) {
      // Ignore all cleanup errors
    }
  }, []);

  // Handle successful scan
  const handleScanSuccess = useCallback((decodedText, decodedResult) => {
    if (!decodedText || scanResult) return; // Prevent duplicate scans
    
    setScanResult(decodedText);
    setIsScanning(false);
    
    // Stop scanners with delay to prevent DOM conflicts
    cleanupTimeoutRef.current = setTimeout(() => {
      safeDOMCleanup();
    }, 100);
    
    // Show success feedback
    toast.success(`QR code scanned successfully!`);
    
    // Call parent callback
    if (onScan) {
      onScan(decodedText, decodedResult);
    }
    
    // Auto-close after successful scan
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1500);
  }, [onScan, onClose, scanResult, safeDOMCleanup]);

  // HTML5-QRCode scanner implementation
  const startHtml5Scanner = useCallback(async () => {
    if (!selectedCamera || !containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Clean up any existing scanner first
      safeDOMCleanup();

      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Ensure container has proper dimensions and is visible
      const container = containerRef.current;
      if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
        throw new Error('Scanner container not ready. Please try again.');
      }

      // Calculate safe dimensions
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const maxWidth = Math.max(200, Math.min(containerWidth - 40, 300));
      const maxHeight = Math.max(150, Math.min(containerHeight - 40, 300));

      const config = {
        fps: 10,
        qrbox: {
          width: maxWidth,
          height: maxHeight
        },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: deviceType === 'mobile' ? 'environment' : 'user',
          width: { 
            min: 320,
            ideal: deviceType === 'mobile' ? 640 : 1280,
            max: 1920
          },
          height: { 
            min: 240,
            ideal: deviceType === 'mobile' ? 480 : 720,
            max: 1080
          }
        },
        // QR codes only - remove the unsupported format reference
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        },
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: false
      };

      // Create new scanner instance with unique container ID
      const containerId = `qr-scanner-container-${containerKey}`;
      if (containerRef.current) {
        containerRef.current.id = containerId;
      }
      
      const scanner = new Html5Qrcode(containerId);
      html5QrCodeRef.current = scanner;
      
      await scanner.start(
        selectedCamera.id,
        config,
        (decodedText, decodedResult) => {
          handleScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // Filter out common scanning noise
          if (!errorMessage.includes('No MultiFormat Readers') && 
              !errorMessage.includes('NotFoundException') &&
              !errorMessage.includes('QR code parse error')) {
            console.log('Scan error:', errorMessage);
          }
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to start camera scanner.';
      
      if (err.message.includes('Permission denied') || err.message.includes('NotAllowedError')) {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.message.includes('NotFoundError') || err.message.includes('No camera')) {
        errorMessage = 'No camera found. Please use manual input instead.';
      } else if (err.message.includes('NotReadableError')) {
        errorMessage = 'Camera is busy. Please close other camera apps and try again.';
      } else if (err.message.includes('container not ready')) {
        errorMessage = 'Scanner not ready. Please try again in a moment.';
      } else {
        errorMessage += ' Try manual input instead.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCamera, deviceType, containerKey, safeDOMCleanup, handleScanSuccess]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setScanResult(null);
    safeDOMCleanup();
    
    // Force container recreation to avoid DOM conflicts
    setTimeout(() => {
      setContainerKey(prev => prev + 1);
    }, 200);
  }, [safeDOMCleanup]);

  // Start scanning
  const startScanning = useCallback(() => {
    startHtml5Scanner();
  }, [startHtml5Scanner]);

  // Switch camera
  const switchCamera = useCallback((camera) => {
    if (isScanning) {
      stopScanning();
    }
    setSelectedCamera(camera);
  }, [isScanning, stopScanning]);

  // Handle manual input
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const qrCode = manualInput.trim();
    
    if (!qrCode) {
      setError('Please enter a QR code');
      return;
    }
    
    if (qrCode.length < 4) {
      setError('QR code must be at least 4 characters long');
      return;
    }
    
    setError('');
    setScanResult(qrCode);
    
    // Show success feedback
    toast.success(`QR code entered: ${qrCode}`);
    
    // Call parent callback
    if (onScan) {
      onScan(qrCode);
    }
    
    // Reset and close
    setManualInput('');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1000);
  };

  // Cleanup on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopScanning();
      setError(null);
      setScanResult(null);
      setManualInput('');
      // Reset container key when modal closes
      setContainerKey(prev => prev + 1);
    }
  }, [isOpen, stopScanning]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      safeDOMCleanup();
    };
  }, [safeDOMCleanup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${
        deviceType === 'mobile' ? 'mx-2' : 'mx-4'
      }`}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <QrCode className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-blue-100 text-sm">
                {deviceType === 'mobile' ? 'Mobile Camera' : 'Webcam Scanner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => {
                stopScanning();
                setScanMode('manual');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                scanMode === 'manual'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Manual Input
            </button>
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                scanMode === 'camera'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Camera Scan
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Manual Input Mode */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Success Result */}
              {scanResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">QR Code Scanned!</p>
                      <p className="text-green-700 font-mono text-sm">{scanResult}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Data
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter QR code data manually or scan with USB scanner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the QR code data manually or use a USB QR code scanner
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!manualInput.trim()}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Scan QR Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              {/* Camera Controls */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                {/* Camera Selection */}
                {cameras.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Camera:</label>
                    <select
                      value={selectedCamera?.id || ''}
                      onChange={(e) => {
                        const camera = cameras.find(c => c.id === e.target.value);
                        switchCamera(camera);
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={isScanning}
                    >
                      {cameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                          {camera.label || `Camera ${camera.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={getCameras}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-2" />
                    Retry
                  </button>
                </div>
              )}

              {/* Scanner Container */}
              {!error && (
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <div
                    key={containerKey}
                    id={`qr-scanner-container-${containerKey}`}
                    ref={containerRef}
                    className={`w-full ${
                      deviceType === 'mobile' ? 'h-64' : 'h-80'
                    } flex items-center justify-center`}
                  >
                    {!isScanning && !isLoading && (
                      <div className="text-center text-gray-400">
                        <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Click "Start Scanning" to begin</p>
                      </div>
                    )}
                    {isLoading && (
                      <div className="text-center text-white">
                        <Loader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Initializing camera...</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-4 border-2 border-green-400 rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <p className="text-white text-sm bg-black bg-opacity-50 rounded px-3 py-1 inline-block">
                          Position QR code within the frame
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Success Result */}
              {scanResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">QR Code Detected!</p>
                      <p className="text-green-700 font-mono text-sm">{scanResult}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              {!error && (
                <div className="flex space-x-3">
                  {!isScanning ? (
                    <button
                      onClick={startScanning}
                      disabled={!selectedCamera || isLoading}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <Scan className="w-5 h-5" />
                      <span>Start Scanning</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopScanning}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CameraOff className="w-5 h-5" />
                      <span>Stop Scanning</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Instructions */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">Scanning Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Hold the QR code steady within the frame</li>
                  <li>Ensure good lighting for better detection</li>
                  <li>Try different angles if scanning fails</li>
                  <li>Switch cameras if multiple are available</li>
                  <li>Use manual input if camera scanning doesn't work</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};