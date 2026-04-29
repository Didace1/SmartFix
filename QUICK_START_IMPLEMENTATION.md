# SmartFix - Quick Start Implementation Guide

## 🚀 Getting Started

This guide will help you quickly implement the missing features to meet all 13 module requirements.

---

## Step 1: Set Up Component Library (30 minutes)

### Create the shared components folder structure:

```bash
cd smartfix-frontend/src/shared/components
mkdir -p Button Card Form Badge Alert Modal Table Loading Search Pagination
```

### Copy the components from `COMPONENT_LIBRARY_GUIDE.md`:

1. **Button Components** → `Button/`
2. **Card Components** → `Card/`
3. **Form Components** → `Form/`
4. **Badge Components** → `Badge/`
5. **Alert Components** → `Alert/`
6. **Modal Components** → `Modal/`
7. **Table Components** → `Table/`
8. **Loading Components** → `Loading/`
9. **Search Components** → `Search/`
10. **Pagination Component** → `Pagination/`

---

## Step 2: Enhance Dashboards (2-3 hours)

### Admin Dashboard Enhancement

**File:** `src/features/dashboard/AdminDashboard.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { StatCard } from '../../shared/components/Card/StatCard';
import { InfoCard } from '../../shared/components/Card/InfoCard';
import { Wrench, Package, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRepairs: 247,
    pendingDiagnoses: 12,
    lowStockItems: 8,
    todayRevenue: 2450
  });

  const repairTrends = [
    { month: 'Jan', repairs: 45 },
    { month: 'Feb', repairs: 52 },
    { month: 'Mar', repairs: 61 },
    { month: 'Apr', repairs: 58 },
    { month: 'May', repairs: 67 },
    { month: 'Jun', repairs: 73 }
  ];

  const commonFaults = [
    { name: 'Screen Damage', count: 45 },
    { name: 'Battery Issues', count: 38 },
    { name: 'Software Problems', count: 32 },
    { name: 'Charging Port', count: 28 },
    { name: 'Water Damage', count: 15 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Repairs"
          value={stats.totalRepairs}
          icon={Wrench}
          color="blue"
          trend="up"
          trendValue="12% from last month"
        />
        <StatCard
          title="Pending Diagnoses"
          value={stats.pendingDiagnoses}
          icon={AlertTriangle}
          color="yellow"
          trend="down"
          trendValue="3 less than yesterday"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockItems}
          icon={Package}
          color="red"
          trend="up"
          trendValue="2 new alerts"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="18% from yesterday"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repair Trends Chart */}
        <InfoCard title="Repair Trends (Last 6 Months)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={repairTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="repairs" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </InfoCard>

        {/* Common Faults Chart */}
        <InfoCard title="Common Fault Types">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commonFaults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </InfoCard>
      </div>

      {/* Recent Activity */}
      <InfoCard title="Recent Activity">
        <div className="space-y-4">
          {[
            { action: 'New repair task assigned', user: 'John Doe', time: '5 minutes ago', type: 'repair' },
            { action: 'Stock alert: iPhone 12 Battery', user: 'System', time: '15 minutes ago', type: 'inventory' },
            { action: 'Sale completed: $450', user: 'Jane Smith', time: '1 hour ago', type: 'sales' },
            { action: 'Diagnosis completed', user: 'Mike Johnson', time: '2 hours ago', type: 'diagnosis' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'repair' ? 'bg-blue-500' :
                  activity.type === 'inventory' ? 'bg-red-500' :
                  activity.type === 'sales' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
};
```

### Create Similar Dashboards for Other Roles:

1. **TechnicianDashboard.jsx** - Focus on assigned tasks, performance metrics
2. **InventoryDashboard.jsx** - Focus on stock levels, reorder points
3. **SalesDashboard.jsx** - Focus on sales performance, revenue

---

## Step 3: Enhance Fault Diagnosis (2 hours)

**File:** `src/features/fault-diagnosis/EnhancedDiagnosisPage.jsx`

