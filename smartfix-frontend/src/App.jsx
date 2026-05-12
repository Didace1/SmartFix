// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegistrationForm } from './features/auth/components/RegistrationForm';
import { ForgotPassword } from './features/auth/components/ForgotPassword';
import { ResetPassword } from './features/auth/components/ResetPassword';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FailurePredictionPage } from './features/failure-prediction/FailurePredictionPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { StockAlertsPage } from './features/inventory/StockAlertsPage';
import { StockViewPage } from './features/inventory/StockViewPage';
import { AIRecommendationsPage } from './features/inventory/AIRecommendationsPage';
import { QRCodeManagementPage } from './features/inventory/QRCodeManagementPage';
import { InventoryReportsPage } from './features/inventory/InventoryReportsPage';
import { SalesPage } from './features/sales/SalesPage';
import { SalesRepairPage } from './features/sales/SalesRepairPage';
import { SalesAnalyticsPage } from './features/sales/SalesAnalyticsPage';
import { SalesHistoryPage } from './features/sales/SalesHistoryPage';
import { SalesReportsPage } from './features/sales/SalesReportsPage';
import { RepairGuidePage } from './features/repair/RepairGuidePage';
import { CustomersPage } from './features/customers/CustomersPage';
import { TechniciansPage } from './features/technicians/TechniciansPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { SparePartRequestPage } from './features/spare-parts/SparePartRequestPage';
import { RepairTasksPage } from './features/repair-tasks/RepairTasksPage';
import { RepairAnalyticsPage } from './features/repair-tasks/RepairAnalyticsPage';
import { RepairHistoryPage } from './features/repair-tasks/RepairHistoryPage';
import { RoleBasedNavbar } from './shared/components/Navigation/RoleBasedNavbar';
import { AdminLayout } from './shared/components/Layout/AdminLayout';
import { InventoryLayout } from './shared/components/Layout/InventoryLayout';
import { SalesLayout } from './shared/components/Layout/SalesLayout';
import { TechnicianLayout } from './shared/layouts/TechnicianLayout';
import { RoleBasedRoute } from './routes/RoleBasedRoute';
import { LandingPage } from './features/public/LandingPage';
import { TermsPage } from './features/legal/TermsPage';
import { PrivacyPolicyPage } from './features/legal/PrivacyPolicyPage';
import { PendingUsersPage } from './features/admin/PendingUsersPage';
import { UsersPage } from './features/admin/UsersPage';
import { CategoryManagementPage } from './features/admin/CategoryManagementPage';
import { QRCodeTest } from './features/test/QRCodeTest';

const AppLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Public routes that don't need system layout
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/terms', '/privacy', '/test/qrcode'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Check if user is admin, inventory, sales, or technician
  const isAdmin = user?.role === 'admin';
  const isInventory = user?.role === 'inventory';
  const isSales = user?.role === 'sales';
  const isTechnician = user?.role === 'technician';
  
  return (
    <div className={isPublicRoute ? "" : "min-h-screen bg-gray-50"}>
      {/* Show navbar only for non-admin, non-inventory, non-sales, non-technician authenticated users on non-public routes */}
      {isAuthenticated && !isPublicRoute && !isAdmin && !isInventory && !isSales && !isTechnician && <RoleBasedNavbar />}
      
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes - No authentication required */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        
        {/* Admin Routes with Sidebar Layout */}
        <Route path="/admin/pending-users" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <PendingUsersPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />
        <Route path="/admin/users" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />
        <Route path="/admin/categories" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <CategoryManagementPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />
        
        {/* Protected Routes - Redirect to dashboard if authenticated */}
        <Route path="/staff" element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard - Admin gets sidebar layout, inventory gets inventory layout, sales gets sales layout, technician gets technician layout */}
        <Route path="/dashboard" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician', 'inventory', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            ) : isInventory ? (
              <InventoryLayout>
                <DashboardPage />
              </InventoryLayout>
            ) : isSales ? (
              <SalesLayout>
                <DashboardPage />
              </SalesLayout>
            ) : isTechnician ? (
              <TechnicianLayout>
                <DashboardPage />
              </TechnicianLayout>
            ) : (
              <DashboardPage />
            )}
          </RoleBasedRoute>
        } />
        
        {/* Failure Prediction - Admin only with sidebar */}
        <Route path="/failure-prediction" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <FailurePredictionPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Diagnosis - Admin gets sidebar, technician gets technician layout */}
        <Route path="/diagnosis" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician']}>
            {isAdmin ? (
              <AdminLayout>
                {/* We need to create or import DiagnosisPage */}
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Fault Diagnosis</h1>
                  <p className="text-gray-600 mt-2">AI-powered device fault diagnosis system.</p>
                </div>
              </AdminLayout>
            ) : (
              <TechnicianLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Fault Diagnosis</h1>
                  <p className="text-gray-600 mt-2">AI-powered device fault diagnosis system.</p>
                </div>
              </TechnicianLayout>
            )}
          </RoleBasedRoute>
        } />

        {/* Spare Part Requests - Admin only with sidebar */}
        <Route path="/spare-part-requests" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <SparePartRequestPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Repair Tasks - Admin gets sidebar, technician gets technician layout */}
        <Route path="/my-repair-tasks" element={
          <RoleBasedRoute allowedRoles={['admin', 'technician']}>
            {isAdmin ? (
              <AdminLayout>
                <RepairTasksPage />
              </AdminLayout>
            ) : (
              <TechnicianLayout>
                <RepairTasksPage />
              </TechnicianLayout>
            )}
          </RoleBasedRoute>
        } />
        
        <Route path="/repair-analytics" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <RepairAnalyticsPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        <Route path="/repair-history" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <RepairHistoryPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Inventory - Admin gets admin sidebar, inventory gets inventory sidebar */}
        <Route path="/inventory" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <InventoryPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <InventoryPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />
        <Route path="/inventory/stock-alerts" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <StockAlertsPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <StockAlertsPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />
        <Route path="/inventory/view" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <StockViewPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <StockViewPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />
        <Route path="/inventory/ai-recommendations" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <AIRecommendationsPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <AIRecommendationsPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />
        <Route path="/inventory/qrcodes" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <QRCodeManagementPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <QRCodeManagementPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />

        <Route path="/inventory/reports" element={
          <RoleBasedRoute allowedRoles={['admin', 'inventory']}>
            {isAdmin ? (
              <AdminLayout>
                <InventoryReportsPage />
              </AdminLayout>
            ) : (
              <InventoryLayout>
                <InventoryReportsPage />
              </InventoryLayout>
            )}
          </RoleBasedRoute>
        } />
        
        {/* Sales - Admin gets sidebar, sales role gets sales layout */}
        <Route path="/sales" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <SalesPage />
              </AdminLayout>
            ) : (
              <SalesLayout>
                <SalesPage />
              </SalesLayout>
            )}
          </RoleBasedRoute>
        } />

        <Route path="/sales-repairs" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <SalesRepairPage />
              </AdminLayout>
            ) : (
              <SalesLayout>
                <SalesRepairPage />
              </SalesLayout>
            )}
          </RoleBasedRoute>
        } />

        <Route path="/sales-analytics" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <SalesAnalyticsPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        <Route path="/sales-history" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <SalesHistoryPage />
              </AdminLayout>
            ) : (
              <SalesLayout>
                <SalesHistoryPage />
              </SalesLayout>
            )}
          </RoleBasedRoute>
        } />

        <Route path="/sales/reports" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <SalesReportsPage />
              </AdminLayout>
            ) : (
              <SalesLayout>
                <SalesReportsPage />
              </SalesLayout>
            )}
          </RoleBasedRoute>
        } />

        {/* Repair Guide - Admin only with sidebar */}
        <Route path="/repair" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <RepairGuidePage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Customers - Admin gets sidebar, sales gets sales layout */}
        <Route path="/customers" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales']}>
            {isAdmin ? (
              <AdminLayout>
                <CustomersPage />
              </AdminLayout>
            ) : (
              <SalesLayout>
                <CustomersPage />
              </SalesLayout>
            )}
          </RoleBasedRoute>
        } />

        {/* Technicians - Admin only with sidebar */}
        <Route path="/technicians" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <TechniciansPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Reports - Admin only with sidebar */}
        <Route path="/reports" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <ReportsPage />
            </AdminLayout>
          </RoleBasedRoute>
        } />

        {/* Notifications - Admin gets admin sidebar, inventory gets inventory sidebar, sales gets sales sidebar, technician gets technician sidebar */}
        <Route path="/notifications" element={
          <RoleBasedRoute allowedRoles={['admin', 'sales', 'inventory', 'technician']}>
            {isAdmin ? (
              <AdminLayout>
                <NotificationsPage />
              </AdminLayout>
            ) : isInventory ? (
              <InventoryLayout>
                <NotificationsPage />
              </InventoryLayout>
            ) : isSales ? (
              <SalesLayout>
                <NotificationsPage />
              </SalesLayout>
            ) : isTechnician ? (
              <TechnicianLayout>
                <NotificationsPage />
              </TechnicianLayout>
            ) : (
              <NotificationsPage />
            )}
          </RoleBasedRoute>
        } />

        {/* Test Routes - For development and testing */}
        <Route path="/test/qrcode" element={<QRCodeTest />} />
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