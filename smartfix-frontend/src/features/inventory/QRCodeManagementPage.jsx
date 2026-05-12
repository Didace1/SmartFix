import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Package,
  Scan
} from 'lucide-react';
import toast from 'react-hot-toast';
import { qrCodeService } from '../../shared/services/qrCodeService';
import { QRCodeDisplay } from '../../shared/components/QRCode/QRCodeDisplay';
import { SimplifiedQRScanner } from '../sales/components/SimplifiedQRScanner';
import { formatCurrency, formatNumber } from '../../shared/utils/formatters';

export const QRCodeManagementPage = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);

  // Load QR codes
  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const data = await qrCodeService.getAllQRCodes();
      setQrCodes(data);
      setFilteredQrCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const stats = await qrCodeService.getQRCodeStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Filter QR codes
  useEffect(() => {
    let filtered = qrCodes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(qr =>
        qr.qrCodeValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.inventoryItem?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.inventoryItem?.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(qr => 
        filterStatus === 'active' ? qr.isActive : !qr.isActive
      );
    }

    setFilteredQrCodes(filtered);
  }, [qrCodes, searchTerm, filterStatus]);

  // Generate bulk QR codes
  const handleGenerateBulk = async () => {
    try {
      setIsGeneratingBulk(true);
      const result = await qrCodeService.generateBulkQRCodes();
      toast.success(`Generated ${result.generated} QR codes`);
      loadQRCodes();
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
      toast.error('Failed to generate bulk QR codes');
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  // Regenerate QR code
  const handleRegenerate = async (inventoryItemId) => {
    try {
      await qrCodeService.generateQRCode(inventoryItemId);
      toast.success('QR code regenerated successfully');
      loadQRCodes();
      setSelectedQrCode(null);
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error('Failed to regenerate QR code');
    }
  };

  // Handle scan result
  const handleScanResult = async (qrCodeData) => {
    try {
      const result = await qrCodeService.scanQRCode(qrCodeData);
      if (result.success && result.found) {
        toast.success(`Product found: ${result.product.name}`);
        // Find and select the QR code
        const qrCode = qrCodes.find(qr => 
          qr.qrCodeValue === qrCodeData || 
          qr.inventoryItem?.id === result.product.id
        );
        if (qrCode) {
          setSelectedQrCode(qrCode);
        }
      } else {
        toast.error('Product not found for this QR code');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
    }
  };

  // Load data on mount
  useEffect(() => {
    loadQRCodes();
    loadStatistics();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <QrCode className="w-8 h-8 mr-3 text-blue-600" />
              QR Code Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage QR codes for inventory items
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Scan QR Code</span>
            </button>
            
            <button
              onClick={handleGenerateBulk}
              disabled={isGeneratingBulk}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isGeneratingBulk ? 'Generating...' : 'Generate Bulk'}</span>
            </button>
            
            <button
              onClick={loadQRCodes}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(statistics.totalQRCodes)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(statistics.totalScans)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(qrCodes.filter(qr => qr.isActive).length)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search QR codes, products, or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Codes List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            QR Codes ({formatNumber(filteredQrCodes.length)})
          </h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredQrCodes.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No QR codes found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Generate QR codes for your inventory items'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredQrCodes.map((qrCode) => (
                <div
                  key={qrCode.id}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedQrCode?.id === qrCode.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedQrCode(qrCode)}
                >
                  <div className="flex items-center space-x-4">
                    {/* QR Code Thumbnail */}
                    <div className="flex-shrink-0">
                      {qrCode.qrImageBase64 ? (
                        <img
                          src={`data:image/png;base64,${qrCode.qrImageBase64}`}
                          alt="QR Code"
                          className="w-16 h-16 border border-gray-200 rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* QR Code Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {qrCode.inventoryItem?.name || 'Unknown Product'}
                        </h3>
                        {qrCode.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 font-mono mb-1">
                        {qrCode.qrCodeValue}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Scans: {qrCode.scanCount || 0}</span>
                        {qrCode.inventoryItem?.price && (
                          <span>Price: {formatCurrency(qrCode.inventoryItem.price)}</span>
                        )}
                        <span>
                          Created: {qrCode.createdAt ? new Date(qrCode.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQrCode(qrCode);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Code Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Details</h2>
          
          {selectedQrCode ? (
            <QRCodeDisplay
              qrCode={selectedQrCode}
              inventoryItem={selectedQrCode.inventoryItem}
              onRegenerate={() => handleRegenerate(selectedQrCode.inventoryItem?.id)}
              showControls={true}
              size="large"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a QR code to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      {showScanner && (
        <SimplifiedQRScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleScanResult}
        />
      )}
    </div>
  );
};