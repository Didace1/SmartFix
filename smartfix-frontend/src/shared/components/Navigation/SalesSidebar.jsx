// src/shared/components/Navigation/SalesSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingCart,
  Scan,
  History,
  Users,
  Bell,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  TrendingUp
} from 'lucide-react';

export const SalesSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [expandedSections, setExpandedSections] = useState({
    sales: true,
    customers: false,
    reports: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  const navigationGroups = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      single: true
    },
    {
      id: 'sales',
      title: 'Sales Operations',
      icon: ShoppingCart,
      expanded: expandedSections.sales,
      items: [
        { path: '/sales', label: 'Point of Sale', icon: DollarSign },
        { path: '/sales-history', label: 'Sales History', icon: History },
        { path: '/sales-repairs', label: 'Sales & Repairs', icon: FileText }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: Users,
      expanded: expandedSections.customers,
      items: [
        { path: '/customers', label: 'Customer Database', icon: Users }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: TrendingUp,
      expanded: expandedSections.reports,
      items: [
        { path: '/sales/reports', label: 'Sales Reports', icon: FileText },
        { path: '/notifications', label: 'Notifications', icon: Bell }
      ]
    }
  ];

  return (
    <div className="w-64 bg-blue-600 text-white h-screen flex flex-col shadow-lg border-r border-blue-700">
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SmartFix</h1>
            <p className="text-xs text-blue-200">Sales Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.firstName?.charAt(0) || 'S'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-blue-200 truncate">Sales Representative</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navigationGroups.map((group) => {
            if (group.single) {
              const Icon = group.icon;
              return (
                <Link
                  key={group.id}
                  to={group.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(group.path)
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {group.title}
                </Link>
              );
            }

            const Icon = group.icon;
            const isGroupActive = isParentActive(group.items.map(item => item.path));

            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isGroupActive
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {group.title}
                  </div>
                  {group.expanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {group.expanded && (
                  <div className="ml-6 space-y-1">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(item.path)
                              ? 'bg-blue-500 text-white'
                              : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                          }`}
                        >
                          <ItemIcon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <div className="text-xs text-blue-200 text-center">
          <p>SmartFix Sales v1.0</p>
          <p className="mt-1">© 2024 Corex Ltd</p>
        </div>
      </div>
    </div>
  );
};