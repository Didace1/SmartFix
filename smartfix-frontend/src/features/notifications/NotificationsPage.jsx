// src/features/notifications/NotificationsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle2, PackageCheck, Clock, Trash2 } from 'lucide-react';

export const NotificationsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all | stockout | low-stock | restocked | repair-completed | warranty-expiry
  const [scope, setScope] = useState('auto'); // auto | sales | inventory

  const keyId = user?.email || user?.id || 'default';
  const salesHistoryKey = `sales_notifications_history_${keyId}`;
  const inventoryHistoryKey = `inventory_notifications_history_${keyId}`;

  useEffect(() => {
    const load = () => {
      const sales = JSON.parse(localStorage.getItem(salesHistoryKey) || '[]');
      const inv = JSON.parse(localStorage.getItem(inventoryHistoryKey) || '[]');

      let list = [];
      if (user?.role === 'sales') list = sales;
      else if (user?.role === 'inventory') list = inv;
      else list = [...sales, ...inv]; // admin or others

      // sort by timestamp desc if present
      list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      setItems(list);
    };
    load();
  }, [user?.role, salesHistoryKey, inventoryHistoryKey]);

  const filtered = useMemo(() => {
    return items.filter((n) => (filter === 'all' ? true : n.type === filter));
  }, [items, filter]);

  const clearHistory = () => {
    if (scope === 'auto') {
      if (user?.role === 'sales') localStorage.setItem(salesHistoryKey, '[]');
      else if (user?.role === 'inventory') localStorage.setItem(inventoryHistoryKey, '[]');
      else {
        localStorage.setItem(salesHistoryKey, '[]');
        localStorage.setItem(inventoryHistoryKey, '[]');
      }
    } else if (scope === 'sales') {
      localStorage.setItem(salesHistoryKey, '[]');
    } else if (scope === 'inventory') {
      localStorage.setItem(inventoryHistoryKey, '[]');
    }
    // reload
    const sales = JSON.parse(localStorage.getItem(salesHistoryKey) || '[]');
    const inv = JSON.parse(localStorage.getItem(inventoryHistoryKey) || '[]');
    let list = [];
    if (user?.role === 'sales') list = sales;
    else if (user?.role === 'inventory') list = inv;
    else list = [...sales, ...inv];
    list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    setItems(list);
  };

  const Icon = ({ type }) => {
    if (type === 'stockout') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (type === 'low-stock') return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (type === 'restocked') return <PackageCheck className="w-4 h-4 text-green-600" />;
    if (type === 'repair-completed') return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    if (type === 'warranty-expiry') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <Bell className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow">
        <div className="px-6 py-5 border-b rounded-t-xl bg-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">History for {user?.role === 'inventory' ? 'Inventor' : (user?.role || 'User')}</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">Back</button>
        </div>

        <div className="px-6 py-4 flex flex-wrap gap-3 items-center border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Filter:</span>
            {['all', 'stockout', 'low-stock', 'restocked', 'repair-completed', 'warranty-expiry'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs border ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} `}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="auto">Current role</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventor</option>
            </select>
            <button onClick={clearHistory} className="flex items-center gap-1 text-xs text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
              <Trash2 className="w-3 h-3" /> Clear history
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">No notifications found.</div>
        ) : (
          <ul className="divide-y">
            {filtered.map((n) => (
              <li key={n.id} className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50">
                <div className="mt-0.5"><Icon type={n.type} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  {n.detail && <p className="text-xs text-gray-500 mt-1">{n.detail}</p>}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{n.timestamp ? new Date(n.timestamp).toLocaleString() : '—'}</span>
                  </div>
                </div>
                {n.actionPath && (
                  <button onClick={() => navigate(n.actionPath)} className="text-xs text-blue-600 hover:underline">
                    {n.actionLabel || 'Open'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
