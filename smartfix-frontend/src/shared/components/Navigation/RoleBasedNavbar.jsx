// src/shared/components/Navigation/RoleBasedNavbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';

export const RoleBasedNavbar = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [taskCount, setTaskCount] = React.useState(0);
  const [newTaskCount, setNewTaskCount] = React.useState(0);

  React.useEffect(() => {
    if (user?.role !== 'technician') return;

    const storageKey = `technician_last_seen_tasks_${user?.email || user?.id || 'default'}`;

    const loadTaskNotification = async () => {
      try {
        const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/dashboard/summary`);
        if (!response.ok) return;
        const summary = await response.json();
        const currentTasks = Number(summary?.pendingRepairs || 0);
        setTaskCount(currentTasks);

        const savedSeen = Number(localStorage.getItem(storageKey) || 0);
        if (!Number.isFinite(savedSeen)) {
          localStorage.setItem(storageKey, String(currentTasks));
          setNewTaskCount(0);
          return;
        }

        const delta = currentTasks - savedSeen;
        setNewTaskCount(delta > 0 ? delta : 0);
      } catch {
      }
    };

    loadTaskNotification();
    const interval = setInterval(loadTaskNotification, 30000);
    return () => clearInterval(interval);
  }, [SYSTEM_BACKEND_BASE_URL, user?.role, user?.email, user?.id]);

  const handleOpenNotifications = () => {
    if (user?.role !== 'technician') return;
    const storageKey = `technician_last_seen_tasks_${user?.email || user?.id || 'default'}`;
    localStorage.setItem(storageKey, String(taskCount));
    setNewTaskCount(0);
    navigate('/my-repair-tasks');
  };

  // Define navigation items with role-based access
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      roles: ['admin', 'technician', 'manager', 'inventory', 'sales']
    },
    { 
      path: '/diagnosis', 
      label: 'Fault Diagnosis', 
      icon: '🔍',
      roles: ['admin', 'technician']
    },
    { 
      path: '/failure-prediction', 
      label: 'Failure Prediction', 
      icon: '⚠️',
      roles: ['admin', 'manager']
    },
    { 
      path: '/repair', 
      label: 'Repair Guide', 
      icon: '🔧',
      roles: ['admin']
    },
    {
      path: '/spare-part-requests',
      label: 'Spare Parts Request',
      icon: '🧾',
      roles: ['admin', 'technician']
    },
    {
      path: '/my-repair-tasks',
      label: 'My Repair Tasks',
      icon: '🛠️',
      roles: ['admin', 'technician']
    },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: '📦',
      roles: ['admin', 'manager', 'inventory']
    },
    { 
      path: '/sales', 
      label: 'Sales', 
      icon: '💰',
      roles: ['admin', 'sales']
    },
    {
      path: '/sales-repairs',
      label: 'Sales Repairs',
      icon: '🧰',
      roles: ['admin', 'sales']
    },
    { 
      path: '/customers', 
      label: 'Customers', 
      icon: '👥',
      roles: ['admin', 'sales']
    },
    { 
      path: '/technicians', 
      label: 'Technicians', 
      icon: '👨‍🔧',
      roles: ['admin', 'manager']
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: '📈',
      roles: ['admin', 'manager']
    }
  ];

  // Filter navigation items based on user role
  const accessibleNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">SmartFix</h1>
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                AI-Powered
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {accessibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.role === 'technician' && (
              <button
                onClick={handleOpenNotifications}
                title={newTaskCount > 0
                  ? `${newTaskCount} new repair task${newTaskCount > 1 ? 's' : ''}`
                  : 'No new repair tasks'}
                className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {newTaskCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {newTaskCount > 99 ? '99+' : newTaskCount}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};