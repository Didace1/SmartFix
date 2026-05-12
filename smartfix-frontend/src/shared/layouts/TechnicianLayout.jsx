import React from 'react';
import { TechnicianSidebar } from '../components/Navigation/TechnicianSidebar';

export const TechnicianLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <TechnicianSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
