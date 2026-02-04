# T018 - Implement order status update API endpoints with email notifications

## Files Created/Modified

### 1. `/home/nick/Nick/Printguys-AI/printguys-nextjs/src/app/api/admin/orders/[id]/status/route.ts`
- Updated with admin authentication using `isAdmin()` from `@/lib/auth`
- Added support for `trackingNumber`, `carrier` (as `shippingMethod`), and `notes` in request body
- Enhanced to fetch order with user relation included
- Updated to track timestamps automatically (shippedAt, deliveredAt, cancelledAt)
- Notes are now appended to `internalNotes` with timestamp format: `[timestamp] note`
- Email notifications sent when status is "SHIPPED" with tracking number using existing `orderShipped` template

### 2. `/home/nick/Nick/Printguys-AI/printguys-nextjs/src/app/api/admin/orders/bulk-status/route.ts`
- Created new bulk status update endpoint
- Added admin authentication
- Accepts `orderIds[]`, `status`, `trackingNumbers` (object mapping), and `notes`
- Updates all specified orders with new status
- Supports individual tracking numbers per order
- Tracks and sends email notifications for shipped orders
- Returns summary of updated orders

## API Endpoints Added

### 1. Update Single Order Status
**Endpoint:** `PATCH /api/admin/orders/[id]/status`

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1234567890",
  "carrier": "Canada Post",
  "notes": "Package dispatched"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "PG-2024-001",
    "status": "SHIPPED",
    "trackingNumber": "1234567890",
    "shippingMethod": "Canada Post",
    "internalNotes": "[timestamp] Package dispatched",
    "shippedAt": "2024-01-26T...",
    // ... other order fields
  }
}
```

### 2. Bulk Update Order Status
**Endpoint:** `POST /api/admin/orders/bulk-status`

**Request Body:**
```json
{
  "orderIds": ["id1", "id2", "id3"],
  "status": "SHIPPED",
  "trackingNumbers": {
    "id1": "1234567890",
    "id2": { "number": "0987654321", "carrier": "UPS" }
  },
  "notes": "Bulk shipment prepared"
}
```

**Response:**
```json
{
  "success": true,
  "updatedCount": 3,
  "emailSentCount": 2,
  "orders": [
    {
      "id": "id1",
      "orderNumber": "PG-2024-001",
      "status": "SHIPPED",
      "trackingNumber": "1234567890"
    },
    // ... other orders
  ]
}
```

## Example API Usage (curl commands)

### Update Single Order
```bash
curl -X PATCH \
  http://localhost:3000/api/admin/orders/ord_123456/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED",
    "trackingNumber": "123456789012",
    "carrier": "Canada Post",
    "notes": "Package dispatched with tracking"
  }'
```

### Bulk Update Orders
```bash
curl -X POST \
  http://localhost:3000/api/admin/orders/bulk-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderIds": ["ord_123456", "ord_789012"],
    "status": "SHIPPED",
    "trackingNumbers": {
      "ord_123456": "123456789012",
      "ord_789012": { "number": "987654321098", "carrier": "UPS" }
    },
    "notes": "Bulk shipment prepared today"
  }'
```

## Features Implemented

1. **Admin Authentication**: Both endpoints verify admin status before allowing updates
2. **Status Management**: Automatic timestamp handling for shipped, delivered, and cancelled orders
3. **Tracking Information**: Support for tracking numbers and carrier information
4. **Internal Notes**: Notes are appended with timestamps to `internalNotes` field
5. **Email Notifications**: Automatic shipment emails using existing template
6. **Error Handling**: Proper error responses with appropriate HTTP status codes
7. **Bulk Operations**: Efficient batch updates with individual tracking support

## Error Handling

- **401 Unauthorized**: When user is not an admin
- **400 Bad Request**: Missing required fields or invalid data
- **404 Not Found**: When order doesn't exist
- **500 Server Error**: For unexpected errors during update or email sending

Email sending failures are logged but don't fail the request, ensuring the order update still succeeds.

## Notes

- Uses `shippingMethod` field for carrier information (as per Prisma schema)
- Notes use `internalNotes` field with timestamp format: `[YYYY-MM-DD HH:MM:SS] note`
- Email template from `emailTemplates.orderShipped()` is reused for consistency
- Bulk endpoint uses POST method to distinguish from single order updates

TASK_COMPLETED
