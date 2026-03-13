from datetime import datetime, date, timedelta
from database import SessionLocal, engine, Base
from models import Medicine, Sale, SaleItem

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Clear existing data
    db.query(SaleItem).delete()
    db.query(Sale).delete()
    db.query(Medicine).delete()
    
    # Sample medicines with realistic Indian pharmacy data
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
        Medicine(
            name="Metformin 500mg",
            generic_name="Metformin",
            category="Antidiabetic",
            batch_no="MTF2024F",
            expiry_date=date(2026, 1, 25),
            quantity=400,
            cost_price=2.0,
            mrp=4.0,
            supplier="USV Ltd",
            status="Active"
        ),
        Medicine(
            name="Aspirin 75mg",
            generic_name="Acetylsalicylic Acid",
            category="Antiplatelet",
            batch_no="ASP2024G",
            expiry_date=date(2024, 2, 28),
            quantity=100,
            cost_price=1.0,
            mrp=2.0,
            supplier="Bayer",
            status="Expired"
        ),
        Medicine(
            name="Vitamin D3 60000 IU",
            generic_name="Cholecalciferol",
            category="Vitamin Supplement",
            batch_no="VTD2024H",
            expiry_date=date(2026, 8, 15),
            quantity=250,
            cost_price=15.0,
            mrp=30.0,
            supplier="Abbott",
            status="Active"
        ),
        Medicine(
            name="Cough Syrup 100ml",
            generic_name="Dextromethorphan",
            category="Cough Suppressant",
            batch_no="CGH2024I",
            expiry_date=date(2025, 5, 30),
            quantity=0,
            cost_price=45.0,
            mrp=85.0,
            supplier="Himalaya",
            status="Out of Stock"
        ),
        Medicine(
            name="Ibuprofen 400mg",
            generic_name="Ibuprofen",
            category="NSAID",
            batch_no="IBU2024J",
            expiry_date=date(2025, 10, 20),
            quantity=300,
            cost_price=3.5,
            mrp=7.0,
            supplier="Cipla Ltd",
            status="Active"
        )
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
        SaleItem(sale_id=sale1.id, medicine_id=medicines[7].id, quantity=2, price=60.0)
    ]
    db.add_all(sale1_items)
    
    sale2 = Sale(
        invoice_no="INV-2024-1002",
        patient_name="Priya Sharma",
        total_amount=220.0,
        payment_mode="UPI",
        items_count=2,
        status="Completed",
        created_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(sale2)
    db.commit()
    db.refresh(sale2)
    
    sale2_items = [
        SaleItem(sale_id=sale2.id, medicine_id=medicines[1].id, quantity=10, price=150.0),
        SaleItem(sale_id=sale2.id, medicine_id=medicines[4].id, quantity=12, price=72.0)
    ]
    db.add_all(sale2_items)
    
    sale3 = Sale(
        invoice_no="INV-2024-1003",
        patient_name="Amit Patel",
        total_amount=88.0,
        payment_mode="Card",
        items_count=2,
        status="Completed",
        created_at=datetime.utcnow()
    )
    db.add(sale3)
    db.commit()
    db.refresh(sale3)
    
    sale3_items = [
        SaleItem(sale_id=sale3.id, medicine_id=medicines[9].id, quantity=4, price=28.0),
        SaleItem(sale_id=sale3.id, medicine_id=medicines[7].id, quantity=2, price=60.0)
    ]
    db.add_all(sale3_items)
    
    sale4 = Sale(
        invoice_no="INV-2024-1004",
        patient_name="Sneha Reddy",
        total_amount=180.0,
        payment_mode="UPI",
        items_count=3,
        status="Completed",
        created_at=datetime.utcnow()
    )
    db.add(sale4)
    db.commit()
    db.refresh(sale4)
    
    sale4_items = [
        SaleItem(sale_id=sale4.id, medicine_id=medicines[3].id, quantity=5, price=110.0),
        SaleItem(sale_id=sale4.id, medicine_id=medicines[5].id, quantity=15, price=60.0),
        SaleItem(sale_id=sale4.id, medicine_id=medicines[0].id, quantity=2, price=10.0)
    ]
    db.add_all(sale4_items)
    
    db.commit()
    db.close()
    
    print("✅ Database seeded successfully!")
    print(f"   - {len(medicines)} medicines added")
    print("   - 4 sales with items added")

if __name__ == "__main__":
    seed_database()
