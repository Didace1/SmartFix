# SmartFix UI Mockups & Wireframes

## 📱 Page Layouts

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  SmartFix Logo    Dashboard  Diagnosis  Inventory  Reports  👤  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Dashboard Overview                                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────┐│
│  │ 🔧           │  │ 📦           │  │ 👥           │  │ 💰  ││
│  │ Total Repairs│  │ Low Stock    │  │ Technicians  │  │ Rev ││
│  │              │  │              │  │              │  │     ││
│  │    1,234     │  │     23       │  │      8       │  │ 45K ││
│  │ ↑ 12% growth │  │ ⚠️ Alert     │  │ Active now   │  │ ↑8% ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────┘│
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌─────────────────┐ │
│  │                                     │  │                 │ │
│  │   Repairs Over Time (Chart)        │  │  Quick Actions  │ │
│  │                                     │  │                 │ │
│  │   [Line Chart showing trends]       │  │  🤖 AI Diagnose │ │
│  │                                     │  │  ➕ New Repair  │ │
│  │                                     │  │  📊 View Report │ │
│  │                                     │  │  📦 Check Stock │ │
│  │                                     │  │                 │ │
│  └─────────────────────────────────────┘  └─────────────────┘ │
│                                                                 │
│  Recent Activity                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Device        │ Customer    │ Status      │ Actions       │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ iPhone 13 Pro │ John Doe    │ ✅ Complete │ View Details  │ │
│  │ Dell XPS 15   │ Jane Smith  │ 🔄 Progress │ View Details  │ │
│  │ MacBook Pro   │ Bob Johnson │ ⏳ Pending  │ View Details  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. AI Fault Diagnosis Page

```
┌─────────────────────────────────────────────────────────────────┐
│  SmartFix Logo    Dashboard  Diagnosis  Inventory  Reports  👤  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🤖 AI-Powered Fault Diagnosis                                  │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │                          │  │                              ││
│  │  Device Information      │  │  AI Diagnosis Results        ││
│  │                          │  │                              ││
│  │  Brand: [Dropdown ▼]     │  │  ┌────────────────────────┐ ││
│  │  □ Apple                 │  │  │ 🤖 AI Analysis         │ ││
│  │  □ Dell                  │  │  │                        │ ││
│  │  □ HP                    │  │  │ Detected Fault:        │ ││
│  │                          │  │  │ Battery Failure        │ ││
│  │  Model: [Dropdown ▼]     │  │  │                        │ ││
│  │  □ iPhone 13 Pro         │  │  │ Confidence: 95%        │ ││
│  │  □ iPhone 14             │  │  │ ████████████████░░ 95% │ ││
│  │                          │  │  │                        │ ││
│  │  Serial: [___________]   │  │  │ Recommended Actions:   │ ││
│  │                          │  │  │ • Replace battery      │ ││
│  │  Symptoms:               │  │  │ • Check charging port  │ ││
│  │  ┌────────────────────┐  │  │  │ • Test power adapter   │ ││
│  │  │ Device won't turn  │  │  │  │                        │ ││
│  │  │ on after charging  │  │  │  │ Required Parts:        │ ││
│  │  │ overnight...       │  │  │  │ • Battery (A2483)      │ ││
│  │  │                    │  │  │  │ • Adhesive strips      │ ││
│  │  └────────────────────┘  │  │  │                        │ ││
│  │                          │  │  │ Estimated Time: 45 min │ ││
│  │  📎 Upload Images        │  │  │ Cost: $89.99           │ ││
│  │  [Choose Files]          │  │  └────────────────────────┘ ││
│  │                          │  │                              ││
│  │  ┌────────────────────┐  │  │  [Create Repair Task]        ││
│  │  │ 🤖 AI DIAGNOSE     │  │  │  [Request Parts]             ││
│  │  └────────────────────┘  │  │  [Print Report]              ││
│  │                          │  │                              ││
│  └──────────────────────────┘  └──────────────────────────────┘│
│                                                                 │
│  Previous Diagnoses                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Date       │ Device      │ Fault        │ Confidence      │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 2026-04-19 │ iPhone 13   │ Battery      │ 95% ✅          │ │
│  │ 2026-04-18 │ Dell XPS    │ Hard Drive   │ 88% ✅          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Inventory Management Page

```
┌─────────────────────────────────────────────────────────────────┐
│  SmartFix Logo    Dashboard  Diagnosis  Inventory  Reports  👤  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Inventory Management                                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 📦 Total     │  │ ⚠️ Low Stock │  │ 🔴 Out of    │         │
│  │    Items     │  │    Items     │  │    Stock     │         │
│  │    456       │  │     23       │  │      5       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [+ Add Item]  [Filter ▼]  [Search: ____________] [🔍]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Part Name      │ SKU    │ Qty │ Status    │ Actions      │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ iPhone Battery │ A2483  │ 45  │ ✅ In Stock│ Edit | View │ │
│  │ LCD Screen     │ S1234  │ 12  │ ⚠️ Low     │ Edit | View │ │
│  │ Charging Port  │ C5678  │ 3   │ 🔴 Critical│ Edit | View │ │
│  │ Back Cover     │ B9012  │ 0   │ ❌ Out     │ Edit | View │ │
│  │ Camera Module  │ M3456  │ 28  │ ✅ In Stock│ Edit | View │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [← Previous]  Page 1 of 12  [Next →]                          │
│                                                                 │
│  Stock Alerts                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ⚠️ LCD Screen (S1234) - Only 12 units left                │ │
│  │ 🔴 Charging Port (C5678) - Critical: 3 units remaining    │ │
│  │ ❌ Back Cover (B9012) - Out of stock, reorder needed      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Reports & Analytics Page

