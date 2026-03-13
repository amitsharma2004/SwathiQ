from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import dashboard, inventory
from models import Medicine, Sale, SaleItem
from datetime import datetime, date, timedelta

app = FastAPI(
    title="SwasthiQ Pharmacy API",
    description="Pharmacy Management System API",
    version="1.0.0"
)

# CORS middleware - Update with your Vercel frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-mu-neon-53.vercel.app",  # Your Vercel frontend
        "http://localhost:3000",  # Local development
        "*"  # Allow all for development (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])

@app.on_event("startup")
def startup_event():
    """Create tables and seed data if database is empty"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Check if database is empty and seed if needed
    db = SessionLocal()
    try:
        medicine_count = db.query(Medicine).count()
        if medicine_count == 0:
            print("📦 Seeding database with initial data...")
            seed_initial_data(db)
            print("✅ Database seeded successfully!")
    finally:
        db.close()

def seed_initial_data(db):
    """Seed initial data into database"""
    # Sample medicines
    medicines = [
        Medicine(
            name="Paracetamol 650mg",
            generic_name="Paracetamol",
            category="Analgesic",
            batch_no="PCM2024A",
            expiry_date=date(2025, 12, 31),
            quantity=500,
            cost_price=2.5,
            mrp=5.0,
            supplier="Cipla Ltd",
            status="Active"
        ),
        Medicine(
            name="Amoxicillin 500mg",
            generic_name="Amoxicillin",
            category="Antibiotic",
            batch_no="AMX2024B",
            expiry_date=date(2025, 6, 30),
            quantity=200,
            cost_price=8.0,
            mrp=15.0,
            supplier="Sun Pharma",
            status="Active"
        ),
        Medicine(
            name="Cetirizine 10mg",
            generic_name="Cetirizine",
            category="Antihistamine",
            batch_no="CTZ2024C",
            expiry_date=date(2026, 3, 15),
            quantity=350,
            cost_price=1.5,
            mrp=3.0,
            supplier="Dr. Reddy's",
            status="Active"
        ),
        Medicine(
            name="Azithromycin 500mg",
            generic_name="Azithromycin",
            category="Antibiotic",
            batch_no="AZT2024D",
            expiry_date=date(2025, 9, 20),
            quantity=150,
            cost_price=12.0,
            mrp=22.0,
            supplier="Lupin",
            status="Active"
        ),
        Medicine(
            name="Omeprazole 20mg",
            generic_name="Omeprazole",
            category="Antacid",
            batch_no="OMP2024E",
            expiry_date=date(2025, 11, 10),
            quantity=8,
            cost_price=3.0,
            mrp=6.0,
            supplier="Torrent Pharma",
            status="Low Stock"
        ),
    ]
    
    db.add_all(medicines)
    db.commit()
    
    # Refresh to get IDs
    for med in medicines:
        db.refresh(med)
    
    # Sample sales
    sale1 = Sale(
        invoice_no="INV-2024-1001",
        patient_name="Rajesh Kumar",
        total_amount=135.0,
        payment_mode="Cash",
        items_count=3,
        status="Completed",
        created_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(sale1)
    db.commit()
    db.refresh(sale1)
    
    sale1_items = [
        SaleItem(sale_id=sale1.id, medicine_id=medicines[0].id, quantity=10, price=50.0),
        SaleItem(sale_id=sale1.id, medicine_id=medicines[2].id, quantity=5, price=15.0),
    ]
    db.add_all(sale1_items)
    db.commit()

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "SwasthiQ Pharmacy API"
    }

# For Vercel serverless deployment
handler = app
