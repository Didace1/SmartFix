// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegistrationForm } from './features/auth/components/RegistrationForm';
import { ForgotPassword } from './features/auth/components/ForgotPassword';
import { ResetPassword } from './features/auth/components/ResetPassword';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FaultDiagnosisPage } from './features/fault-diagnosis/FaultDiagnosisPage';
import { FailurePredictionPage } from './features/failure-prediction/FailurePredictionPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { SalesPage } from './features/sales/SalesPage';
import { SalesRepairPage } from './features/sales/SalesRepairPage';
import { RepairGuidePage } from './features/repair/RepairGuidePage';
import { CustomersPage } from './features/customers/CustomersPage';
import { TechniciansPage } from './features/technicians/TechniciansPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { SparePartRequestPage } from './features/spare-parts/SparePartRequestPage';
import { RepairTasksPage } from './features/repair-tasks/RepairTasksPage';
import { RoleBasedNavbar } from './shared/components/Navigation/RoleBasedNavbar';
import { RoleBasedRoute } from './routes/RoleBasedRoute';

const AppLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <RoleBasedNavbar />}
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes - Redirect to dashboard if authenticated */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard - Accessible by all roles */}
        <Route path="/dashboard" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician', 'manager', 'inventory', 'sales']}>
            <DashboardPage />
          </RoleBasedRoute>
        } />
        
        {/* Fault Diagnosis - Only admin and technician */}
        <Route path="/diagnosis" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician']}>
            <FaultDiagnosisPage />
          </RoleBasedRoute>
        } />
        
        {/* Failure Prediction - Admin and manager */}
        <Route path="/failure-prediction" element={
          <RoleBasedRoute allowedRoles={['admin', 'manager']}>
            <FailurePredictionPage />
          </RoleBasedRoute>
        } />

        {/* Spare Part Requests - Admin and technician */}
        <Route path="/spare-part-requests" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician']}>
            <SparePartRequestPage />
          </RoleBasedRoute>
        } />

        {/* Repair Tasks - Admin and technician */}
        <Route path="/my-repair-tasks" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician']}>
            <RepairTasksPage />
          </RoleBasedRoute>
        } />
        
        {/* Inventory - Admin, manager, inventory */}
        <Route path="/inventory" element={
          <RoleBasedRoute allowedRoles={['admin', 'manager', 'inventory']}>
            <InventoryPage />
          </RoleBasedRoute>
        } />
        
        {/* Sales - Admin and sales only */}
        <Route path="/sales" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            <SalesPage />
          </RoleBasedRoute>
        } />

        <Route path="/sales-repairs" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            <SalesRepairPage />
          </RoleBasedRoute>
        } />

        {/* Repair Guide - Admin only */}
        <Route path="/repair" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <RepairGuidePage />
          </RoleBasedRoute>
        } />

        {/* Customers - Admin and sales */}
        <Route path="/customers" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            <CustomersPage />
          </RoleBasedRoute>
        } />

        {/* Technicians - Admin and manager */}
        <Route path="/technicians" element={
          <RoleBasedRoute allowedRoles={['admin', 'manager']}>
            <TechniciansPage />
          </RoleBasedRoute>
        } />

        {/* Reports - Admin and manager */}
        <Route path="/reports" element={
          <RoleBasedRoute allowedRoles={['admin', 'manager']}>
            <ReportsPage />
          </RoleBasedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppLayout />
    </>
  );
}

export default App;