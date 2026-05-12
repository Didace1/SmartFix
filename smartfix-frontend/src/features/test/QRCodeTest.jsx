import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { SimplifiedQRScanner } from '../sales/components/SimplifiedQRScanner';
import { QRCodeDisplay } from '../../shared/components/QRCode/QRCodeDisplay';
import { qrCodeService } from '../../shared/services/qrCodeService';
import toast from 'react-hot-toast';

export const QRCodeTest = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const data = await qrCodeService.getAllQRCodes();
      setQrCodes(data);
      if (data.length > 0) {
        setSelectedQrCode(data[0]);
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (qrCodeData) => {
    try {
      const result = await qrCodeService.scanQRCode(qrCodeData);
      setScanResult(result);
      
      if (result.success && result.found) {
        toast.success(`Product found: ${result.product.name}`);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
    }
  };

  const handleGenerateBulk = async () => {
    try {
      const result = await qrCodeService.generateBulkQRCodes();
      toast.success(`Generated ${result.generated} QR codes`);
      loadQRCodes();
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
      toast.error('Failed to generate QR codes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-8 h-8 mr-3 text-blue-600" />
            QR Code System Test
          </h1>
          <p className="text-gray-600 mt-2">
            Test QR code generation, scanning, and display functionality
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Scanner
            </button>
            <button
              onClick={handleGenerateBulk}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Bulk QR Codes
            </button>
            <button
              onClick={loadQRCodes}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh QR Codes
            </button>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className={`mb-6 p-4 rounded-lg border ${
            scanResult.success && scanResult.found
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {scanResult.success && scanResult.found ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-semibold ${
                  scanResult.success && scanResult.found ? 'text-green-900' : 'text-red-900'
                }`}>
                  {scanResult.message || (scanResult.success && scanResult.found ? 'Product Found!' : 'Product Not Found')}
                </p>
                {scanResult.product && (
                  <p className="text-sm text-gray-700 mt-1">
                    {scanResult.product.name} - {scanResult.product.price?.toLocaleString()} RWF
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Codes List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available QR Codes ({qrCodes.length})
            </h2>
            
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Loader className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600">Loading QR codes...</p>
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No QR codes found</p>
                <p className="text-gray-500 text-sm">
                  Click "Generate Bulk QR Codes" to create QR codes for your inventory
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {qrCodes.map((qrCode) => (
                  <div
                    key={qrCode.id}
                    className={`bg-white rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedQrCode?.id === qrCode.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedQrCode(qrCode)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {qrCode.qrImageBase64 ? (
                          <img
                            src={`data:image/png;base64,${qrCode.qrImageBase64}`}
                            alt="QR Code"
                            className="w-12 h-12 border border-gray-200 rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {qrCode.inventoryItem?.name || 'Unknown Product'}
                        </p>
                        <p className="text-sm text-gray-600 font-mono">
                          {qrCode.qrCodeValue}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>Scans: {qrCode.scanCount || 0}</span>
                          {qrCode.isActive ? (
                            <span className="text-green-600">● Active</span>
                          ) : (
                            <span className="text-red-600">● Inactive</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Details</h2>
            
            {selectedQrCode ? (
              <QRCodeDisplay
                qrCode={selectedQrCode}
                inventoryItem={selectedQrCode.inventoryItem}
                showControls={true}
                size="large"
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a QR code to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <SimplifiedQRScanner
            isOpen={showScanner}
            onClose={() => setShowScanner(false)}
            onScan={handleScan}
          />
        )}
      </div>
    </div>
  );
};
