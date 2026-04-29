# SmartFix UI/UX Design System

## Design Philosophy
Modern, clean, and professional interface optimized for repair shop operations with focus on efficiency, clarity, and ease of use.

---

## Color Palette

### Primary Colors
```css
--primary-50: #eff6ff;    /* Very light blue */
--primary-100: #dbeafe;   /* Light blue */
--primary-200: #bfdbfe;   /* Lighter blue */
--primary-300: #93c5fd;   /* Medium light blue */
--primary-400: #60a5fa;   /* Medium blue */
--primary-500: #3b82f6;   /* Primary blue */
--primary-600: #2563eb;   /* Dark blue */
--primary-700: #1d4ed8;   /* Darker blue */
--primary-800: #1e40af;   /* Very dark blue */
--primary-900: #1e3a8a;   /* Deepest blue */
```

### Secondary Colors
```css
--secondary-50: #f0fdf4;   /* Very light green */
--secondary-100: #dcfce7;  /* Light green */
--secondary-500: #22c55e;  /* Success green */
--secondary-600: #16a34a;  /* Dark green */
```

### Status Colors
```css
/* Success */
--success: #10b981;
--success-light: #d1fae5;
--success-dark: #047857;

/* Warning */
--warning: #f59e0b;
--warning-light: #fef3c7;
--warning-dark: #d97706;

/* Error/Danger */
--error: #ef4444;
--error-light: #fee2e2;
--error-dark: #dc2626;

/* Info */
--info: #3b82f6;
--info-light: #dbeafe;
--info-dark: #1d4ed8;
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## Component Styles

### Buttons

#### Primary Button
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
                   font-medium transition-colors duration-200">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
                   hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 
                   font-medium transition-colors duration-200">
  Secondary Action
</button>
```

#### Danger Button
```jsx
<button className="px-4 py-2 bg-red-600 text-white rounded-lg 
                   hover:bg-red-700 focus:ring-4 focus:ring-red-300 
                   font-medium transition-colors duration-200">
  Delete
</button>
```

#### Success Button
```jsx
<button className="px-4 py-2 bg-green-600 text-white rounded-lg 
                   hover:bg-green-700 focus:ring-4 focus:ring-green-300 
                   font-medium transition-colors duration-200">
  Confirm
</button>
```

### Cards

#### Standard Card
```jsx
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

#### Stat Card
```jsx
<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Total Repairs</p>
      <p className="text-3xl font-bold text-gray-900">247</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-full">
      <WrenchIcon className="w-8 h-8 text-blue-600" />
    </div>
  </div>
  <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
</div>
```

### Forms

#### Input Field
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Device Model
  </label>
  <input 
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition-colors duration-200"
    placeholder="Enter device model"
  />
</div>
```

#### Select Dropdown
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Device Brand
  </label>
  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    <option>Select brand</option>
    <option>Apple</option>
    <option>Dell</option>
    <option>HP</option>
  </select>
</div>
```

#### Textarea
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Symptoms Description
  </label>
  <textarea 
    rows="4"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Describe the issue..."
  />
</div>
```

### Badges

```jsx
/* Status Badges */
<span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
  Completed
</span>

<span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
  Pending
</span>

<span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
  Urgent
</span>

<span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
  In Progress
</span>
```

### Alerts

```jsx
/* Success Alert */
<div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
  <div className="flex items-center">
    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
    <p className="text-green-800">Operation completed successfully!</p>
  </div>
</div>

/* Error Alert */
<div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
  <div className="flex items-center">
    <XCircleIcon className="w-5 h-5 text-red-500 mr-3" />
    <p className="text-red-800">An error occurred. Please try again.</p>
  </div>
</div>

/* Warning Alert */
<div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
  <div className="flex items-center">
    <AlertTriangleIcon className="w-5 h-5 text-yellow-500 mr-3" />
    <p className="text-yellow-800">Low stock alert for this component.</p>
  </div>
</div>
```

### Tables

