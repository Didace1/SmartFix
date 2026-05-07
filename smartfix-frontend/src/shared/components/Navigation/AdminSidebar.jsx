// src/shared/components/Navigation/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Bell, AlertTriangle, CheckCircle2, PackageCheck, 
  ChevronDown, ChevronRight, LogOut, User,
  LayoutDashboard, Search, Wrench, AlertCircle,
  Package, ShoppingCart, Users, BarChart3,
  Settings, UserCheck, Tags, FileText,
  Clock, TrendingUp, Zap
} from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';

export const AdminSidebar = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedGroups, setExpandedGroups] = useState({
    repairs: true,
    inventory: true,
    sales: true,
    management: true
  });
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load admin notifications
  useEffect(() => {
    const loadAdminNotifications = async () => {
      try {
        const [inventoryRes, repairRes, pendingRes] = await Promise.all([
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/repair-tasks`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/auth/pending`)
        ]);
        
        const inventory = inventoryRes.ok ? await inventoryRes.json() : [];
        const repairTasks = repairRes.ok ? await repairRes.json() : [];
        const pendingUsers = pendingRes.ok ? await pendingRes.json() : [];
        const notifications = [];
        
        if (pendingUsers.length > 0) {
          notifications.push({ 
            id: 'admin-pending-users', 
            type: 'pending-users', 
            title: `${pendingUsers.length} account${pendingUsers.length > 1 ? 's' : ''} pending approval`, 
            detail: 'New user registrations require your approval before they can log in.', 
            actionPath: '/admin/pending-users' 
          });
        }
        
        inventory.forEach((item) => {
          const qty = Number(item.quantity || 0);
          const reorder = Number(item.reorderPoint || 0);
          if (qty === 0) {
            notifications.push({ 
              id: `admin-stockout-${item.id}`, 
              type: 'stockout', 
              title: `${item.name} is out of stock`, 
              detail: 'Urgent: replenishment needed.', 
              actionPath: '/inventory' 
            });
          } else if (qty <= reorder) {
            notifications.push({ 
              id: `admin-low-${item.id}`, 
              type: 'low-stock', 
              title: `${item.name} is running low`, 
              detail: `${qty} left. Reorder point: ${reorder}.`, 
              actionPath: '/inventory' 
            });
          }
        });
        
        repairTasks.forEach((task) => {
          if (task.status === 'PENDING') {
            notifications.push({ 
              id: `admin-repair-${task.id}`, 
              type: 'pending-repair', 
              title: `Pending repair: ${task.deviceType || 'Device'}${task.deviceModel ? ` — ${task.deviceModel}` : ''}`, 
              detail: 'Assign a technician to handle this repair.', 
              actionPath: '/my-repair-tasks' 
            });
          }
        });
        
        setAdminNotifications(notifications);
      } catch {}
    };
    
    loadAdminNotifications();
    const interval = setInterval(loadAdminNotifications, 30000);
    return () => clearInterval(interval);
  }, [SYSTEM_BACKEND_BASE_URL]);

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
          description: 'Approve new accounts',
          badge: adminNotifications.filter(n => n.type === 'pending-users').length
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-3 py-1 rounded-lg" style={{ backgroundColor: '#c0392b' }}>
              <span style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '0.06em', fontSize: '1.1rem', color: '#fff', fontWeight: 900 }}>
                COREX
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full tracking-wide">
                AI-POWERED
              </span>
              <span className="text-xs text-gray-400 mt-0.5">Admin Panel</span>
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
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              <div className="flex flex-col">
                                <span className="font-medium">{item.label}</span>
                                <span className={`text-xs ${isActive(item.path) ? 'text-blue-100' : 'text-gray-400'}`}>
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            {item.badge && item.badge > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {item.badge}
                              </span>
                            )}
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
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span className={`text-xs ${isActive(item.path) ? 'text-blue-100' : 'text-gray-400'}`}>
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
        <div className="p-4 border-t border-gray-200">
          {/* Notifications */}
          <div className="relative mb-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>System Alerts</span>
              </div>
              {adminNotifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {adminNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && adminNotifications.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">System Alerts</h3>
                </div>
                <div className="divide-y">
                  {adminNotifications.slice(0, 5).map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(notification.actionPath);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {notification.type === 'pending-users' && <UserCheck className="w-4 h-4 text-blue-500" />}
                          {notification.type === 'stockout' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {notification.type === 'low-stock' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                          {notification.type === 'pending-repair' && <Clock className="w-4 h-4 text-orange-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.detail}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};