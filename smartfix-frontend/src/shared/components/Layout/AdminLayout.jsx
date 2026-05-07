// src/shared/components/Layout/AdminLayout.jsx
import React from 'react';
import { AdminSidebar } from '../Navigation/AdminSidebar';

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};