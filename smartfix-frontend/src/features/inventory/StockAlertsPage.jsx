// src/features/inventory/StockAlertsPage.jsx
import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const StockAlertsPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`);
        const data = await res.json();
        if (res.ok) {
          setItems(data.filter(i => i.quantity <= i.reorderPoint));
        } else {
          toast.error(data?.message || 'Failed to load inventory');
        }
      } catch {
        toast.error('System backend not reachable for inventory');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [SYSTEM_BACKEND_BASE_URL]);

  const names = items.map(i => i.name).join(', ');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-yellow-800 mb-2">Low Stock Alert</h1>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : items.length > 0 ? (
              <p className="text-gray-700">The following items are below reorder point: {names}</p>
            ) : (
              <p className="text-gray-700">No items are currently below the reorder point.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
