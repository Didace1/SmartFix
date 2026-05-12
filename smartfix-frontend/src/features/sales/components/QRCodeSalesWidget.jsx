import React, { useState } from 'react';
import { QrCode, Scan, Keyboard, Camera } from 'lucide-react';
import { SimplifiedQRScanner } from './SimplifiedQRScanner';
import { CameraQRScanner } from './CameraQRScanner';
import { qrCodeService } from '../../../shared/services/qrCodeService';
import toast from 'react-hot-toast';

export const QRCodeSalesWidget = ({ onProductScanned }) => {
  const [showManualScanner, setShowManualScanner] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (qrCodeData) => {
    try {
      setIsProcessing(true);
      const result = await qrCodeService.scanQRCode(qrCodeData);
      
      if (result.success && result.found && result.product) {
        // Automatically add to cart immediately after scanning
        if (onProductScanned) {
          onProductScanned(result.product);
        }
        toast.success(`${result.product.name} added to cart!`);
        setShowManualScanner(false);
        setShowCameraScanner(false);
      } else {
        toast.error('Product not found for this QR code');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <QrCode className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Scan</h3>
            <p className="text-sm text-gray-600">Choose your scanning method</p>
          </div>
        </div>
      </div>

      {/* Two Scan Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Camera Scan Button */}
        <button
          onClick={() => setShowCameraScanner(true)}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg hover:from-blue-100 hover:to-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <span className="font-semibold text-blue-900 text-center">Scan with Camera</span>
          <span className="text-xs text-blue-700 mt-1 text-center">Use device camera</span>
        </button>

        {/* Manual Entry Button */}
        <button
          onClick={() => setShowManualScanner(true)}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg hover:from-green-100 hover:to-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
        >
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Keyboard className="w-8 h-8 text-white" />
          </div>
          <span className="font-semibold text-green-900 text-center">Enter Code Manually</span>
          <span className="text-xs text-green-700 mt-1 text-center">Type or use USB scanner</span>
        </button>
      </div>

      {/* Camera Scanner Modal */}
      {showCameraScanner && (
        <CameraQRScanner
          isOpen={showCameraScanner}
          onClose={() => setShowCameraScanner(false)}
          onScan={handleScan}
        />
      )}

      {/* Manual Scanner Modal */}
      {showManualScanner && (
        <SimplifiedQRScanner
          isOpen={showManualScanner}
          onClose={() => setShowManualScanner(false)}
          onScan={handleScan}
        />
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Quick Tip:</strong> Scan product QR codes to quickly add items to your sale. 
          You can also use manual input if camera scanning is not available.
        </p>
      </div>
    </div>
  );
};
