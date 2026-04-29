// src/features/dashboard/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SummaryCards } from './components/SummaryCards';

import { AdminDashboard } from './components/AdminDashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { InventoryDashboard } from './components/InventoryDashboard';
import { SalesDashboard } from './components/SalesDashboard';
import { ROLE_DASHBOARD_CONFIG } from '../../constants/defaultUsers';
import { PageHeader } from '../../shared/components/Common/PageHeader';

export const DashboardPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      try {
        const [summaryRes, reportRes, techRes] = await Promise.all([
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/dashboard/summary`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/reports/summary`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/technicians`)
        ]);
        const summary = await summaryRes.json();
        const reports = await reportRes.json();
        const technicians = techRes.ok ? await techRes.json() : [];

        const roleStats = {
          pendingRepairs:   Number(summary.pendingRepairs   || 0),
          activeRepairs:    Number(summary.activeRepairs    || 0),
          completedRepairs: Number(summary.completedRepairs || 0),
          totalRepairs:     Number(summary.totalRepairs     || 0),
          completedToday: Number(summary.salesToday || 0),
          revenueToday: Number(summary.revenueToday || 0),
          myTasks: 0,
          activeUsers: Number(summary.users || 0),
          systemUptime: '99.9%',
          monthlyRevenue: Number(reports.totalRevenue || 0),
          technicianUtilization: technicians.length > 0 ? 78 : 0,
          customerSatisfaction: 4.2,
          costReduction: 12,
          totalParts: Number(summary.inventoryItems || 0),
          lowStockItems: Number(summary.lowStockItems || 0),
          totalValue: Number(reports.inventoryValue || 0),
          pendingOrders: 0,
          topCategory: Object.keys(reports.categoryDistribution || {})[0] || 'N/A',
          salesToday: Number(summary.revenueToday || 0),
          dailyTarget: 1500,
          weeklySales: Number(summary.revenueToday || 0) * 5,
          customerCount: Number(summary.salesToday || 0),
          conversionRate: 68,
          topProduct: 'Laptop Battery',
          successRate: 92,
          urgentTasks: Number(summary.lowStockItems || 0),
          nextTask: 'Review pending technical jobs'
        };
        setStats(roleStats);
      } catch {
        setStats({
          pendingRepairs: 0,
          completedToday: 0,
          revenueToday: 0,
          myTasks: 0
        });
      } finally {
        const roleConfig = ROLE_DASHBOARD_CONFIG[user.role] || ROLE_DASHBOARD_CONFIG.admin;
        setConfig(roleConfig);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const renderRoleSpecificDashboard = () => {
    if (!stats) return null;
    
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard stats={stats} />;
      case 'technician':
        return <TechnicianDashboard stats={stats} />;
      case 'inventory':
        return <InventoryDashboard stats={stats} />;
      case 'sales':
        return <SalesDashboard stats={stats} />;
      default:
        return <SummaryCards stats={stats} userRole={user?.role} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title={`Welcome back, ${user?.fullName || 'User'}`}
        subtitle={config?.welcomeMessage || `${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard`}
      />

      {/* Role-specific dashboard content */}
      {renderRoleSpecificDashboard()}
      
    </div>
  );
};