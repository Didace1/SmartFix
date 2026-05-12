import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  TrendingUp, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Scan,
  BarChart3
} from 'lucide-react';
import { qrCodeService } from '../../../shared/services/qrCodeService';
import { formatNumber } from '../../../shared/utils/formatters';

export const QRCodeWidget = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await qrCodeService.getQRCodeStatistics();
        setStatistics(stats);
      } catch (err) {
        console.error('Error loading QR code statistics:', err);
        setError('Failed to load QR code statistics');
        // Set mock data for demo
        setStatistics({
          totalQRCodes: 0,
          totalScans: 0,
          mostScannedQRCodes: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <QrCode className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">QR Codes</h3>
            <p className="text-sm text-gray-600">Quick overview</p>
          </div>
        </div>
        <Link
          to="/inventory/qrcodes"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View All</span>
        </Link>
      </div>

      {error ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error Loading Data</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(statistics?.totalQRCodes || 0)}
              </p>
              <p className="text-sm text-blue-700">Total QR Codes</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Scan className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(statistics?.totalScans || 0)}
              </p>
              <p className="text-sm text-green-700">Total Scans</p>
            </div>
          </div>

          {/* Most Scanned QR Codes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
              Most Scanned
            </h4>
            
            {statistics?.mostScannedQRCodes && statistics.mostScannedQRCodes.length > 0 ? (
              <div className="space-y-2">
                {statistics.mostScannedQRCodes.slice(0, 3).map((qrCode, index) => (
                  <div key={qrCode.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500 w-4">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {qrCode.inventoryItem?.name || 'Unknown Product'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {qrCode.qrCodeValue}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {qrCode.isActive ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        {qrCode.scanCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No scan data available</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Link
                to="/inventory/qrcodes"
                className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Manage QR Codes
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};