```
┌─────────────────────────────────────────────────────────────────┐
│  SmartFix Logo    Dashboard  Diagnosis  Inventory  Reports  👤  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Reports & Analytics                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Date Range: [2026-03-01] to [2026-04-20]  [Generate]   │   │
│  │ Report Type: [All Reports ▼]  [Export PDF] [Export CSV]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │                          │  │                          │   │
│  │  Revenue Trend           │  │  Repairs by Category     │   │
│  │                          │  │                          │   │
│  │  [Line Chart]            │  │  [Pie Chart]             │   │
│  │   $                      │  │   Battery: 35%           │   │
│  │   │    ╱╲                │  │   Screen: 28%            │   │
│  │   │   ╱  ╲  ╱            │  │   Charging: 15%          │   │
│  │   │  ╱    ╲╱             │  │   Other: 22%             │   │
│  │   └──────────────        │  │                          │   │
│  │    Mar  Apr              │  │                          │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │                          │  │                          │   │
│  │  Top Technicians         │  │  Customer Satisfaction   │   │
│  │                          │  │                          │   │
│  │  1. John Smith - 45      │  │  [Bar Chart]             │   │
│  │  2. Jane Doe - 38        │  │   ★★★★★ 85%             │   │
│  │  3. Bob Wilson - 32      │  │   ★★★★☆ 12%             │   │
│  │  4. Alice Brown - 28     │  │   ★★★☆☆ 2%              │   │
│  │  5. Mike Davis - 24      │  │   ★★☆☆☆ 1%              │   │
│  │                          │  │                          │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
│                                                                 │
│  Detailed Metrics                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Metric              │ This Month │ Last Month │ Change   │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Total Repairs       │    234     │    198     │ ↑ 18%    │ │
│  │ Average Time        │   45 min   │   52 min   │ ↓ 13%    │ │
│  │ Customer Rating     │    4.8/5   │    4.6/5   │ ↑ 4%     │ │
│  │ Revenue             │   $45.2K   │   $41.8K   │ ↑ 8%     │ │
│  │ Parts Cost          │   $12.3K   │   $11.9K   │ ↑ 3%     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Mobile Responsive Layout

```
┌─────────────────────┐
│ ☰  SmartFix     👤  │
├─────────────────────┤
│                     │
│  Dashboard          │
│                     │
│  ┌─────────────────┐│
│  │ 🔧 Repairs      ││
│  │     1,234       ││
│  │   ↑ 12%         ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 📦 Low Stock    ││
│  │      23         ││
│  │   ⚠️ Alert      ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 👥 Technicians  ││
│  │       8         ││
│  │   Active        ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ 💰 Revenue      ││
│  │    $45.2K       ││
│  │   ↑ 8%          ││
│  └─────────────────┘│
│                     │
│  Quick Actions      │
│  ┌─────────────────┐│
│  │ 🤖 AI Diagnose  ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ ➕ New Repair   ││
│  └─────────────────┘│
│                     │
│  Recent Activity    │
│  ┌─────────────────┐│
│  │ iPhone 13 Pro   ││
│  │ John Doe        ││
│  │ ✅ Complete     ││
│  └─────────────────┘│
│                     │
└─────────────────────┘
```

## 🎨 Color Usage Examples

### Status Colors
- **Green** (#10b981): Completed, In Stock, Success
- **Yellow** (#f59e0b): In Progress, Low Stock, Warning
- **Red** (#ef4444): Failed, Out of Stock, Critical
- **Blue** (#3b82f6): Pending, Information, Primary Actions
- **Purple** (#8b5cf6): AI Features, Premium Features

### Component Colors
- **Cards**: White background (#ffffff) with gray border (#e5e7eb)
- **Hover States**: Light gray (#f9fafb)
- **Text Primary**: Dark gray (#111827)
- **Text Secondary**: Medium gray (#6b7280)
- **AI Gradient**: Purple to Pink (#8b5cf6 → #ec4899)

## 📐 Spacing System

```
4px   - xs  - Tight spacing
8px   - sm  - Small spacing
12px  - md  - Medium spacing
16px  - lg  - Large spacing
24px  - xl  - Extra large spacing
32px  - 2xl - Section spacing
48px  - 3xl - Major section spacing
```

## 🔤 Typography Scale

```
12px - Caption text, badges
14px - Body small, table text
16px - Body text, form inputs
18px - Body large, subheadings
20px - H5
24px - H4
28px - H3
32px - H2
40px - H1, Page titles
```

## 🎯 Interactive States

### Button States
```
Default:  bg-blue-600
Hover:    bg-blue-700 + shadow-md
Active:   bg-blue-800
Disabled: bg-gray-300 + cursor-not-allowed
Focus:    ring-2 ring-blue-500
```

### Input States
```
Default:  border-gray-300
Focus:    ring-2 ring-blue-500 + border-transparent
Error:    border-red-500 + ring-red-500
Success:  border-green-500 + ring-green-500
Disabled: bg-gray-100 + cursor-not-allowed
```

## 🌊 Animation Guidelines

### Transitions
- **Duration**: 200ms for most interactions
- **Easing**: ease-in-out for smooth transitions
- **Properties**: color, background-color, border-color, transform, opacity

### Hover Effects
- Buttons: Slight color change + shadow increase
- Cards: Shadow increase (shadow-sm → shadow-md)
- Links: Color change + underline
- Icons: Scale up slightly (scale-105)

### Loading States
- Spinner: Continuous rotation
- Skeleton: Pulse animation
- Progress bars: Smooth width transition

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   - Single column, stacked layout
Tablet:   640-1024px - Two columns, simplified nav
Desktop:  > 1024px   - Full layout, all features
```

### Mobile Optimizations
- Hamburger menu instead of full navbar
- Stack stat cards vertically
- Full-width forms
- Simplified tables (card view)
- Larger touch targets (min 44px)
- Bottom navigation for key actions

## ✅ Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Alt text on images
- [ ] Form labels properly associated
- [ ] Error messages descriptive
- [ ] Skip to main content link
- [ ] Semantic HTML elements
- [ ] Screen reader tested

---

**Design Version**: 1.0  
**Last Updated**: April 2026  
**Tools Used**: ASCII Art, Mermaid Diagrams  
**Next Steps**: Create high-fidelity mockups in Figma
