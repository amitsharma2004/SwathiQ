# SwasthiQ Pharmacy Management System

## Project Overview

SwasthiQ Pharmacy Module is a comprehensive pharmacy management system designed for Indian pharmacies. It provides real-time inventory tracking, sales management, and dashboard analytics with automatic stock status updates and expiry monitoring.

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework for building APIs
- **PostgreSQL** (Supabase) - Production-ready relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Native Fetch API** - HTTP requests

## Setup Instructions

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Seed the database with sample data
python seed.py

# Run the development server
uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## API Contracts

### Dashboard APIs

#### GET /api/dashboard/summary
Get dashboard summary statistics

**Response:**
```json
{
  "today_sales": 124580.0,
  "sales_change_percent": 12.5,
  "items_sold_today": 156,
  "low_stock_count": 12,
  "purchase_orders_count": 5,
  "purchase_orders_value": 96250.0,
  "purchase_orders_status": "Pending"
}
```

#### GET /api/dashboard/recent-sales
Get last 10 sales

**Response:**
```json
[
  {
    "id": 1,
    "invoice_no": "INV-2024-1001",
    "patient_name": "Rajesh Kumar",
    "total_amount": 135.0,
    "payment_mode": "Cash",
    "items_count": 3,
    "status": "Completed",
    "created_at": "2024-03-11T10:30:00"
  }
]
```

#### POST /api/dashboard/new-sale
Create a new sale

**Request Body:**
```json
{
  "patient_name": "Priya Sharma",
  "payment_mode": "UPI",
  "items_count": 2,
  "status": "Completed",
  "items": [
    {
      "medicine_id": 1,
      "quantity": 10,
      "price": 50.0
    }
  ]
}
```

**Response:** (201 Created)
```json
{
  "id": 5,
  "invoice_no": "INV-2024-1005",
  "patient_name": "Priya Sharma",
  "total_amount": 50.0,
  "payment_mode": "UPI",
  "items_count": 2,
  "status": "Completed",
  "created_at": "2024-03-13T14:20:00"
}
```

### Inventory APIs

#### GET /api/inventory/medicines
Get medicines with optional filters

**Query Parameters:**
- `search` (optional) - Search by name or generic name
- `status` (optional) - Filter by status (Active, Low Stock, Expired, Out of Stock)
- `category` (optional) - Filter by category

**Response:**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 650mg",
    "generic_name": "Paracetamol",
    "category": "Analgesic",
    "batch_no": "PCM2024A",
    "expiry_date": "2025-12-31",
    "quantity": 500,
    "cost_price": 2.5,
    "mrp": 5.0,
    "supplier": "Cipla Ltd",
    "status": "Active",
    "created_at": "2024-03-10T08:00:00"
  }
]
```

#### GET /api/inventory/overview
Get inventory overview statistics

**Response:**
```json
{
  "total_items": 10,
  "active_stock": 7,
  "low_stock": 2,
  "total_value": 125000.50
}
```

#### POST /api/inventory/medicines
Add a new medicine

**Request Body:**
```json
{
  "name": "Aspirin 75mg",
  "generic_name": "Acetylsalicylic Acid",
  "category": "Antiplatelet",
  "batch_no": "ASP2024G",
  "expiry_date": "2025-10-20",
  "quantity": 100,
  "cost_price": 1.0,
  "mrp": 2.0,
  "supplier": "Bayer"
}
```

**Response:** (201 Created)
```json
{
  "id": 11,
  "name": "Aspirin 75mg",
  "generic_name": "Acetylsalicylic Acid",
  "category": "Antiplatelet",
  "batch_no": "ASP2024G",
  "expiry_date": "2025-10-20",
  "quantity": 100,
  "cost_price": 1.0,
  "mrp": 2.0,
  "supplier": "Bayer",
  "status": "Active",
  "created_at": "2024-03-13T15:00:00"
}
```

#### PUT /api/inventory/medicines/{id}
Update an existing medicine

**Request Body:**
```json
{
  "quantity": 50,
  "cost_price": 1.2,
  "mrp": 2.5
}
```

**Response:**
```json
{
  "id": 11,
  "name": "Aspirin 75mg",
  "quantity": 50,
  "cost_price": 1.2,
  "mrp": 2.5,
  "status": "Active",
  ...
}
```

#### PATCH /api/inventory/medicines/{id}/status
Manually override medicine status

**Request Body:**
```json
{
  "status": "Expired"
}
```

**Response:**
```json
{
  "id": 11,
  "status": "Expired",
  ...
}
```

#### DELETE /api/inventory/medicines/{id}
Delete a medicine

**Response:** 204 No Content

## Data Consistency Strategy

### Automatic Status Recalculation

The system ensures data consistency through automatic status updates based on business rules:

#### Status Logic
```python
def calculate_medicine_status(medicine):
    if medicine.expiry_date < today:
        return 'Expired'
    elif medicine.quantity == 0:
        return 'Out of Stock'
    elif medicine.quantity < 20:
        return 'Low Stock'
    else:
        return 'Active'
```

### When Status is Recalculated

1. **POST /api/inventory/medicines** - Status is auto-calculated on creation
2. **PUT /api/inventory/medicines/{id}** - Status is recalculated after any update
3. **POST /api/dashboard/new-sale** - Medicine status is updated after quantity deduction

### Transaction Handling

Sales with multiple items are handled atomically:

```python
# All operations in a single transaction
try:
    # 1. Create sale record
    new_sale = Sale(...)
    db.add(new_sale)
    db.flush()
    
    # 2. Create sale items and update medicine quantities
    for item in items:
        sale_item = SaleItem(...)
        db.add(sale_item)
        
        # 3. Deduct quantity
        medicine.quantity -= item.quantity
        
        # 4. Recalculate status
        medicine.status = calculate_status(medicine)
    
    # 5. Commit all changes together
    db.commit()
except:
    # Rollback if any operation fails
    db.rollback()
    raise
```

### Consistency Rules

1. **Quantity-Status Sync**: Medicine status always reflects current quantity
2. **Expiry Monitoring**: Expired medicines are automatically flagged
3. **Stock Alerts**: Low stock threshold (< 20 units) triggers status change
4. **Atomic Sales**: All sale operations succeed or fail together
5. **Validation**: Insufficient stock prevents sale completion

## Features

- 📊 Real-time dashboard with sales analytics
- 📦 Complete inventory management with search and filters
- 💊 Automatic medicine status tracking (Active, Low Stock, Expired, Out of Stock)
- 🛒 Sales management with invoice generation
- 📈 Sales trend analysis with percentage changes
- 🔍 Advanced search and filtering
- 💰 Inventory valuation tracking
- 🇮🇳 Indian currency formatting (₹)

## Database Schema

### Medicine Table
- Complete medicine details with batch tracking
- Automatic status management
- Expiry date monitoring
- Cost and MRP tracking

### Sale Table
- Invoice generation (INV-YYYY-XXXX format)
- Patient information
- Payment mode tracking
- Transaction timestamps

### SaleItem Table
- Links sales to medicines
- Quantity and price per item
- Supports multiple items per sale

## Live Link

🚀 **Backend API**: `http://localhost:8000`
📱 **Frontend App**: `http://localhost:3000`
📚 **API Docs**: `http://localhost:8000/docs`

---

Built with ❤️ for Indian Pharmacies
