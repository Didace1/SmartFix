// src/features/dashboard/components/SalesDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, Target, Award, Calendar, Wrench } from 'lucide-react';

export const SalesDashboard = ({ stats }) => {
  const progress = (stats.salesToday / stats.dailyTarget) * 100;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sales Today</p>
              <p className="text-2xl font-bold text-green-600">${stats.salesToday}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Weekly Sales</p>
              <p className="text-2xl font-bold text-blue-600">${stats.weeklySales}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Customers Today</p>
              <p className="text-2xl font-bold text-purple-600">{stats.customerCount}</p>
            </div>
            <Users className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</p>
            </div>
            <Target className="w-8 h-8 text-orange-300" />
          </div>
        </div>
      </div>
      
      {/* Daily Target Progress */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Daily Target Progress</h3>
          <span className="text-sm text-gray-500">Target: ${stats.dailyTarget}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress}% completed</p>
      </div>
      
      {/* Top Product */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Award className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Top Selling Product</p>
            <p className="text-xl font-bold text-gray-900">{stats.topProduct}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/sales" className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
          <DollarSign className="w-5 h-5 mr-2" />
          New Sale
        </Link>
        <Link to="/sales-repairs" className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center">
          <Wrench className="w-5 h-5 mr-2" />
          Repair Intake
        </Link>
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
          <Calendar className="w-5 h-5 mr-2" />
          View Appointments
        </button>
      </div>
    </div>
  );
};