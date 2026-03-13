from database import SessionLocal, engine
from sqlalchemy import text, inspect

db = SessionLocal()
inspector = inspect(engine)

print("📊 Tables in Supabase database:")
for table_name in inspector.get_table_names():
    print(f"  ✓ {table_name}")
    
    # Count records
    result = db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
    count = result.scalar()
    print(f"    Records: {count}")

db.close()
