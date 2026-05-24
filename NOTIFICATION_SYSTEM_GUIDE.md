# Notification System Guide

## Overview
The SmartFix notification system provides real-time alerts to users based on their roles. Notifications are stored in the database and can be filtered, marked as read, and cleared.

## Features
✅ **Role-based notifications** - Different notifications for Admin, Inventory Manager, Sales, and Technician
✅ **Real-time updates** - Notifications are fetched from the backend
✅ **Unread count badge** - Shows number of unread notifications
✅ **Filter by type** - Filter notifications by category
✅ **Mark as read** - Click on notification to mark as read
✅ **Mark all as read** - Bulk mark all notifications as read
✅ **Clear all** - Delete all notifications
✅ **Action buttons** - Quick links to relevant pages

## Notification Types

### 1. Stock Out Alert (`stockout`)
- **Triggered when**: Item quantity reaches 0
- **Target role**: Inventory Manager
- **Icon**: Red warning triangle
- **Action**: View Inventory

### 2. Low Stock Alert (`low-stock`)
- **Triggered when**: Item quantity falls below reorder point
- **Target role**: Inventory Manager
- **Icon**: Yellow warning triangle
- **Action**: View Inventory

### 3. Item Restocked (`restocked`)
- **Triggered when**: Item is restocked
- **Target role**: Inventory Manager
- **Icon**: Green package check
- **Action**: View Inventory

### 4. Repair Completed (`repair-completed`)
- **Triggered when**: Technician completes a repair
- **Target roles**: Sales team, specific technician
- **Icon**: Blue check circle
- **Action**: View Repairs

### 5. Warranty Expiry (`warranty-expiry`)
- **Triggered when**: Device warranty is about to expire
- **Target role**: Sales team
- **Icon**: Orange warning triangle
- **Action**: View device details

## Backend API Endpoints

### Get Notifications
```
GET /api/notifications?role={role}&userId={userId}
```
Returns all notifications for the user based on role and user ID.

### Get Unread Count
```
GET /api/notifications/unread-count?role={role}&userId={userId}
```
Returns the count of unread notifications.

### Mark as Read
```
PUT /api/notifications/{id}/read
```
Marks a specific notification as read.

### Mark All as Read
```
PUT /api/notifications/mark-all-read?role={role}&userId={userId}
```
Marks all notifications as read for the user.

### Delete Notification
```
DELETE /api/notifications/{id}
```
Deletes a specific notification.

### Clear All
```
DELETE /api/notifications/clear-all?role={role}&userId={userId}
```
Deletes all notifications for the user.

### Create Test Notification
```
POST /api/notifications/test
Body: {
  "title": "Test Notification",
  "detail": "This is a test",
  "type": "low-stock",
  "role": "inventory"
}
```
Creates a test notification (for development/testing).

## Database Schema

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail VARCHAR(1000),
    type VARCHAR(50) NOT NULL,
    user_role VARCHAR(50),
    user_id BIGINT,
    action_path VARCHAR(255),
    action_label VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
```

## How to Use

### 1. Setup Database
Run the migration script:
```bash
psql -U postgres -d smartfix -f database_migrations/create_notifications_table.sql
```

### 2. Restart Backend
```bash
cd smartfix
mvnw clean compile
mvnw spring-boot:run
```

### 3. Test Notifications
Create a test notification:
```bash
curl -X POST http://localhost:8080/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Low Stock Alert",
    "detail": "iPhone Screen is running low",
    "type": "low-stock",
    "role": "inventory"
  }'
```

### 4. View Notifications
- Login as Inventory Manager
- Click on "Notifications" in the sidebar
- You should see the test notification

## Integration with Other Modules

### Inventory Module
When stock levels change, automatically create notifications:

```java
@Autowired
private NotificationService notificationService;

// When stock goes below reorder point
if (item.getQuantity() < item.getReorderPoint()) {
    notificationService.createStockAlert(
        item.getName(), 
        item.getQuantity(), 
        "low-stock"
    );
}

// When stock reaches 0
if (item.getQuantity() == 0) {
    notificationService.createStockAlert(
        item.getName(), 
        item.getQuantity(), 
        "stockout"
    );
}

// When item is restocked
if (oldQuantity < reorderPoint && newQuantity >= reorderPoint) {
    notificationService.createRestockNotification(
        item.getName(), 
        newQuantity
    );
}
```

### Repair Module
When repair is completed:

```java
notificationService.createRepairCompletionNotification(
    deviceType, 
    customerName, 
    technicianId
);
```

## UI Features

### Unread Badge
Shows count of unread notifications in the header/sidebar.

### Visual Indicators
- **Unread notifications**: Blue background
- **Read notifications**: White background
- **Bold text**: Unread notification titles

### Filters
- All
- Stock Out
- Low Stock
- Restocked
- Repair Completed
- Warranty Expiry

### Actions
- **Click notification**: Mark as read
- **Mark all read**: Bulk mark all as read
- **Clear all**: Delete all notifications
- **Action button**: Navigate to relevant page

## Troubleshooting

### No notifications showing
1. Check if backend is running: `http://localhost:8080/api/notifications?role=inventory`
2. Check database: `SELECT * FROM notifications;`
3. Check browser console for errors
4. Verify user role is correct

### Notifications not updating
1. Refresh the page
2. Check network tab for API calls
3. Verify backend is responding

### Database errors
1. Run migration script: `create_notifications_table.sql`
2. Check PostgreSQL is running
3. Verify database connection in `application.properties`

## Future Enhancements
- Real-time push notifications using WebSocket
- Email notifications for critical alerts
- SMS notifications for urgent issues
- Notification preferences/settings
- Notification history archive
- Notification templates
