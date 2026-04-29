# SmartFix UI/UX Design Guide

## 📋 Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Component Library](#component-library)
5. [Layout Patterns](#layout-patterns)
6. [User Flows](#user-flows)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

## 🎨 Design Philosophy

### Core Principles
- **Clarity**: Information should be easy to find and understand
- **Efficiency**: Minimize clicks and time to complete tasks
- **Consistency**: Uniform design patterns across all pages
- **Professional**: Clean, modern interface for business use
- **AI-First**: Highlight AI capabilities prominently

### Design Goals
- Reduce cognitive load for technicians during repairs
- Make AI diagnosis results clear and actionable
- Streamline inventory and sales workflows
- Provide real-time feedback and notifications

---

## 🎨 Color Palette

### Primary Colors
```css
/* Main Brand Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main Primary */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### Semantic Colors
```css
/* Success - Green */
--success-light: #d1fae5;
--success: #10b981;
--success-dark: #059669;

/* Warning - Amber */
--warning-light: #fef3c7;
--warning: #f59e0b;
--warning-dark: #d97706;

/* Error - Red */
--error-light: #fee2e2;
--error: #ef4444;
--error-dark: #dc2626;

/* Info - Blue */
--info-light: #dbeafe;
--info: #3b82f6;
--info-dark: #2563eb;
```

### Neutral Colors
```css
/* Grays */
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

### AI Feature Colors
```css
/* AI Diagnosis */
--ai-primary: #8b5cf6;     /* Purple */
--ai-secondary: #ec4899;   /* Pink */
--ai-accent: #06b6d4;      /* Cyan */
--ai-gradient: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
```

---

## 📝 Typography

### Font Stack
```css
/* Primary Font - System UI */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;

/* Monospace - For code/technical data */
font-family: 'Courier New', Courier, monospace;
```

### Type Scale
```css
/* Headings */
.text-h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
.text-h5 { font-size: 1.125rem; font-weight: 600; line-height: 1.5; }

/* Body Text */
.text-body-lg { font-size: 1.125rem; line-height: 1.75; }
.text-body { font-size: 1rem; line-height: 1.5; }
.text-body-sm { font-size: 0.875rem; line-height: 1.5; }
.text-caption { font-size: 0.75rem; line-height: 1.5; }
```

---

## 🧩 Component Library

### 1. Buttons

#### Primary Button
```jsx
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 active:bg-blue-800 
                   transition-colors duration-200 
                   font-medium shadow-sm hover:shadow-md">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 
                   rounded-lg hover:bg-gray-50 active:bg-gray-100 
                   transition-colors duration-200 font-medium">
  Secondary Action
</button>
```

#### AI Button (Special)
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                   text-white rounded-lg hover:from-purple-700 hover:to-pink-700 
                   transition-all duration-200 font-medium shadow-lg 
                   hover:shadow-xl transform hover:-translate-y-0.5">
  🤖 AI Diagnose
</button>
```

### 2. Cards

#### Standard Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 
                p-6 hover:shadow-md transition-shadow duration-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

#### Stat Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600 mb-1">Total Repairs</p>
      <p className="text-3xl font-bold text-gray-900">1,234</p>
      <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
    </div>
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600">...</svg>
    </div>
  </div>
</div>
```

#### AI Result Card
```jsx
<div className="bg-gradient-to-br from-purple-50 to-pink-50 
                rounded-xl border-2 border-purple-200 p-6">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl">🤖</span>
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 mb-2">AI Diagnosis Result</h4>
      <p className="text-gray-700 mb-3">Battery Failure Detected</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Confidence:</span>
        <div className="flex-1 bg-white rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
        </div>
        <span className="text-sm font-semibold text-purple-600">95%</span>
      </div>
    </div>
  </div>
</div>
```

### 3. Forms

#### Input Field
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Device Model
  </label>
  <input 
    type="text"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
               transition-all duration-200"
    placeholder="Enter device model"
  />
</div>
```

#### Select Dropdown
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Brand
  </label>
  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     transition-all duration-200 bg-white">
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
    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
               transition-all duration-200 resize-none"
    placeholder="Describe the issue in detail..."
  />
</div>
```

### 4. Tables

#### Data Table
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Device
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-900">iPhone 13 Pro</td>
        <td className="px-6 py-4">
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Completed
          </span>
        </td>
        <td className="px-6 py-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 5. Badges & Status Indicators

```jsx
/* Status Badges */
<span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
  Completed
</span>

<span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
  In Progress
</span>

<span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
  Failed
</span>

<span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
  Pending
</span>

<span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
  AI Analyzed
</span>
```

### 6. Alerts & Notifications

#### Success Alert
```jsx
<div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor">...</svg>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-green-800">Success!</h3>
      <p className="text-sm text-green-700 mt-1">Repair completed successfully.</p>
    </div>
  </div>
</div>
```

#### Error Alert
```jsx
<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor">...</svg>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-red-800">Error</h3>
      <p className="text-sm text-red-700 mt-1">Unable to process diagnosis.</p>
    </div>
  </div>
</div>
```

### 7. Loading States

#### Spinner
```jsx
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
</div>
```

#### Skeleton Loader
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

---

## 📐 Layout Patterns

### 1. Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│  Navbar (Fixed Top)                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │  Stat Card  │  │  Stat Card  │  │  Stat Card  ││
│  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                     │
│  ┌───────────────────────────┐  ┌─────────────────┐│
│  │                           │  │                 ││
│  │   Main Chart Area         │  │  Quick Actions  ││
│  │                           │  │                 ││
│  └───────────────────────────┘  └─────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  Recent Activity Table                          ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Form Layout (AI Diagnosis)
```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  🤖 AI Fault Diagnosis                          ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌──────────────────────┐  ┌────────────────────┐ │
│  │                      │  │                    │ │
│  │   Input Form         │  │   AI Results       │ │
│  │   - Device Info      │  │   - Diagnosis      │ │
│  │   - Symptoms         │  │   - Confidence     │ │
│  │   - Upload Images    │  │   - Recommendations│ │
│  │                      │  │   - Parts Needed   │ │
│  │   [Diagnose Button]  │  │                    │ │
│  │                      │  │                    │ │
│  └──────────────────────┘  └────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. List/Table Layout
```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  Inventory Management                           ││
│  │  [+ Add Item]  [Filter]  [Search...]            ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  Item  │  Quantity  │  Status  │  Actions       ││
│  ├─────────────────────────────────────────────────┤│
│  │  ...   │   ...      │   ...    │   ...          ││
│  │  ...   │   ...      │   ...    │   ...          ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  [Pagination]                                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 User Flows

### Flow 1: AI Diagnosis Process
```
1. Login → Dashboard
2. Click "Fault Diagnosis" in navbar
3. Fill device information form
   - Select brand
   - Select model
   - Enter serial number (optional)
4. Describe symptoms
   - Text description
   - Upload images (optional)
5. Click "🤖 AI Diagnose" button
6. Loading state (animated)
7. View AI results
   - Fault type
   - Confidence score
   - Recommended actions
   - Required parts
8. Options:
   - Create repair task
   - Request parts
   - Print report
```

### Flow 2: Inventory Management
```
1. Login → Dashboard
2. Click "Inventory" in navbar
3. View stock levels
4. Filter/Search items
5. Actions:
   - Add new item
   - Update quantity
   - Set reorder level
   - View alerts
6. Receive low stock notifications
7. Generate inventory report
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Mobile: 0-640px */
/* Tablet: 641px-1024px */
/* Desktop: 1025px+ */

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Considerations
- Hamburger menu for navigation
- Stack cards vertically
- Full-width forms
- Touch-friendly buttons (min 44px height)
- Simplified tables (card view on mobile)

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

#### Keyboard Navigation
- All interactive elements accessible via Tab
- Visible focus indicators
- Skip to main content link

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Form labels properly associated

#### Example Accessible Button
```jsx
<button 
  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
  aria-label="Start AI diagnosis"
  role="button"
  tabIndex={0}
>
  🤖 AI Diagnose
</button>
```

---

## 🎯 Key Pages Design

### 1. Dashboard
**Purpose**: Overview of system status and quick actions

**Components**:
- 4 stat cards (Total Repairs, Pending Tasks, Low Stock Items, Revenue)
- Line chart (Repairs over time)
- Recent activity table
- Quick action buttons

**Color Scheme**: Blue primary, neutral grays

### 2. Fault Diagnosis
**Purpose**: AI-powered device diagnosis

**Components**:
- Two-column layout
- Left: Input form with device selection
- Right: AI results with confidence meter
- Gradient purple/pink for AI branding

**Special Features**:
- Typewriter effect for AI responses
- Animated confidence bar
- Expandable repair recommendations

### 3. Inventory
**Purpose**: Manage spare parts and stock

**Components**:
- Search and filter bar
- Data table with sorting
- Stock level indicators (color-coded)
- Low stock alerts (red badges)

**Color Scheme**: Amber for warnings, red for critical

### 4. Reports
**Purpose**: Analytics and business intelligence

**Components**:
- Date range selector
- Multiple chart types (bar, line, pie)
- Export buttons (PDF, Excel)
- Print-friendly layout

---

## 🚀 Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Tailwind config with custom colors
- [ ] Create base component library
- [ ] Implement responsive navbar
- [ ] Add toast notifications

### Phase 2: Core Pages
- [ ] Redesign Dashboard with stat cards
- [ ] Enhance Fault Diagnosis UI
- [ ] Improve Inventory tables
- [ ] Update Forms styling

### Phase 3: Polish
- [ ] Add loading states
- [ ] Implement skeleton loaders
- [ ] Add micro-interactions
- [ ] Optimize for mobile

### Phase 4: Accessibility
- [ ] Audit color contrast
- [ ] Test keyboard navigation
- [ ] Add ARIA labels
- [ ] Screen reader testing

---

## 📚 Resources

### Design Tools
- **Figma**: For mockups and prototypes
- **Tailwind UI**: Component inspiration
- **Heroicons**: Icon library
- **Lucide React**: Icon components (already installed)

### Color Tools
- **Coolors.co**: Color palette generator
- **WebAIM Contrast Checker**: Accessibility testing

### Inspiration
- **Dribbble**: UI design inspiration
- **Behance**: Full project showcases
- **Tailwind Components**: Ready-to-use components

---

## 💡 Pro Tips

1. **Consistency is Key**: Use the same spacing, colors, and patterns throughout
2. **White Space**: Don't be afraid of empty space - it improves readability
3. **Visual Hierarchy**: Use size, color, and weight to guide user attention
4. **Feedback**: Always provide visual feedback for user actions
5. **Performance**: Optimize images and use lazy loading
6. **Testing**: Test on real devices, not just browser dev tools

---

**Last Updated**: April 2026
**Version**: 1.0
**Maintained by**: SmartFix Development Team