```jsx
<div className="overflow-x-auto bg-white rounded-lg shadow">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Device
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Technician
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          MacBook Pro 2020
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          John Doe
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
          <button className="text-gray-600 hover:text-gray-800">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal

```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900">Modal Title</h3>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Modal content goes here...</p>
    </div>
    <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
        Cancel
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Layout Patterns

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│  Navbar (Logo, Search, Notifications, Profile)         │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Main Content Area                          │
│          │                                              │
│ - Home   │  ┌────────┐ ┌────────┐ ┌────────┐          │
│ - Diag   │  │ Card 1 │ │ Card 2 │ │ Card 3 │          │
│ - Repair │  └────────┘ └────────┘ └────────┘          │
│ - Invent │                                              │
│ - Sales  │  ┌──────────────────────────────┐          │
│ - Report │  │  Chart/Table Component       │          │
│          │  └──────────────────────────────┘          │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Form Layout
```
┌─────────────────────────────────────────────────────────┐
│  Page Title                                    [Save]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Section 1: Device Information                  │  │
│  │  ┌──────────────┐  ┌──────────────┐            │  │
│  │  │ Brand        │  │ Model        │            │  │
│  │  └──────────────┘  └──────────────┘            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Section 2: Symptoms                            │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │ Description                              │  │  │
│  │  │                                          │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  [Cancel]                                      [Submit] │
└─────────────────────────────────────────────────────────┘
```

---

## Icons (Lucide React)

### Common Icons Usage
```jsx
import { 
  Wrench,           // Repairs
  Package,          // Inventory
  ShoppingCart,     // Sales
  Users,            // Customers
  BarChart3,        // Analytics
  AlertTriangle,    // Warnings
  CheckCircle,      // Success
  XCircle,          // Error
  Clock,            // Time/Pending
  Search,           // Search
  Filter,           // Filters
  Download,         // Export
  Upload,           // Import
  Settings,         // Settings
  Bell,             // Notifications
  User,             // Profile
  LogOut,           // Logout
  Plus,             // Add
  Edit,             // Edit
  Trash2,           // Delete
  Eye,              // View
  Camera,           // Photo
  FileText,         // Documents
  TrendingUp,       // Growth
  TrendingDown      // Decline
} from 'lucide-react';
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* Small devices (tablets, 640px and up) */
@media (min-width: 640px) { ... }

/* Medium devices (small laptops, 768px and up) */
@media (min-width: 768px) { ... }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { ... }

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { ... }
```

### Tailwind Responsive Classes
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Responsive grid: 1 col mobile, 2 tablet, 3 laptop, 4 desktop */}
</div>
```

---

## Animation & Transitions

```css
/* Smooth transitions */
transition-all duration-200 ease-in-out

/* Hover effects */
hover:scale-105 hover:shadow-lg

/* Focus states */
focus:ring-4 focus:ring-blue-300 focus:outline-none

/* Loading spinner */
animate-spin

/* Fade in */
animate-fade-in

/* Slide in */
animate-slide-in
```

---

## Accessibility Guidelines

1. **Color Contrast:** Minimum 4.5:1 ratio for text
2. **Focus Indicators:** Visible focus states on all interactive elements
3. **Alt Text:** All images must have descriptive alt text
4. **Keyboard Navigation:** All features accessible via keyboard
5. **ARIA Labels:** Proper ARIA labels for screen readers
6. **Form Labels:** All form inputs must have associated labels
7. **Error Messages:** Clear, descriptive error messages
8. **Loading States:** Indicate loading with spinners or skeleton screens

---

## Best Practices

### Do's ✅
- Use consistent spacing throughout
- Maintain visual hierarchy with font sizes
- Provide clear feedback for user actions
- Use loading states for async operations
- Show error messages inline near the relevant field
- Use icons to enhance understanding
- Keep forms simple and organized
- Use tooltips for additional information

### Don'ts ❌
- Don't use too many colors
- Don't make buttons too small (min 44x44px for touch)
- Don't hide important actions
- Don't use jargon in UI text
- Don't overuse animations
- Don't make users remember information
- Don't use low contrast text

---

## Component File Structure

```
src/
├── shared/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.test.js
│   │   ├── Card/
│   │   │   ├── Card.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── Card.test.js
│   │   ├── Form/
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   └── Form.test.js
│   │   ├── Badge/
│   │   │   ├── Badge.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── Alert/
│   │   │   ├── Alert.jsx
│   │   │   └── Alert.test.js
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── ConfirmModal.jsx
│   │   └── Table/
│   │       ├── Table.jsx
│   │       ├── DataTable.jsx
│   │       └── Table.test.js
│   └── styles/
│       ├── colors.css
│       ├── typography.css
│       └── utilities.css
```

