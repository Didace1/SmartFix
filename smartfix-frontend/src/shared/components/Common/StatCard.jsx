import React from 'react';

export const StatCard = ({ label, value, accent = 'text-blue-600', icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      </div>
      {icon && <div className="text-gray-300">{icon}</div>}
    </div>
  </div>
);
