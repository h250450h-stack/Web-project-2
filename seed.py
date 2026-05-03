# Create a file named seed.py in your backend folder and run it
from app import app
from database import db
from models import Product

with app.app_context():
    # Only add if the table is empty
    if not Product.query.first():
        products = [
            Product(name="Premium Zim Coffee", price=15.00, description="Dark roast beans from the Eastern Highlands.", stock=10),
            Product(name="Wireless Pro Headphones", price=85.50, description="Noise-cancelling over-ear headphones.", stock=5),
            Product(name="Smart Fitness Watch", price=45.00, description="Track your steps and heart rate.", stock=20),
            Product(name="Leather Travel Bag", price=120.00, description="Handcrafted genuine leather.", stock=3),
            Product(name="Organic Green Tea", price=10.50, description="Refreshing herbal tea.", stock=50)
        ]
        db.session.bulk_save_objects(products)
        db.session.commit()
        print("5 Products added successfully!")
    else:
        print("Products already exist in database.")
