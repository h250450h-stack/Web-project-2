from flask_sqlalchemy import SQLAlchemy

# Initialize the SQLAlchemy object
# This allows you to import 'db' into models.py and app.py easily
db = SQLAlchemy()

def init_db(app):
    """
    Binds the SQLAlchemy instance to the Flask app 
    and creates the local database file and tables.
    """
    db.init_app(app)
    
    with app.app_context():
        # This creates the 'site.db' file and all tables (User, Order, Product)
        # because we are now using SQLite.
        try:
            db.create_all()
            print("SQLite Database initialized and tables created successfully.")
        except Exception as e:
            print(f"Error initializing database: {e}")
