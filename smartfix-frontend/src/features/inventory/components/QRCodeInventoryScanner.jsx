import React, { useState } from 'react';
import { QrCode, Camera, Package } from 'lucide-react';
import { CameraQRScanner } from '../../sales/components/CameraQRScanner';
import { qrCodeService } from '../../../shared/services/qrCodeService';
import toast from 'react-hot-toast';

export const QRCodeInventoryScanner = ({ onProductScanned }) => {
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (qrCodeData) => {
    try {
      setIsProcessing(true);
      const result = await qrCodeService.scanQRCode(qrCodeData);
      
      if (result.success && result.found && result.product) {
        // Pass product to parent component
        if (onProductScanned) {
          onProductScanned(result.product);
        }
        toast.success(`Product found: ${result.product.name}`);
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Stock Check</h3>
            <p className="text-sm text-gray-600">Scan to view product details</p>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={() => setShowCameraScanner(true)}
          disabled={isProcessing}
          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-md hover:from-green-100 hover:to-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all group space-x-3"
        >
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-green-900">Scan Product QR Code</div>
            <div className="text-sm text-green-700 mt-0.5">Use camera to scan</div>
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
      <div className="mt-4 p-4 bg-white rounded-lg border border-green-200 flex justify-center">
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="flex items-center justify-center mb-2">
            <Package className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-sm font-medium text-gray-900">How to use:</p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Scan Product QR Code"</li>
            <li>• Point camera at product QR code</li>
            <li>• View product details instantly</li>
            <li>• Update stock or check information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
