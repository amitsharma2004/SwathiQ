from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List

# Medicine Schemas
class MedicineBase(BaseModel):
    name: str
    generic_name: Optional[str] = None
    category: Optional[str] = None
    batch_no: Optional[str] = None
    expiry_date: Optional[date] = None
    quantity: int
    cost_price: float
    mrp: float
    supplier: Optional[str] = None
    status: str = 'Active'

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    batch_no: Optional[str] = None
    expiry_date: Optional[date] = None
    quantity: Optional[int] = None
    cost_price: Optional[float] = None
    mrp: Optional[float] = None
    supplier: Optional[str] = None
    status: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Sale Item Schemas
class SaleItemBase(BaseModel):
    medicine_id: int
    quantity: int
    price: float

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemResponse(SaleItemBase):
    id: int
    sale_id: int
    
    class Config:
        from_attributes = True

# Sale Schemas
class SaleBase(BaseModel):
    invoice_no: str
    patient_name: Optional[str] = None
    total_amount: float
    payment_mode: str
    items_count: int
    status: str = 'Completed'

class SaleCreate(SaleBase):
    items: List[SaleItemCreate]

class SaleResponse(SaleBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardSummaryResponse(BaseModel):
    today_sales: float
    sales_change_percent: float
    items_sold_today: int
    low_stock_count: int
    purchase_orders_count: int
    purchase_orders_value: float
    purchase_orders_status: str

class InventoryOverviewResponse(BaseModel):
    total_items: int
    active_stock: int
    low_stock: int
    total_value: float
