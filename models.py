from database import db
from datetime import datetime, timezone

class User(db.Model):
    """Handles Buyer Registration and Login"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    # Using timezone-aware datetime
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<User {self.username}>'

class Product(db.Model):
    """Stores items available in your online store"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)

class Order(db.Model):
    """Tracks Paynow transactions and statuses"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    
    # Paynow specific tracking
    poll_url = db.Column(db.String(255), unique=True, nullable=False)
    paynow_reference = db.Column(db.String(100), nullable=True)
    
    # Statuses: 'Pending', 'Paid', 'Sent', 'Cancelled', 'Failed'
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'
