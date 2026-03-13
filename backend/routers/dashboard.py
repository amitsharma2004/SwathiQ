from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from typing import List
from database import get_db
from models import Medicine, Sale, SaleItem
from schemas import (
    DashboardSummaryResponse,
    SaleResponse,
    SaleCreate,
    SaleItemCreate
)

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    try:
        today = date.today()
        
        # Today's sales
        today_sales = db.query(func.sum(Sale.total_amount)).filter(
            func.date(Sale.created_at) == today
        ).scalar() or 0.0
        
        # Yesterday's sales for comparison
        yesterday = date.today().replace(day=date.today().day - 1)
        yesterday_sales = db.query(func.sum(Sale.total_amount)).filter(
            func.date(Sale.created_at) == yesterday
        ).scalar() or 0.0
        
        # Calculate percentage change
        if yesterday_sales > 0:
            sales_change_percent = ((today_sales - yesterday_sales) / yesterday_sales) * 100
        else:
            sales_change_percent = 100.0 if today_sales > 0 else 0.0
        
        # Items sold today
        items_sold_today = db.query(func.sum(SaleItem.quantity)).join(Sale).filter(
            func.date(Sale.created_at) == today
        ).scalar() or 0
        
        # Low stock count (quantity < 20)
        low_stock_count = db.query(Medicine).filter(Medicine.quantity < 20).count()
        
        # Purchase orders (placeholder values)
        purchase_orders_count = 0
        purchase_orders_value = 0.0
        purchase_orders_status = "Pending"
        
        return DashboardSummaryResponse(
            today_sales=today_sales,
            sales_change_percent=round(sales_change_percent, 2),
            items_sold_today=items_sold_today,
            low_stock_count=low_stock_count,
            purchase_orders_count=purchase_orders_count,
            purchase_orders_value=purchase_orders_value,
            purchase_orders_status=purchase_orders_status
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard summary: {str(e)}"
        )

@router.get("/recent-sales", response_model=List[SaleResponse])
def get_recent_sales(db: Session = Depends(get_db)):
    try:
        sales = db.query(Sale).order_by(Sale.created_at.desc()).limit(10).all()
        return sales
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recent sales: {str(e)}"
        )

@router.post("/new-sale", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_new_sale(sale_data: SaleCreate, db: Session = Depends(get_db)):
    try:
        # Validate items exist and have sufficient quantity
        total_amount = 0.0
        items_to_create = []
        
        for item in sale_data.items:
            medicine = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
            if not medicine:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Medicine with id {item.medicine_id} not found"
                )
            
            if medicine.quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient quantity for {medicine.name}. Available: {medicine.quantity}"
                )
            
            # Calculate item total
            item_total = item.quantity * medicine.mrp
            total_amount += item_total
            
            items_to_create.append({
                'medicine': medicine,
                'quantity': item.quantity,
                'price': item_total
            })
        
        # Generate invoice number
        year = datetime.now().year
        last_sale = db.query(Sale).order_by(Sale.id.desc()).first()
        next_number = (last_sale.id + 1) if last_sale else 1
        invoice_no = f"INV-{year}-{next_number:04d}"
        
        # Create sale
        new_sale = Sale(
            invoice_no=invoice_no,
            patient_name=sale_data.patient_name,
            total_amount=total_amount,
            payment_mode=sale_data.payment_mode,
            items_count=len(sale_data.items),
            status=sale_data.status
        )
        db.add(new_sale)
        db.flush()
        
        # Create sale items and update medicine quantities
        for item_data in items_to_create:
            medicine = item_data['medicine']
            quantity = item_data['quantity']
            
            # Create sale item
            sale_item = SaleItem(
                sale_id=new_sale.id,
                medicine_id=medicine.id,
                quantity=quantity,
                price=item_data['price']
            )
            db.add(sale_item)
            
            # Update medicine quantity
            medicine.quantity -= quantity
            
            # Update medicine status based on quantity
            if medicine.quantity == 0:
                medicine.status = 'Out of Stock'
            elif medicine.quantity < 20:
                medicine.status = 'Low Stock'
            else:
                medicine.status = 'Active'
        
        db.commit()
        db.refresh(new_sale)
        
        return new_sale
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating sale: {str(e)}"
        )
