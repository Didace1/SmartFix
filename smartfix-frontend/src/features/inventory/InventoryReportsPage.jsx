// src/features/inventory/InventoryReportsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Package, TrendingDown, AlertTriangle, DollarSign, BarChart3,
  Download, FileText, PieChart as PieChartIcon, Activity,
  ShoppingCart, TrendingUp, Calendar, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { PageHeader } from '../../shared/components/Common/PageHeader';
import { LoadingState } from '../../shared/components/Common/LoadingState';
import { formatCurrency, formatNumber } from '../../shared/utils/formatters';

const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const InventoryReportsPage = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [reportType, setReportType] = useState('overview'); // overview, stock, movement, valuation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, salesRes, summaryRes] = await Promise.all([
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/sales`),
          fetch(`${SYSTEM_BACKEND_BASE_URL}/api/reports/summary`)
        ]);
        
        if (inventoryRes.ok) setInventory(await inventoryRes.json());
        if (salesRes.ok) setSales(await salesRes.json());
        if (summaryRes.ok) setReportSummary(await summaryRes.json());
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter sales by date range
  const filteredSales = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - parseInt(dateRange));
    return sales.filter(s => {
      if (!s.createdAt) return false;
      return new Date(s.createdAt) >= cutoff;
    });
  }, [sales, dateRange]);

  // Calculate metrics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  const lowStockItems = inventory.filter(item => 
    item.quantity <= (item.reorderPoint || 10)
  );
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  // Stock status distribution
  const stockStatusData = useMemo(() => {
    const inStock = inventory.filter(item => item.quantity > (item.reorderPoint || 10)).length;
    const lowStock = lowStockItems.length;
    const outOfStock = outOfStockItems.length;
    
    return [
      { name: 'In Stock', value: inStock, color: '#10b981' },
      { name: 'Low Stock', value: lowStock, color: '#f59e0b' },
      { name: 'Out of Stock', value: outOfStock, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [inventory, lowStockItems, outOfStockItems]);

  // Category distribution
  const categoryData = useMemo(() => {
    const map = {};
    inventory.forEach(item => {
      const cat = item.category?.name || 'Uncategorized';
      if (!map[cat]) map[cat] = { count: 0, value: 0 };
      map[cat].count += 1;
      map[cat].value += Number(item.price || 0) * Number(item.quantity || 0);
    });
    return Object.entries(map)
      .map(([name, data]) => ({ 
        name, 
        count: data.count,
        value: Math.round(data.value * 100) / 100
      }))
      .sort((a, b) => b.value - a.value);
  }, [inventory]);

  // Top items by value
  const topItemsByValue = useMemo(() => {
    return [...inventory]
      .map(item => ({
        ...item,
        totalValue: Number(item.price || 0) * Number(item.quantity || 0)
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);
  }, [inventory]);

  // Items sold in period
  const itemsSoldData = useMemo(() => {
    const map = {};
    filteredSales.forEach(sale => {
      (sale.items || []).forEach(item => {
        const name = item.name || 'Unknown';
        if (!map[name]) map[name] = { quantity: 0, revenue: 0 };
        map[name].quantity += Number(item.quantity || 0);
        map[name].revenue += Number(item.price || 0) * Number(item.quantity || 0);
      });
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [filteredSales]);

  // Stock movement trend (last 30 days)
  const stockMovementTrend = useMemo(() => {
    const days = 30;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const daySales = sales.filter(s => s.createdAt && s.createdAt.substring(0, 10) === dateStr);
      const itemsSold = daySales.reduce((sum, s) => {
        return sum + (s.items || []).reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0);
      }, 0);
      
      result.push({ 
        name: label, 
        sold: itemsSold,
        sales: daySales.length
      });
    }
    return result;
  }, [sales]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Price', 'Total Value', 'Reorder Point', 'Status'];
    const rows = inventory.map(item => [
      item.name || '-',
      item.sku || '-',
      item.category?.name || '-',
      item.quantity || 0,
      item.price || 0,
      (Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2),
      item.reorderPoint || '-',
      item.quantity === 0 ? 'Out of Stock' : item.quantity <= (item.reorderPoint || 10) ? 'Low Stock' : 'In Stock'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <LoadingState message="Loading inventory reports..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Inventory Reports & Analytics"
          subtitle="Comprehensive inventory insights and stock analysis"
        />
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'stock', label: 'Stock Status', icon: Package },
          { id: 'movement', label: 'Stock Movement', icon: Activity },
          { id: 'valuation', label: 'Valuation', icon: DollarSign }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                reportType === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalItems)}</p>
              <p className="text-xs text-gray-400 mt-1">Unique products</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-400 mt-1">Inventory worth</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatNumber(lowStockItems.length)}</p>
              <p className="text-xs text-gray-400 mt-1">Items need reorder</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatNumber(outOfStockItems.length)}</p>
              <p className="text-xs text-gray-400 mt-1">Items unavailable</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Content Based on Selected Tab */}
      {reportType === 'overview' && (
        <>
          {/* Stock Status & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Stock Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                Stock Status Distribution
              </h3>
              {stockStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400 text-center py-16">No data available</p>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Items by Category
              </h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'count' ? value : formatCurrency(value),
                        name === 'count' ? 'Items' : 'Value'
                      ]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400 text-center py-16">No category data</p>
              )}
            </div>
          </div>

          {/* Stock Movement Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Stock Movement (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stockMovementTrend}>
                <defs>
                  <linearGradient id="soldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={Math.floor(stockMovementTrend.length / 8)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sold" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#soldGradient)" 
                  name="Items Sold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {reportType === 'stock' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Low Stock Items
            </h3>
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reorder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockItems.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-orange-600 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.reorderPoint || 10}</td>
                    </tr>
                  ))}
                  {lowStockItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">
                        No low stock items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Out of Stock Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Out of Stock Items
            </h3>
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {outOfStockItems.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.category?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))}
                  {outOfStockItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">
                        No out of stock items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'movement' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Top Selling Items (Last {dateRange} Days)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itemsSoldData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(item.quantity)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
                {itemsSoldData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'valuation' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Top Items by Value
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topItemsByValue.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.category?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(item.quantity)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">
                      {formatCurrency(item.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
