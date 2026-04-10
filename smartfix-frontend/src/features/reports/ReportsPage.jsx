import React, { useEffect, useState } from 'react';

export const ReportsPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/reports/summary`);
        const data = await response.json();
        setSummary(response.ok ? data : null);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics</h1>
        <p className="text-gray-600 mt-2">Live operational report data from backend.</p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading report summary...</p>
        ) : !summary ? (
          <p className="mt-6 text-gray-500">Unable to load report data.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{summary.totalUsers}</p></div>
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Total Sales Count</p><p className="text-2xl font-bold">{summary.totalSalesCount}</p></div>
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold">${Number(summary.totalRevenue || 0).toFixed(2)}</p></div>
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Inventory Value</p><p className="text-2xl font-bold">${Number(summary.inventoryValue || 0).toFixed(2)}</p></div>
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Inventory Items</p><p className="text-2xl font-bold">{summary.inventoryCount}</p></div>
            <div className="border rounded-lg p-4"><p className="text-sm text-gray-500">Low Stock Count</p><p className="text-2xl font-bold">{summary.lowStockCount}</p></div>
          </div>
        )}
      </div>
    </div>
  );
};
