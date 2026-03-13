from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Medicine(Base):
    __tablename__ = "medicines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    generic_name = Column(String)
    category = Column(String)
    batch_no = Column(String)
    expiry_date = Column(Date)
    quantity = Column(Integer)
    cost_price = Column(Float)
    mrp = Column(Float)
    supplier = Column(String)
    status = Column(String, default='Active')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sale_items = relationship("SaleItem", back_populates="medicine")

class Sale(Base):
    __tablename__ = "sales"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String, unique=True, nullable=False)
    patient_name = Column(String)
    total_amount = Column(Float)
    payment_mode = Column(String)
    items_count = Column(Integer)
    status = Column(String, default='Completed')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sale_items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"
    
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey('sales.id'))
    medicine_id = Column(Integer, ForeignKey('medicines.id'))
    quantity = Column(Integer)
    price = Column(Float)
    
    sale = relationship("Sale", back_populates="sale_items")
    medicine = relationship("Medicine", back_populates="sale_items")
