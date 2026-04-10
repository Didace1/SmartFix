// src/features/dashboard/components/InventoryDashboard.jsx
import React from 'react';
import { Package, AlertCircle, TrendingUp, ShoppingCart, PlusCircle } from 'lucide-react';

export const InventoryDashboard = ({ stats }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Parts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalParts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalValue}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-orange-300" />
          </div>
        </div>
      </div>
      
      {/* Top Category */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Category</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.topCategory}</p>
        <p className="text-gray-500 text-sm mt-1">Highest selling category this month</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Stock
        </button>
        <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Create Purchase Order
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center">
          <Package className="w-5 h-5 mr-2" />
          Stock Take
        </button>
      </div>
    </div>
  );
};