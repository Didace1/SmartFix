import React, { useState } from 'react';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const QRCodeDisplay = ({ 
  qrCode, 
  inventoryItem, 
  onRegenerate,
  showControls = true,
  size = 'medium' 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const handleCopyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.qrCodeValue);
      toast.success('QR code value copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy QR code value');
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCode.qrImageBase64) {
      toast.error('QR code image not available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${qrCode.qrImageBase64}`;
      link.download = `qr-code-${qrCode.qrCodeValue}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handlePrintQRCode = () => {
    if (!qrCode.qrImageBase64) {
      toast.error('QR code image not available');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${inventoryItem?.name || qrCode.qrCodeValue}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                text-align: center;
              }
              .qr-container {
                display: inline-block;
                border: 2px solid #000;
                padding: 20px;
                margin: 20px;
              }
              .qr-image {
                display: block;
                margin: 0 auto 10px;
              }
              .qr-info {
                font-size: 12px;
                margin-top: 10px;
              }
              @media print {
                body { margin: 0; padding: 10px; }
                .qr-container { border: 1px solid #000; padding: 10px; margin: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="data:image/png;base64,${qrCode.qrImageBase64}" 
                   alt="QR Code" class="qr-image" width="200" height="200" />
              <div class="qr-info">
                <strong>${inventoryItem?.name || 'Product'}</strong><br/>
                ${qrCode.qrCodeValue}<br/>
                ${inventoryItem?.brand ? `${inventoryItem.brand} ${inventoryItem.model || ''}` : ''}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success('QR code sent to printer');
    } catch (error) {
      toast.error('Failed to print QR code');
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    
    setIsRegenerating(true);
    try {
      await onRegenerate();
      toast.success('QR code regenerated successfully');
    } catch (error) {
      toast.error('Failed to regenerate QR code');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!qrCode) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No QR code available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          {qrCode.isActive ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Inactive
            </span>
          )}
        </div>
        
        {showControls && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* QR Code Image */}
      <div className="flex justify-center mb-4">
        {qrCode.qrImageBase64 ? (
          <div className="relative">
            <img
              src={`data:image/png;base64,${qrCode.qrImageBase64}`}
              alt="QR Code"
              className={`${sizeClasses[size]} border border-gray-200 rounded-lg bg-white`}
            />
            {!qrCode.isActive && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-red-700 font-semibold text-sm">INACTIVE</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`${sizeClasses[size]} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50`}>
            <div className="text-center">
              <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Value */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 mb-1">QR Code Value</p>
        <p className="font-mono text-lg font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded border">
          {qrCode.qrCodeValue}
        </p>
      </div>

      {/* Product Info */}
      {inventoryItem && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">{inventoryItem.name}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {inventoryItem.brand && (
              <div>
                <span className="text-blue-700 font-medium">Brand:</span>
                <span className="text-blue-800 ml-1">{inventoryItem.brand}</span>
              </div>
            )}
            {inventoryItem.model && (
              <div>
                <span className="text-blue-700 font-medium">Model:</span>
                <span className="text-blue-800 ml-1">{inventoryItem.model}</span>
              </div>
            )}
            {inventoryItem.category && (
              <div>
                <span className="text-blue-700 font-medium">Category:</span>
                <span className="text-blue-800 ml-1">{inventoryItem.category?.name || inventoryItem.category || 'N/A'}</span>
              </div>
            )}
            <div>
              <span className="text-blue-700 font-medium">Price:</span>
              <span className="text-blue-800 ml-1">{inventoryItem.price?.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Scan Count:</span>
              <span className="text-gray-900 ml-2">{qrCode.scanCount || 0}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Created:</span>
              <span className="text-gray-900 ml-2">
                {qrCode.createdAt ? new Date(qrCode.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {qrCode.lastScannedAt && (
              <div className="col-span-2">
                <span className="text-gray-600 font-medium">Last Scanned:</span>
                <span className="text-gray-900 ml-2">
                  {new Date(qrCode.lastScannedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyQRCode}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          
          <button
            onClick={handleDownloadQRCode}
            disabled={!qrCode.qrImageBase64}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handlePrintQRCode}
            disabled={!qrCode.qrImageBase64}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          
          {onRegenerate && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};