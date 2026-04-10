// src/features/failure-prediction/FailurePredictionPage.jsx
import React, { useState, useEffect } from 'react';
import { ComponentHealthCard } from './components/ComponentHealthCard';
import { PredictionMetrics } from './components/PredictionMetrics';
import { FailureTrendsChart } from './components/FailureTrendsChart';
import { AlertList } from './components/AlertList';
import { ComponentDetailsModal } from './components/ComponentDetailsModal';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

export const FailurePredictionPage = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [metrics, setMetrics] = useState({
    accuracy: 87,
    accuracyChange: 5,
    componentsAtRisk: 12,
    riskChange: -3,
    avgRemainingLife: 45,
    lifeChange: -8,
    preventiveActions: 7,
    actionsChange: 2
  });
  const [alerts, setAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictionData();
  }, []);

  useEffect(() => {
    filterComponents();
  }, [components, filterRisk, searchTerm]);

  const fetchPredictionData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock component data
      const mockComponents = [
        {
          id: 1,
          name: 'Battery',
          type: 'battery',
          deviceModel: 'Dell XPS 15',
          serialNumber: 'BAT-2024-001',
          healthScore: 72,
          riskLevel: 'medium',
          remainingLife: 120,
          expectedLife: 365,
          failureProbability: 28,
          predictedIssue: 'Capacity degradation below 80%',
          lastMaintenance: '2024-01-15',
          maintenanceHistory: [
            { date: '2024-01-15', action: 'Battery calibration', result: 'Improved' }
          ]
        },
        {
          id: 2,
          name: 'SSD Storage',
          type: 'storage',
          deviceModel: 'MacBook Pro 2023',
          healthScore: 45,
          riskLevel: 'high',
          remainingLife: 60,
          expectedLife: 730,
          failureProbability: 65,
          predictedIssue: 'S.M.A.R.T. errors detected',
          lastMaintenance: '2024-02-01'
        },
        {
          id: 3,
          name: 'Cooling Fan',
          type: 'fan',
          deviceModel: 'HP Spectre',
          healthScore: 88,
          riskLevel: 'low',
          remainingLife: 200,
          expectedLife: 365,
          failureProbability: 12,
          predictedIssue: 'Normal wear',
          lastMaintenance: '2024-01-20'
        },
        {
          id: 4,
          name: 'Motherboard',
          type: 'motherboard',
          deviceModel: 'Lenovo ThinkPad',
          healthScore: 35,
          riskLevel: 'critical',
          remainingLife: 15,
          expectedLife: 1095,
          failureProbability: 82,
          predictedIssue: 'Capacitor failure imminent',
          lastMaintenance: '2023-12-10'
        },
        {
          id: 5,
          name: 'RAM Module',
          type: 'ram',
          deviceModel: 'Custom PC',
          healthScore: 92,
          riskLevel: 'low',
          remainingLife: 300,
          expectedLife: 730,
          failureProbability: 8,
          predictedIssue: 'No issues detected',
          lastMaintenance: '2024-02-10'
        },
        {
          id: 6,
          name: 'Power Supply',
          type: 'power_supply',
          deviceModel: 'Desktop PC',
          healthScore: 55,
          riskLevel: 'medium',
          remainingLife: 90,
          expectedLife: 730,
          failureProbability: 45,
          predictedIssue: 'Voltage fluctuations',
          lastMaintenance: '2024-01-05'
        }
      ];
      
      setComponents(mockComponents);
      
      // Mock alerts
      const mockAlerts = [
        {
          id: 1,
          title: 'Critical Motherboard Failure Risk',
          message: 'Motherboard in Lenovo ThinkPad showing 82% failure probability. Immediate action required.',
          severity: 'critical',
          timestamp: new Date().toISOString(),
          componentId: 4
        },
        {
          id: 2,
          title: 'SSD Health Degrading Rapidly',
          message: 'MacBook Pro SSD health at 45%. Backup data and plan replacement within 60 days.',
          severity: 'high',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          componentId: 2
        },
        {
          id: 3,
          title: 'Power Supply Instability',
          message: 'Desktop PC power supply showing voltage fluctuations. Consider replacement within 90 days.',
          severity: 'medium',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          componentId: 6
        }
      ];
      setAlerts(mockAlerts);
      
      // Mock trend data
      const mockTrendData = [
        { label: 'Jan', value: 15, isPrediction: false },
        { label: 'Feb', value: 18, isPrediction: false },
        { label: 'Mar', value: 22, isPrediction: false },
        { label: 'Apr', value: 25, isPrediction: false },
        { label: 'May', value: 30, isPrediction: true },
        { label: 'Jun', value: 35, isPrediction: true },
        { label: 'Jul', value: 42, isPrediction: true }
      ];
      setTrendData(mockTrendData);
      
      setLoading(false);
    }, 1500);
  };

  const filterComponents = () => {
    let filtered = [...components];
    
    if (filterRisk !== 'all') {
      filtered = filtered.filter(c => c.riskLevel === filterRisk);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.deviceModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredComponents(filtered);
  };

  const handleViewDetails = (component) => {
    setSelectedComponent(component);
    setShowModal(true);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  const handleViewAction = (alert) => {
    const component = components.find(c => c.id === alert.componentId);
    if (component) {
      handleViewDetails(component);
    }
  };

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      components: filteredComponents,
      alerts
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `failure_prediction_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskCount = (risk) => {
    return components.filter(c => c.riskLevel === risk).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing component health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Component Failure Prediction</h1>
        <p className="text-gray-600 mt-2">AI-powered predictive analytics for component health monitoring</p>
      </div>

      {/* Metrics */}
      <PredictionMetrics metrics={metrics} />

      {/* Filters and Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterRisk === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({components.length})
          </button>
          <button
            onClick={() => setFilterRisk('critical')}
            className={`px-4 py-2 rounded-lg transition ${
              filterRisk === 'critical' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Critical ({getRiskCount('critical')})
          </button>
          <button
            onClick={() => setFilterRisk('high')}
            className={`px-4 py-2 rounded-lg transition ${
              filterRisk === 'high' 
                ? 'bg-orange-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            High ({getRiskCount('high')})
          </button>
          <button
            onClick={() => setFilterRisk('medium')}
            className={`px-4 py-2 rounded-lg transition ${
              filterRisk === 'medium' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Medium ({getRiskCount('medium')})
          </button>
          <button
            onClick={() => setFilterRisk('low')}
            className={`px-4 py-2 rounded-lg transition ${
              filterRisk === 'low' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Low ({getRiskCount('low')})
          </button>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button
            onClick={fetchPredictionData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <FailureTrendsChart data={trendData} />
        </div>
        <div>
          <AlertList 
            alerts={alerts} 
            onDismiss={handleDismissAlert}
            onViewAction={handleViewAction}
          />
        </div>
      </div>

      {/* Components Grid */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Health Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentHealthCard
              key={component.id}
              component={component}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        {filteredComponents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No components found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Component Details Modal */}
      {showModal && selectedComponent && (
        <ComponentDetailsModal
          component={selectedComponent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};