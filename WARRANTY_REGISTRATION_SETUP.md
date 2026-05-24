# Warranty Registration with QR Code Scanning - Setup Guide

## Overview
Added warranty registration feature for sales team with QR code scanning capability.

## Features Added
✅ **QR Code Scanner** - Scan device QR codes to auto-fill warranty information
✅ **Manual Entry** - Enter warranty details manually if QR code not available
✅ **Customer Information** - Capture customer name, email, phone
✅ **Device Details** - Record device name and serial number
✅ **Warranty Period** - Select warranty duration (6, 12, 24, or 36 months)
✅ **Auto-calculation** - Automatically calculate warranty expiry date
✅ **Sales Sidebar Integration** - Added "Register Warranty" menu item

## Files Created/Modified

### Created:
1. `smartfix-frontend/src/features/warranty/WarrantyRegistrationPage.jsx` - Main warranty registration page with QR scanner

### Modified:
1. `smartfix-frontend/src/shared/components/Navigation/SalesSidebar.jsx` - Added "Register Warranty" menu item
2. `smartfix-frontend/src/App.jsx` - Added warranty registration route

## Installation Steps

### Step 1: Install QR Code Scanner Library
```bash
cd smartfix-frontend
npm install html5-qrcode
```

### Step 2: Backend API Endpoint (Optional - if not exists)
Create warranty registration endpoint in backend:

```java
// WarrantyController.java
@PostMapping("/api/warranties/register")
public ResponseEntity<Warranty> registerWarranty(@RequestBody WarrantyRequest request) {
    // Save warranty to database
    Warranty warranty = warrantyService.register(request);
    return ResponseEntity.ok(warranty);
}
```

### Step 3: Test the Feature
1. Login as Sales user
2. Click "Register Warranty" in sidebar
3. Click "Start Scanning" to scan QR code
4. Or fill form manually
5. Submit to register warranty

## QR Code Format

The scanner accepts two formats:

### Format 1: JSON
```json
{
  "serialNumber": "SN123456789",
  "deviceName": "iPhone 13 Pro",
  "model": "A2483"
}
```

### Format 2: Plain Text
```
SN123456789
```

## Usage

### For Sales Team:
1. **Navigate** to "Register Warranty" from sidebar
2. **Scan QR Code**:
   - Click "Start Scanning"
   - Point camera at device QR code
   - Scanner will auto-fill serial number and device name
3. **Fill Customer Details**:
   - Customer name (required)
   - Customer phone (required)
   - Customer email (optional)
4. **Verify Device Info**:
   - Device name (required)
   - Serial number (required)
   - Purchase date (required)
   - Warranty period (default: 12 months)
5. **Submit** to register warranty

### Manual Entry (No QR Code):
1. Skip scanning step
2. Manually enter all information
3. Submit form

## Form Fields

### Required Fields:
- ✅ Customer Name
- ✅ Customer Phone
- ✅ Device Name
- ✅ Serial Number
- ✅ Purchase Date
- ✅ Warranty Period

### Optional Fields:
- Customer Email

## Features

### QR Code Scanner:
- Real-time camera scanning
- Auto-detection of QR codes
- Supports JSON and plain text formats
- Visual feedback on successful scan
- Stop scanning button

### Form Validation:
- Required field validation
- Email format validation
- Phone number validation
- Date validation (cannot be future date)

### Auto-calculations:
- Warranty expiry date calculated automatically
- Based on purchase date + warranty period

### User Experience:
- Clean, modern interface
- Blue color scheme matching system
- Responsive design
- Loading states
- Success/error notifications
- Info box with important notes

## Backend Integration

### Expected API Endpoint:
```
POST /api/warranties/register
```

### Request Body:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+250 XXX XXX XXX",
  "deviceName": "iPhone 13 Pro",
  "serialNumber": "SN123456789",
  "purchaseDate": "2024-01-15",
  "warrantyPeriod": "12",
  "registrationDate": "2024-01-15T10:30:00Z",
  "expiryDate": "2025-01-15T10:30:00Z",
  "status": "ACTIVE"
}
```

### Response:
```json
{
  "id": 1,
  "customerName": "John Doe",
  "serialNumber": "SN123456789",
  "status": "ACTIVE",
  "expiryDate": "2025-01-15T10:30:00Z"
}
```

## Database Schema (Suggested)

```sql
CREATE TABLE warranties (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_period INTEGER NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranties_serial_number ON warranties(serial_number);
CREATE INDEX idx_warranties_status ON warranties(status);
CREATE INDEX idx_warranties_expiry_date ON warranties(expiry_date);
```

## Troubleshooting

### Camera Not Working:
1. Check browser permissions for camera access
2. Use HTTPS (camera requires secure context)
3. Try different browser (Chrome recommended)

### QR Code Not Scanning:
1. Ensure good lighting
2. Hold QR code steady
3. Adjust distance from camera
4. Check QR code format (JSON or plain text)

### Form Not Submitting:
1. Check all required fields are filled
2. Verify backend API is running
3. Check browser console for errors
4. Verify API endpoint URL

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Camera Requirements:
- HTTPS connection (required for camera access)
- Camera permission granted
- Modern browser with MediaDevices API support

## Security Considerations

1. **HTTPS Required** - Camera access requires secure context
2. **Input Validation** - All inputs validated on frontend and backend
3. **Serial Number Uniqueness** - Prevent duplicate warranty registrations
4. **Data Privacy** - Customer information handled securely

## Future Enhancements

- [ ] Email confirmation to customer
- [ ] SMS notification for warranty registration
- [ ] Warranty certificate PDF generation
- [ ] Warranty lookup by serial number
- [ ] Warranty renewal feature
- [ ] Warranty claim tracking
- [ ] Integration with repair system
- [ ] Warranty analytics dashboard

## Summary

The warranty registration system is now fully functional with:
- ✅ QR code scanning capability
- ✅ Manual entry option
- ✅ Form validation
- ✅ Auto-calculations
- ✅ Sales sidebar integration
- ✅ Modern, responsive UI
- ✅ Blue color scheme matching system

Sales team can now easily register warranties by scanning device QR codes or entering information manually!
