import React from 'react';

export const EmptyState = ({ title, description }) => (
  <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
    <p className="text-lg font-medium text-gray-700">{title}</p>
    {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
  </div>
);
