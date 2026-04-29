// src/features/dashboard/components/InventoryDashboard.jsx
import React from 'react';
import { Package, AlertCircle, TrendingUp, ShoppingCart, PlusCircle, Eye, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../../shared/components/Common/StatCard';

export const InventoryDashboard = ({ stats }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Stock Items"   value={stats.totalParts}   accent="text-blue-600"   icon={<Package className="w-5 h-5" />} />
        <StatCard label="Low Stock Alerts"    value={stats.lowStockItems} accent="text-red-600"    icon={<AlertCircle className="w-5 h-5" />} subtitle={stats.lowStockItems > 0 ? 'Needs attention' : 'All good'} />
        <StatCard label="Total Stock Value"   value={`$${stats.totalValue}`} accent="text-green-600"  icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard label="Pending Orders"      value={stats.pendingOrders} accent="text-orange-600" icon={<ShoppingCart className="w-5 h-5" />} />
      </div>

      {/* Top Category */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Stock Category</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{stats.topCategory || '—'}</p>
          <p className="text-xs text-gray-400 mt-0.5">Key category to monitor for stock availability</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Add Stock',          icon: <PlusCircle className="w-5 h-5" />, color: 'bg-blue-600 hover:bg-blue-700',   onClick: () => navigate('/inventory?addStock=1') },
          { label: 'Purchase Order',     icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-emerald-600 hover:bg-emerald-700', onClick: () => {} },
          { label: 'Stock Alerts',       icon: <AlertCircle className="w-5 h-5" />, color: 'bg-amber-500 hover:bg-amber-600',  onClick: () => navigate('/inventory/stock-alerts') },
          { label: 'View Stock',         icon: <Eye className="w-5 h-5" />,          color: 'bg-gray-700 hover:bg-gray-800',   onClick: () => navigate('/inventory/view') },
        ].map(({ label, icon, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`${color} text-white rounded-xl p-4 flex flex-col items-center gap-2 text-sm font-medium transition-colors shadow-sm hover:shadow`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
