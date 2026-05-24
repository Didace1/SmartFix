import React from 'react';
import {
  CheckCircle,
  Package,
  DollarSign,
  FileText,
  RefreshCw,
  Home,
  Download,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../shared/utils/formatters';

export const SummaryScreen = ({
  acceptedItems,
  skippedItems,
  recommendations,
  onStartNew
}) => {
  const calculateTotals = () => {
    // Calculate totals from ALL recommended items (not just accepted)
    const allRecommendedItems = [
      ...(recommendations?.recommendations?.high || []),
      ...(recommendations?.recommendations?.medium || []),
      ...(recommendations?.recommendations?.low || [])
    ];

    const totalQuantity = allRecommendedItems.reduce((sum, item) => sum + (item.recommended_quantity || 0), 0);
    
    // Use purchase_cost for investment calculation
    const totalValue = allRecommendedItems.reduce((sum, item) => {
      const purchaseCost = item.purchase_cost || 0;
      const quantity = item.recommended_quantity || 0;
      return sum + (purchaseCost * quantity);
    }, 0);

    const highPriorityCount = recommendations?.summary?.high_priority_count || 0;
    const mediumPriorityCount = recommendations?.summary?.medium_priority_count || 0;
    const lowPriorityCount = recommendations?.summary?.low_priority_count || 0;

    return {
      totalQuantity,
      totalValue,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount
    };
  };

  const totals = calculateTotals();

  const handleExport = () => {
    // Create CSV content
    const headers = ['Product Name', 'Brand', 'Category', 'Recommended Quantity', 'Priority', 'AI Score'];
    const rows = acceptedItems.map(item => [
      item.product_name,
      item.brand,
      item.category,
      item.recommended_quantity,
      item.recommendation_score >= 4.0 ? 'High' : item.recommendation_score >= 3.0 ? 'Medium' : 'Low',
      item.recommendation_score
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-recommendations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Recommendation Session Complete
          </h1>
          <p className="text-lg text-gray-600">
            Here's a summary of your ordering decisions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Items Recommended */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Items Recommended</p>
                <p className="text-3xl font-bold text-gray-900">{recommendations?.summary?.total_count || 0}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">High Priority:</span>
                <span className="font-semibold text-red-600">{recommendations?.summary?.high_priority_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medium Priority:</span>
                <span className="font-semibold text-yellow-600">{recommendations?.summary?.medium_priority_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Priority:</span>
                <span className="font-semibold text-green-600">{recommendations?.summary?.low_priority_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Total Quantity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Order Quantity</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(totals.totalQuantity)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">units across all items</p>
          </div>

          {/* Estimated Investment */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Investment</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalValue).replace('$', '')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">approximate order value</p>
          </div>
        </div>

        {/* Accepted Items List */}
        {acceptedItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Accepted Items
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {acceptedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">{item.brand} • {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatNumber(item.recommended_quantity)} units</p>
                    <p className="text-sm text-gray-600">Score: {item.recommendation_score}/5.0</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skipped Items */}
        {skippedItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Skipped Items ({skippedItems.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These items were skipped during review. You can review them later.
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {skippedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  <span className="text-xs text-gray-600">{item.brand}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-md"
          >
            <Download className="w-5 h-5" />
            Export Order List (CSV)
          </button>
          <button
            onClick={() => window.location.href = '/inventory'}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>💡 Recommendations are based on real sales data and AI analysis</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};
