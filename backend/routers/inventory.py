from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import date
from typing import List, Optional
from database import get_db
from models import Medicine
from schemas import (
    MedicineResponse,
    MedicineCreate,
    MedicineUpdate,
    InventoryOverviewResponse
)

router = APIRouter()

def calculate_medicine_status(medicine: Medicine) -> str:
    """Calculate medicine status based on quantity and expiry date"""
    if medicine.expiry_date and medicine.expiry_date < date.today():
        return 'Expired'
    elif medicine.quantity == 0:
        return 'Out of Stock'
    elif medicine.quantity < 20:
        return 'Low Stock'
    else:
        return 'Active'

@router.get("/medicines", response_model=List[MedicineResponse])
def get_medicines(
    search: Optional[str] = Query(None, description="Search by name or generic name"),
    status: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Medicine)
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Medicine.name.ilike(f"%{search}%"),
                    Medicine.generic_name.ilike(f"%{search}%")
                )
            )
        
        # Apply status filter
        if status:
            query = query.filter(Medicine.status == status)
        
        # Apply category filter
        if category:
            query = query.filter(Medicine.category == category)
        
        medicines = query.all()
        return medicines
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching medicines: {str(e)}"
        )

@router.get("/overview", response_model=InventoryOverviewResponse)
def get_inventory_overview(db: Session = Depends(get_db)):
    try:
        # Total items
        total_items = db.query(Medicine).count()
        
        # Active stock count
        active_stock = db.query(Medicine).filter(Medicine.status == 'Active').count()
        
        # Low stock count
        low_stock = db.query(Medicine).filter(Medicine.quantity < 20, Medicine.quantity > 0).count()
        
        # Total inventory value (quantity * cost_price)
        total_value = db.query(
            func.sum(Medicine.quantity * Medicine.cost_price)
        ).scalar() or 0.0
        
        return InventoryOverviewResponse(
            total_items=total_items,
            active_stock=active_stock,
            low_stock=low_stock,
            total_value=round(total_value, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching inventory overview: {str(e)}"
        )

@router.post("/medicines", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
def create_medicine(medicine_data: MedicineCreate, db: Session = Depends(get_db)):
    try:
        # Create medicine instance
        new_medicine = Medicine(**medicine_data.dict())
        
        # Auto-calculate status
        new_medicine.status = calculate_medicine_status(new_medicine)
        
        db.add(new_medicine)
        db.commit()
        db.refresh(new_medicine)
        
        return new_medicine
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating medicine: {str(e)}"
        )

@router.put("/medicines/{id}", response_model=MedicineResponse)
def update_medicine(
    id: int,
    medicine_data: MedicineUpdate,
    db: Session = Depends(get_db)
):
    try:
        medicine = db.query(Medicine).filter(Medicine.id == id).first()
        
        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medicine with id {id} not found"
            )
        
        # Update fields
        update_data = medicine_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(medicine, field, value)
        
        # Recalculate status automatically
        medicine.status = calculate_medicine_status(medicine)
        
        db.commit()
        db.refresh(medicine)
        
        return medicine
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating medicine: {str(e)}"
        )

@router.patch("/medicines/{id}/status", response_model=MedicineResponse)
def update_medicine_status(
    id: int,
    status_data: dict,
    db: Session = Depends(get_db)
):
    try:
        medicine = db.query(Medicine).filter(Medicine.id == id).first()
        
        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medicine with id {id} not found"
            )
        
        new_status = status_data.get('status')
        if not new_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status field is required"
            )
        
        # Validate status value
        valid_statuses = ['Active', 'Low Stock', 'Expired', 'Out of Stock']
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Manually override status
        medicine.status = new_status
        
        db.commit()
        db.refresh(medicine)
        
        return medicine
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating medicine status: {str(e)}"
        )

@router.delete("/medicines/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(id: int, db: Session = Depends(get_db)):
    try:
        medicine = db.query(Medicine).filter(Medicine.id == id).first()
        
        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medicine with id {id} not found"
            )
        
        # Hard delete
        db.delete(medicine)
        db.commit()
        
        return None
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting medicine: {str(e)}"
        )