```jsx
import React, { useState } from 'react';
import { Input } from '../../shared/components/Form/Input';
import { Select } from '../../shared/components/Form/Select';
import { Textarea } from '../../shared/components/Form/Textarea';
import { PrimaryButton, SecondaryButton } from '../../shared/components/Button';
import { InfoCard } from '../../shared/components/Card/InfoCard';
import { Alert } from '../../shared/components/Alert/Alert';
import { LoadingSpinner } from '../../shared/components/Loading/LoadingSpinner';
import { Camera, Mic, Upload } from 'lucide-react';
import axios from 'axios';

export const EnhancedDiagnosisPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    deviceType: '',
    symptoms: '',
    photos: []
  });
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const brands = [
    { value: 'apple', label: 'Apple' },
    { value: 'dell', label: 'Dell' },
    { value: 'hp', label: 'HP' },
    { value: 'lenovo', label: 'Lenovo' },
    { value: 'asus', label: 'ASUS' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/diagnosis', formData);
      setDiagnosisResult(response.data);
      setStep(3);
    } catch (error) {
      console.error('Diagnosis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Fault Diagnosis</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Device Info', 'Symptoms', 'Results'].map((label, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step > index + 1 ? 'bg-green-500 text-white' : 
                  step === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
              {index < 2 && <div className="w-24 h-1 mx-4 bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Device Information */}
      {step === 1 && (
        <InfoCard title="Step 1: Device Information">
          <div className="space-y-4">
            <Select
              label="Device Brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              options={brands}
              required
            />
            <Input
              label="Device Model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="e.g., MacBook Pro 2020"
              required
            />
            <Select
              label="Device Type"
              name="deviceType"
              value={formData.deviceType}
              onChange={handleInputChange}
              options={[
                { value: 'laptop', label: 'Laptop' },
                { value: 'desktop', label: 'Desktop' },
                { value: 'tablet', label: 'Tablet' },
                { value: 'phone', label: 'Phone' }
              ]}
              required
            />
            <div className="flex justify-end space-x-3 mt-6">
              <PrimaryButton onClick={() => setStep(2)}>
                Next: Enter Symptoms
              </PrimaryButton>
            </div>
          </div>
        </InfoCard>
      )}

      {/* Step 2: Symptoms */}
      {step === 2 && (
        <InfoCard title="Step 2: Describe Symptoms">
          <div className="space-y-4">
            <Textarea
              label="Symptom Description"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              placeholder="Describe the issue in detail..."
              rows={6}
              required
            />

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <SecondaryButton as="span">Choose Files</SecondaryButton>
                </label>
              </div>
              {formData.photos.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {formData.photos.length} photo(s) selected
                </p>
              )}
            </div>

            {/* Voice Input Button */}
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <Mic className="w-5 h-5" />
              <span>Use Voice Input</span>
            </button>

            <div className="flex justify-between mt-6">
              <SecondaryButton onClick={() => setStep(1)}>
                Back
              </SecondaryButton>
              <PrimaryButton onClick={handleSubmit} loading={loading}>
                Analyze with AI
              </PrimaryButton>
            </div>
          </div>
        </InfoCard>
      )}

      {/* Step 3: Results */}
      {step === 3 && diagnosisResult && (
        <div className="space-y-6">
          <Alert
            type="success"
            title="Diagnosis Complete"
            message="AI has successfully analyzed the device symptoms."
          />

          <InfoCard title="Diagnosis Results">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Identified Fault
                </h3>
                <p className="text-gray-700">{diagnosisResult.fault}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Confidence Score
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                    style={{ width: `${diagnosisResult.confidence}%` }}
                  >
                    {diagnosisResult.confidence}%
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recommended Solution
                </h3>
                <p className="text-gray-700">{diagnosisResult.solution}</p>
              </div>

              <div className="flex space-x-3 mt-6">
                <PrimaryButton onClick={() => {/* Navigate to repair */}}>
                  View Repair Guide
                </PrimaryButton>
                <SecondaryButton onClick={() => {/* Export report */}}>
                  Export Report
                </SecondaryButton>
                <SecondaryButton onClick={() => { setStep(1); setDiagnosisResult(null); }}>
                  New Diagnosis
                </SecondaryButton>
              </div>
            </div>
          </InfoCard>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <LoadingSpinner size="lg" text="Analyzing symptoms with AI..." />
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Step 4: Create Customer Management Module (1-2 hours)

**File:** `src/features/customers/CustomerManagementPage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { DataTable } from '../../shared/components/Table/DataTable';
import { SearchBar } from '../../shared/components/Search/SearchBar';
import { PrimaryButton } from '../../shared/components/Button';
import { StatusBadge } from '../../shared/components/Badge/StatusBadge';
import { Modal } from '../../shared/components/Modal/Modal';
import { Input } from '../../shared/components/Form/Input';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Devices', 
      render: (row) => <span className="font-semibold">{row.deviceCount}</span>
    },
    { 
      header: 'Status', 
      render: (row) => (
        <StatusBadge 
          status={row.status === 'Active' ? 'success' : 'warning'} 
          text={row.status} 
        />
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => viewCustomer(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => editCustomer(row)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => deleteCustomer(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const editCustomer = (customer) => {
    // Edit logic
  };

  const deleteCustomer = (customer) => {
    // Delete logic
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </PrimaryButton>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
        />
      </div>

      <DataTable columns={columns} data={customers} />

      {/* Customer Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Personal Information</h4>
              <p className="text-gray-600">Name: {selectedCustomer.name}</p>
              <p className="text-gray-600">Email: {selectedCustomer.email}</p>
              <p className="text-gray-600">Phone: {selectedCustomer.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Devices Owned</h4>
              <p className="text-gray-600">{selectedCustomer.deviceCount} devices</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
```

---

## Step 5: Add Notification System (1 hour)

**File:** `src/features/notifications/NotificationCenter.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { StatusBadge } from '../../shared/components/Badge/StatusBadge';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'iPhone 12 Battery is running low on stock',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'repair',
      title: 'New Task Assigned',
      message: 'You have been assigned a new repair task',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'sales',
      title: 'Sale Completed',
      message: 'Sale of $450 completed successfully',
      time: '2 hours ago',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button 
          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <StatusBadge
                    status={notification.type === 'inventory' ? 'error' : 
                           notification.type === 'repair' ? 'info' : 'success'}
                    text={notification.type}
                  />
                </div>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <span className="text-xs text-gray-400">{notification.time}</span>
              </div>
              <div className="flex space-x-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Step 6: Update Routes (15 minutes)

**File:** `src/App.jsx`

Add the new routes:

```jsx
import { CustomerManagementPage } from './features/customers/CustomerManagementPage';
import { EnhancedDiagnosisPage } from './features/fault-diagnosis/EnhancedDiagnosisPage';
import { NotificationCenter } from './features/notifications/NotificationCenter';

// Add to routes:
<Route path="/customers" element={
  <RoleBasedRoute allowedRoles={['admin', 'sales']}>
    <CustomerManagementPage />
  </RoleBasedRoute>
} />

<Route path="/diagnosis-enhanced" element={
  <RoleBasedRoute allowedRoles={['admin', 'technician']}>
    <EnhancedDiagnosisPage />
  </RoleBasedRoute>
} />

<Route path="/notifications" element={
  <RoleBasedRoute allowedRoles={['admin', 'sales', 'inventory', 'technician']}>
    <NotificationCenter />
  </RoleBasedRoute>
} />
```

---

## Step 7: Testing Checklist

### Frontend Testing
- [ ] All dashboards load correctly for each role
- [ ] Forms validate input properly
- [ ] Modals open and close correctly
- [ ] Tables display data and pagination works
- [ ] Search and filter functionality works
- [ ] Responsive design works on mobile

### Backend Testing
- [ ] All API endpoints return correct data
- [ ] Authentication and authorization work
- [ ] Database queries are optimized
- [ ] Error handling is implemented

### Integration Testing
- [ ] Frontend connects to backend successfully
- [ ] AI diagnosis returns results
- [ ] File uploads work correctly
- [ ] Real-time notifications work

---

## Step 8: Deployment Preparation

### Environment Variables
Create `.env` files for each environment:

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_AI_BACKEND_URL=http://localhost:8000
```

**Backend (application.properties):**
```
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/smartfix_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### Build Commands
```bash
# Frontend
cd smartfix-frontend
npm run build

# Backend
cd smartfix
mvn clean package

# AI Backend
cd AI_BACKEND
pip install -r requirements.txt
```

---

## Priority Implementation Order

### Week 1: Core Enhancements
1. ✅ Component library setup
2. ✅ Enhanced dashboards for all roles
3. ✅ Improved fault diagnosis UI

### Week 2: Management Modules
4. ✅ Customer management
5. ✅ Technician management
6. ✅ Notification system

### Week 3: Advanced Features
7. ✅ Reporting & analytics
8. ✅ Audit logging
9. ✅ Mobile optimization

---

## Resources

- **Design System:** `UI_DESIGN_SYSTEM.md`
- **Component Library:** `COMPONENT_LIBRARY_GUIDE.md`
- **Full Roadmap:** `IMPLEMENTATION_ROADMAP.md`
- **Requirements Mapping:** `SYSTEM_REQUIREMENTS_MAPPING.md`

---

## Need Help?

Refer to the comprehensive documentation files created:
1. System requirements mapping
2. UI design system
3. Component library guide
4. Implementation roadmap

**You now have everything you need to implement all 13 modules! 🚀**

