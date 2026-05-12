import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard, 
  Package, 
  AlertTriangle,
  FileText,
  Bell,
  Settings,
  Eye,
  Plus,
  Brain,
  BarChart3,
  QrCode
} from 'lucide-react';

export const InventorySidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedGroups, setExpandedGroups] = useState({
    inventory: true,
    reports: true
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
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
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
          icon: Eye,
          description: 'Browse inventory'
        },
        { 
          path: '/inventory/ai-recommendations', 
          label: 'AI Recommendations', 
          icon: Brain,
          description: 'Smart stocking suggestions'
        },
        { 
          path: '/inventory/qrcodes', 
          label: 'QR Code Management', 
          icon: QrCode,
          description: 'Manage product QR codes'
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: FileText,
      expandable: true,
      paths: ['/inventory/reports', '/notifications'],
      items: [
        { 
          path: '/inventory/reports', 
          label: 'Inventory Reports', 
          icon: BarChart3,
          description: 'Stock analytics & insights'
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
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center px-3 py-1 rounded-lg" style={{ backgroundColor: '#fff' }}>
            <span style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '0.06em', fontSize: '1.1rem', color: '#2563eb', fontWeight: 900 }}>
              COREX
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold bg-orange-600 text-white px-2 py-0.5 rounded-full tracking-wide">
              INVENTORY
            </span>
            <span className="text-xs text-blue-200 mt-0.5">Manager Panel</span>
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
                              <span className={`text-xs ${isActive(item.path) ? 'text-blue-100' : 'text-blue-200'}`}>
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
                        <span className={`text-xs ${isActive(item.path) ? 'text-blue-100' : 'text-blue-200'}`}>
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
            onClick={() => navigate('/inventory?addStock=1')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
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