// src/features/dashboard/components/AdminDashboard.jsx
import React from 'react';
import { Users, Package, DollarSign, TrendingUp, Shield, Activity } from 'lucide-react';

export const AdminDashboard = ({ stats }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeUsers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">{stats.systemUptime}</p>
            </div>
            <Activity className="w-8 h-8 text-green-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Security Score</p>
              <p className="text-2xl font-bold text-blue-600">98%</p>
            </div>
            <Shield className="w-8 h-8 text-blue-300" />
          </div>
        </div>
      </div>
      
      {/* Admin-specific content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">System Administration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
            Manage Users & Roles
          </button>
          <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
            System Configuration
          </button>
          <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
            Audit Logs
          </button>
          <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
            Backup & Recovery
          </button>
        </div>
      </div>
    </div>
  );
};