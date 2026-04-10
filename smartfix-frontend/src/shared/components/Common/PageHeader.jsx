import React from 'react';

export const PageHeader = ({ title, subtitle, rightSlot }) => (
  <div className="mb-8">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  </div>
);
