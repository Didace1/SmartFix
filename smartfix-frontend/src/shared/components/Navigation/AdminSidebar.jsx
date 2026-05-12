// src/shared/components/Navigation/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard, 
  Search, 
  Wrench,
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings, 
  UserCheck, 
  Tags, 
  FileText,
  Clock, 
  TrendingUp, 
  Zap,
  User,
  AlertTriangle,
  Bell,
  QrCode
} from 'lucide-react';

export const AdminSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedGroups, setExpandedGroups] = useState({
    repairs: true,
    inventory: true,
    sales: true,
    management: true
  });

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  const navigationGroups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { 
          path: '/dashboard', 
          label: 'Dashboard', 
          icon: LayoutDashboard,
          description: 'Overview & Analytics'
        },
        { 
          path: '/diagnosis', 
          label: 'Fault Diagnosis', 
          icon: Search,
          description: 'AI-Powered Diagnostics'
        },
        { 
          path: '/failure-prediction', 
          label: 'Failure Prediction', 
          icon: Zap,
          description: 'Predictive Analytics'
        }
      ]
    },
    {
      id: 'repairs',
      label: 'Repair Management',
      icon: Wrench,
      expandable: true,
      paths: ['/technicians', '/repair-analytics', '/repair-history', '/spare-part-requests', '/my-repair-tasks'],
      items: [
        { 
          path: '/my-repair-tasks', 
          label: 'Active Tasks', 
          icon: Clock,
          description: 'Current repair tasks'
        },
        { 
          path: '/repair-history', 
          label: 'Repair History', 
          icon: FileText,
          description: 'Complete repair records'
        },
        { 
          path: '/repair-analytics', 
          label: 'Analytics', 
          icon: TrendingUp,
          description: 'Performance metrics'
        },
        { 
          path: '/technicians', 
          label: 'Technicians', 
          icon: User,
          description: 'Manage technicians'
        },
        { 
          path: '/spare-part-requests', 
          label: 'Spare Parts', 
          icon: Package,
          description: 'Parts requests'
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory Control',
      icon: Package,
      expandable: true,
      paths: ['/inventory'],
      items: [
        { 
          path: '/inventory', 
          label: 'Manage Stock', 
          icon: Package,
          description: 'Add & edit inventory'
        },
        { 
          path: '/inventory/stock-alerts', 
          label: 'Stock Alerts', 
          icon: AlertTriangle,
          description: 'Low stock notifications'
        },
        { 
          path: '/inventory/view', 
          label: 'View Stock', 
          icon: FileText,
          description: 'Browse inventory'
        },
        { 
          path: '/inventory/qrcodes', 
          label: 'QR Codes', 
          icon: QrCode,
          description: 'Manage QR codes'
        }
      ]
    },
    {
      id: 'sales',
      label: 'Sales Operations',
      icon: ShoppingCart,
      expandable: true,
      paths: ['/sales', '/customers'],
      items: [
        { 
          path: '/sales', 
          label: 'Point of Sale', 
          icon: ShoppingCart,
          description: 'Process sales'
        },
        { 
          path: '/sales-history', 
          label: 'Sales History', 
          icon: FileText,
          description: 'Transaction records'
        },
        { 
          path: '/sales-analytics', 
          label: 'Sales Analytics', 
          icon: BarChart3,
          description: 'Revenue insights'
        },
        { 
          path: '/sales-repairs', 
          label: 'Sales Repairs', 
          icon: Wrench,
          description: 'Repair coordination'
        },
        { 
          path: '/customers', 
          label: 'Customers', 
          icon: Users,
          description: 'Customer management'
        }
      ]
    },
    {
      id: 'management',
      label: 'System Management',
      icon: Settings,
      expandable: true,
      paths: ['/admin', '/reports', '/notifications'],
      items: [
        { 
          path: '/admin/users', 
          label: 'User Management', 
          icon: Users,
          description: 'Manage system users'
        },
        { 
          path: '/admin/pending-users', 
          label: 'User Approvals', 
          icon: UserCheck,
          description: 'Approve new accounts'
        },
        { 
          path: '/admin/categories', 
          label: 'Categories', 
          icon: Tags,
          description: 'Product categories'
        },
        { 
          path: '/reports', 
          label: 'Reports', 
          icon: BarChart3,
          description: 'Business reports'
        },
        { 
          path: '/notifications', 
          label: 'Notifications', 
          icon: Bell,
          description: 'System alerts'
        }
      ]
    }
  ];

  return (
    <div className="w-64 bg-blue-600 shadow-lg border-r border-blue-700 flex flex-col h-full text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center px-3 py-1 rounded-lg" style={{ backgroundColor: '#fff' }}>
            <span style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '0.06em', fontSize: '1.1rem', color: '#2563eb', fontWeight: 900 }}>
              COREX
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold bg-orange-600 text-white px-2 py-0.5 rounded-full tracking-wide">
              AI-POWERED
            </span>
            <span className="text-xs text-blue-200 mt-0.5">Admin Panel</span>
          </div>
        </div>
      </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigationGroups.map((group) => (
              <div key={group.id} className="mb-4">
                {group.expandable ? (
                  <>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isGroupActive(group.paths) 
                          ? 'bg-blue-500 text-white border border-blue-400' 
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <group.icon className="w-4 h-4" />
                        <span>{group.label}</span>
                      </div>
                      {expandedGroups[group.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedGroups[group.id] && (
                      <div className="mt-2 ml-4 space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(item.path)
                                ? 'bg-blue-500 text-white shadow-sm font-semibold'
                                : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              <div className="flex flex-col">
                                <span className="font-medium">{item.label}</span>
                                <span className={`text-xs ${isActive(item.path) ? 'text-blue-400' : 'text-blue-100'}`}>
                                  {item.description}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-500 text-white shadow-sm font-semibold'
                            : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span className={`text-xs ${isActive(item.path) ? 'text-blue-400' : 'text-blue-100'}`}>
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          {/* Quick Links */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
    </div>
  );
};