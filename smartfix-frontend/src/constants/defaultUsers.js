// src/constants/defaultUsers.js
export const DEFAULT_USERS = [
  {
    id: 1,
    email: 'admin@smartfix.com',
    password: 'admin123',
    fullName: 'John Administrator',
    role: 'admin',
    employeeId: 'ADMIN001',
    phone: '+1234567890',
    specialization: 'System Administration',
    permissions: ['all'], // Admin has all permissions
    mfaEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=6366f1&color=fff'
  },
  {
    id: 2,
    email: 'technician@smartfix.com',
    password: 'tech123',
    fullName: 'Sarah Technician',
    role: 'technician',
    employeeId: 'TECH001',
    phone: '+1234567891',
    specialization: 'Laptop & Desktop Repair',
    certifications: ['CompTIA A+', 'Apple Certified'],
    permissions: ['diagnosis', 'failure-prediction', 'repair', 'customers-view'],
    mfaEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Tech&background=10b981&color=fff'
  },
  {
    id: 4,
    email: 'inventory@smartfix.com',
    password: 'inv123',
    fullName: 'Lisa Inventor',
    role: 'inventory',
    employeeId: 'INV001',
    phone: '+1234567893',
    specialization: 'Stock Management',
    permissions: ['inventory', 'inventory-manage', 'suppliers', 'purchase-orders'],
    mfaEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Inv&background=8b5cf6&color=fff'
  },
  {
    id: 5,
    email: 'sales@smartfix.com',
    password: 'sales123',
    fullName: 'David Sales',
    role: 'sales',
    employeeId: 'SALES001',
    phone: '+1234567894',
    specialization: 'Sales & Customer Service',
    permissions: ['sales', 'customers', 'pos', 'inventory-view'],
    mfaEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=David+Sales&background=ec4899&color=fff'
  }
];

// Role-based dashboard configurations
export const ROLE_DASHBOARD_CONFIG = {
  admin: {
    welcomeMessage: 'System Administrator',
    widgets: ['summary', 'recentActivities', 'alerts', 'performance', 'userStats'],
    actions: ['manageUsers', 'systemSettings', 'viewAllReports']
  },
  technician: {
    welcomeMessage: 'Repair Technician',
    widgets: ['myTasks', 'pendingRepairs', 'diagnosis', 'componentHealth'],
    actions: ['newDiagnosis', 'viewRepairs', 'updateStatus']
  },
  inventory: {
    welcomeMessage: 'Inventor',
    widgets: ['stockLevels', 'lowStock', 'reorderPoints', 'inventoryValue'],
    actions: ['addStock', 'createPurchaseOrder', 'manageSuppliers']
  },
  sales: {
    welcomeMessage: 'Sales Associate',
    widgets: ['salesToday', 'popularProducts', 'customerStats', 'targetProgress'],
    actions: ['newSale', 'manageCustomers', 'viewPromotions']
  }
};

// Role-based stats
export const ROLE_DASHBOARD_STATS = {
  admin: {
    pendingRepairs: 23,
    inventoryAlerts: 5,
    salesToday: 1250,
    revenueToday: 980,
    totalTechnicians: 8,
    customerSatisfaction: 94,
    monthlyTarget: 85,
    activeUsers: 12,
    systemUptime: '99.9%'
  },
  technician: {
    myTasks: 5,
    completedToday: 2,
    pendingRepairs: 3,
    avgRepairTime: 45,
    successRate: 92,
    nextTask: "Dell XPS Battery Replacement",
    urgentTasks: 1,
    weeklyCompleted: 12
  },
  inventory: {
    lowStockItems: 5,
    totalParts: 234,
    pendingOrders: 3,
    monthlyTurnover: 67,
    reorderValue: 1250,
    totalValue: 45600,
    topCategory: 'Batteries'
  },
  sales: {
    salesToday: 1250,
    dailyTarget: 1500,
    weeklySales: 8750,
    monthlySales: 34200,
    topProduct: "Laptop Battery - 78 units",
    customerCount: 45,
    conversionRate: 68
  }
};