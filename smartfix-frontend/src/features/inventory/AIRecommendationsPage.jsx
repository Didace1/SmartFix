import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Brain, 
  Package, 
  AlertTriangle, 
  Star, 
  DollarSign,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Target,
  ShoppingCart,
  Eye,
  Calendar,
  Award
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../shared/utils/formatters';

export const AIRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const AI_BACKEND_BASE_URL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:8000';

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      setAnalyzing(true);
      setShowContent(false);
      
      const response = await fetch(`${AI_BACKEND_BASE_URL}/api/inventory-recommendations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.data);
      setError(null);
      
      // Show "Analyzing..." for 3 seconds before displaying results
      setTimeout(() => {
        setAnalyzing(false);
        setShowContent(true);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recommendations:', err);
      setAnalyzing(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getPriorityColor = (score) => {
    if (score >= 4) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 2) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getPriorityLabel = (score) => {
    if (score >= 4) return 'High Priority';
    if (score >= 3) return 'Medium Priority';
    if (score >= 2) return 'Low Priority';
    return 'Consider';
  };

  const getDemandIcon = (demand) => {
    switch (demand) {
      case 'high': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'medium': return <BarChart3 className="w-4 h-4 text-yellow-500" />;
      default: return <Target className="w-4 h-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Brain className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-600">Analyzing sales data and market trends...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show analyzing animation for 3 seconds after data loads
  if (analyzing) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="relative">
              <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">
              🤖 AI Analyzing...
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600 animate-pulse">📊 Processing sales data...</p>
              <p className="text-gray-600 animate-pulse" style={{ animationDelay: '0.5s' }}>
                🔍 Identifying market trends...
              </p>
              <p className="text-gray-600 animate-pulse" style={{ animationDelay: '1s' }}>
                💡 Generating recommendations...
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Recommendations</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            AI Inventory Recommendations
          </h1>
          <p className="text-gray-600 mt-1">
            Smart suggestions based on sales trends and market analysis
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </button>
      </div>

      {/* Only show content after analyzing is complete */}
      {showContent && recommendations && (
        <>
          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Recommendations</p>
                <p className="text-xl font-bold text-gray-900">
                  {recommendations.total_recommendations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Sales</p>
                <p className="text-xl font-bold text-gray-900">
                  {recommendations.sales_trends?.total_recent_sales || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inventory Gaps</p>
                <p className="text-xl font-bold text-gray-900">
                  {recommendations.inventory_gaps?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(recommendations.analysis_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights - No Typing Animation */}
      {showContent && recommendations?.insights && recommendations.insights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600 animate-pulse" />
            <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
          </div>
          <div className="space-y-3">
            {recommendations.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device Recommendations */}
      {showContent && recommendations?.recommendations && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              Recommended Devices to Stock
            </h2>
            <p className="text-gray-600 mt-1">
              Devices ranked by AI analysis of market demand and sales trends
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {recommendations.recommendations.map((device, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {device.device}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(device.recommendation_score)}`}>
                        {getPriorityLabel(device.recommendation_score)}
                      </span>
                      <div className="flex items-center gap-1">
                        {getDemandIcon(device.market_demand)}
                        <span className="text-sm text-gray-600 capitalize">
                          {device.market_demand} Demand
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Brand:</span>
                        <span className="text-sm font-medium text-gray-900">{device.brand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium text-gray-900">{device.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Recommended Qty:</span>
                        <span className="text-sm font-bold text-green-600">{device.recommended_quantity} units</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{device.reason}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Profit Margin:</span>
                        <span className={`text-sm font-medium ${
                          device.profit_margin === 'high' ? 'text-green-600' :
                          device.profit_margin === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {device.profit_margin}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">AI Score:</span>
                        <span className="text-sm font-bold text-blue-600">
                          {device.recommendation_score}/5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Trends Summary */}
      {showContent && recommendations?.sales_trends && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          {recommendations.sales_trends.top_categories && Object.keys(recommendations.sales_trends.top_categories).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Top Selling Categories
              </h3>
              <div className="space-y-3">
                {Object.entries(recommendations.sales_trends.top_categories).slice(0, 5).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold text-gray-900">{formatNumber(count)} units</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Brands */}
          {recommendations.sales_trends.top_brands && Object.keys(recommendations.sales_trends.top_brands).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Top Selling Brands
              </h3>
              <div className="space-y-3">
                {Object.entries(recommendations.sales_trends.top_brands).slice(0, 5).map(([brand, count]) => (
                  <div key={brand} className="flex items-center justify-between">
                    <span className="text-gray-700">{brand}</span>
                    <span className="font-semibold text-gray-900">{formatNumber(count)} units</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Gaps */}
      {showContent && recommendations?.inventory_gaps && recommendations.inventory_gaps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Inventory Gaps Analysis
            </h2>
            <p className="text-gray-600 mt-1">
              Areas where your inventory doesn't match customer demand
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {recommendations.inventory_gaps.map((gap, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {gap.type === 'category_gap' ? `${gap.category} Category Gap` : `${gap.brand} Brand Gap`}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    gap.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {gap.priority} priority
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sales Volume:</span>
                    <span className="ml-2 font-medium text-gray-900">{gap.sales_volume} units</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Items:</span>
                    <span className="ml-2 font-medium text-gray-900">{gap.current_items}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};