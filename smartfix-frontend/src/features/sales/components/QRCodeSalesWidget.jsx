import React, { useState } from 'react';
import { QrCode, Scan, Camera } from 'lucide-react';
import { CameraQRScanner } from './CameraQRScanner';
import { qrCodeService } from '../../../shared/services/qrCodeService';
import toast from 'react-hot-toast';

export const QRCodeSalesWidget = ({ onProductScanned }) => {
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
          </div>
        </div>
      </div>

      {/* Scan Option */}
      <div className="mb-4">
        {/* Camera Scan Button */}
        <button
          onClick={() => setShowCameraScanner(true)}
          disabled={isProcessing}
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg hover:from-blue-100 hover:to-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all group space-x-4"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-blue-900">Scan with Camera</div>
            <div className="text-sm text-blue-700 mt-0.5">Use device camera</div>
          </div>
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

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Quick Tip:</strong> Scan product QR codes to quickly add items to your sale.
        </p>
      </div>
    </div>
  );
};
