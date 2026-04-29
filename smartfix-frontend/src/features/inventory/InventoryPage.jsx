// src/features/inventory/InventoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Search, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../shared/components/Common/PageHeader';
import { StatCard } from '../../shared/components/Common/StatCard';
import { LoadingState } from '../../shared/components/Common/LoadingState';
import { EmptyState } from '../../shared/components/Common/EmptyState';
import { useLocation } from 'react-router-dom';

export const InventoryPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const location = useLocation();
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [addStockItem, setAddStockItem] = useState(null);
  const [addQuantity, setAddQuantity] = useState(1);
  const [stockDate, setStockDate] = useState(new Date().toISOString().slice(0, 10));
  const [stockCategory, setStockCategory] = useState('');
  const [stockItemId, setStockItemId] = useState('');
  const [modalMode, setModalMode] = useState('restock');
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 1, reorderPoint: 10, price: '', purchaseCost: '' });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('lowStock') === '1') setShowLowStockOnly(true);
    if (params.get('addStock') === '1') {
      setAddStockItem(null);
      setShowAddStockModal(true);
      setStockDate(new Date().toISOString().slice(0, 10));
      setAddQuantity(1);
      setStockCategory('');
      setStockItemId('');
      setModalMode('restock');
      setNewItem({ name: '', category: '', quantity: 1, reorderPoint: 10, price: '', purchaseCost: '' });
    }
  }, [location.search]);

  const loadInventory = async () => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`);
      const data = await response.json();
      if (response.ok) {
        setInventory(data);
      } else {
        toast.error(data?.message || 'Failed to load inventory');
      }
    } catch {
      toast.error('System backend not reachable for inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStockSubmit = async () => {
    const targetItem = addStockItem || inventory.find(i => String(i.id) === String(stockItemId));
    if (!targetItem) {
      toast.error('Please select an item');
      return;
    }
    const qtyToAdd = parseInt(addQuantity, 10);
    if (!Number.isFinite(qtyToAdd) || qtyToAdd <= 0) {
      toast.error('Enter a valid quantity to add');
      return;
    }
    const updated = {
      name: targetItem.name,
      category: targetItem.category,
      quantity: (targetItem.quantity || 0) + qtyToAdd,
      reorderPoint: targetItem.reorderPoint,
      price: targetItem.price,
      purchaseCost: targetItem.purchaseCost ?? 0,
      lastStockedAt: stockDate
    };
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory/${targetItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || 'Failed to add stock');
        return;
      }
      setInventory(inventory.map(i => i.id === targetItem.id ? data : i));
      toast.success('Stock added');
      setShowAddStockModal(false);
      setAddStockItem(null);
      setAddQuantity(1);
      setStockItemId('');
      setStockCategory('');
    } catch {
      toast.error('System backend not reachable for stock update');
    }
  };

  const handleNewItemSubmit = async () => {
    if (!newItem.name.trim() || !newItem.category || !newItem.price) {
      toast.error('Name, category, and selling price are required');
      return;
    }
    const payload = {
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: parseInt(newItem.quantity) || 0,
      reorderPoint: parseInt(newItem.reorderPoint) || 10,
      price: parseFloat(newItem.price),
      purchaseCost: newItem.purchaseCost ? parseFloat(newItem.purchaseCost) : 0,
      lastStockedAt: stockDate,
    };
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message || 'Failed to create item');
        return;
      }
      setInventory(prev => [...prev, data]);
      toast.success(`${data.name} added to inventory`);
      setShowAddStockModal(false);
      setModalMode('restock');
      setNewItem({ name: '', category: '', quantity: 1, reorderPoint: 10, price: '', purchaseCost: '' });
    } catch {
      toast.error('Backend not reachable');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory/${id}`, { method: 'DELETE' });
        setInventory(inventory.filter(item => item.id !== id));
        toast.success('Item deleted');
      } catch {
        toast.error('Failed to delete item');
      }
    }
  };

  const baseList = showLowStockOnly
    ? inventory.filter(item => item.quantity <= item.reorderPoint)
    : inventory;
  const filteredInventory = baseList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderPoint);
  // Inventory valuation uses purchase cost when available, falling back to selling price
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.purchaseCost ?? item.price ?? 0)), 0);
  const categories = Array.from(new Set(inventory.map(i => i.category))).filter(Boolean);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Inventory Management"
        subtitle="Track and manage your parts inventory"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Items" value={inventory.length} accent="text-blue-600" />
        <StatCard label="Total Value" value={`$${totalValue.toFixed(2)}`} accent="text-green-600" />
        <StatCard label="Low Stock Items" value={lowStockItems.length} accent="text-red-600" />
        <StatCard label="Categories" value={new Set(inventory.map(i => i.category)).size} accent="text-purple-600" />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700">
                The following items are below reorder point: {lowStockItems.map(i => i.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Stock Management</h2>
            {!addStockItem && (
              <div className="flex mb-4 border-b">
                <button
                  onClick={() => setModalMode('restock')}
                  className={`px-4 py-2 text-sm font-medium ${modalMode === 'restock' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Restock Existing
                </button>
                <button
                  onClick={() => setModalMode('newItem')}
                  className={`px-4 py-2 text-sm font-medium ${modalMode === 'newItem' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Add New Item
                </button>
              </div>
            )}
            <div className="space-y-4">
              {modalMode === 'restock' ? (
                <>
                  {addStockItem ? (
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                      <p className="font-semibold">{addStockItem.name}</p>
                      <p className="text-xs text-gray-500">SKU: {addStockItem.sku} • Current stock: {addStockItem.quantity}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={stockCategory}
                          onChange={(e) => { setStockCategory(e.target.value); setStockItemId(''); }}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">All categories</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Item</label>
                        <select
                          value={stockItemId}
                          onChange={(e) => setStockItemId(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">-- Select an item --</option>
                          {inventory
                            .filter(i => !stockCategory || i.category === stockCategory)
                            .map(i => (
                              <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>
                            ))
                          }
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to add</label>
                    <input
                      type="number"
                      placeholder="Quantity to add"
                      value={addQuantity}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '') { setAddQuantity(''); return; }
                        const n = parseInt(v, 10);
                        if (Number.isNaN(n)) { setAddQuantity(''); } else { setAddQuantity(Math.max(1, n)); }
                      }}
                      className="w-full px-4 py-2 border rounded-lg"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Entry Date</label>
                    <input
                      type="date"
                      value={stockDate}
                      onChange={(e) => setStockDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g. Samsung Galaxy S24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select category</option>
                      {['Laptop', 'Desktop', 'Smartwatch', 'Smartphone', 'Spare Parts'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Point</label>
                      <input
                        type="number"
                        value={newItem.reorderPoint}
                        onChange={(e) => setNewItem({ ...newItem, reorderPoint: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost</label>
                      <input
                        type="number"
                        value={newItem.purchaseCost}
                        onChange={(e) => setNewItem({ ...newItem, purchaseCost: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Entry Date</label>
                    <input
                      type="date"
                      value={stockDate}
                      onChange={(e) => setStockDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={modalMode === 'restock' ? handleAddStockSubmit : handleNewItemSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {modalMode === 'restock' ? 'Add Stock' : 'Create Item'}
              </button>
              <button
                onClick={() => { setShowAddStockModal(false); setAddStockItem(null); setStockItemId(''); setStockCategory(''); setModalMode('restock'); setNewItem({ name: '', category: '', quantity: 1, reorderPoint: 10, price: '', purchaseCost: '' }); }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Add */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => { setAddStockItem(null); setShowAddStockModal(true); setStockDate(new Date().toISOString().slice(0, 10)); setModalMode('restock'); setNewItem({ name: '', category: '', quantity: 1, reorderPoint: 10, price: '', purchaseCost: '' }); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <LoadingState message="Loading inventory..." />
        ) : filteredInventory.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No inventory items found" description="Try a different search." />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Stocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      item.quantity <= item.reorderPoint ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.quantity}
                    </span>
                    {item.quantity <= item.reorderPoint && (
                      <span className="ml-2 text-xs text-red-500">(Low)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.purchaseCost ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastStockedAt
                      ? (() => {
                          const d = new Date(item.lastStockedAt);
                          return isNaN(d.getTime()) ? '-' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
                        })()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => { setAddStockItem(item); setAddQuantity(1); setStockDate(new Date().toISOString().slice(0, 10)); setShowAddStockModal(true); }} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

    </div>
  );
};