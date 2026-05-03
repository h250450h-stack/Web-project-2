import os
import re
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from paynow import Paynow
from dotenv import load_dotenv

# Modular Imports
from database import db, init_db
from models import User, Order, Product

# FIX: ensure .env loads properly
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

# FIX: CORS for frontend + JWT headers
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# DB config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') or f"sqlite:///{os.path.join(BASE_DIR, 'site.db')}"
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') or 'secret-key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)
jwt = JWTManager(app)

# FIX: safe env reading
PAYNOW_ID = os.getenv('PAYNOW_INTEGRATION_ID')
PAYNOW_KEY = os.getenv('PAYNOW_INTEGRATION_KEY')

if not PAYNOW_ID or not PAYNOW_KEY:
    raise Exception("Missing Paynow credentials in .env")

# FIX: Paynow init (KEEP localhost for testing only)
paynow = Paynow(
    PAYNOW_ID,
    PAYNOW_KEY,
    'http://localhost:3000/cart',
    'http://127.0.0.1:5000/api/paynow-update'
)

# ---------------- PRODUCTS ----------------
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([
        {"id": p.id, "name": p.name, "price": p.price, "description": p.description}
        for p in products
    ]), 200


# ---------------- REGISTER ----------------
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json

        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({"message": "User already exists"}), 400

        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=generate_password_hash(data.get('password'))
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# ---------------- LOGIN ----------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.email)

        return jsonify({
            "token": token,
            "email": user.email,
            "username": user.username
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401


# ---------------- CHECKOUT (FIXED) ----------------
@app.route('/api/checkout', methods=['POST'])
@jwt_required()
def checkout():
    data = request.json
    email = get_jwt_identity()
    items = data.get('items', [])

    # FIX: Paynow will fail if the email is empty or invalid. 
    # This regex ensures we only send a valid email format.
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not email or not re.match(email_regex, str(email)):
        return jsonify({"error": f"Invalid email identity: {email}"}), 400

    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    # FIX: strict safe calculation
    total = 0.0
    clean_items = []

    for item in items:
        try:
            name = str(item.get('name', 'Item'))
            price = float(item.get('price', 0))

            if price <= 0:
                continue

            total += price
            clean_items.append({"name": name, "price": price})

        except:
            return jsonify({"error": "Invalid item format"}), 400

    total = round(total, 2)

    if total <= 0:
        return jsonify({"error": "Invalid cart total"}), 400

    # Create Paynow payment
    # NOTE: Paynow requires a valid email string. 
    # If get_jwt_identity() is not an email, this will fail.
    payment = paynow.create_payment(
        f"ORDER-{os.urandom(3).hex().upper()}",
        email
    )

    for item in clean_items:
        payment.add(item["name"], item["price"])

    response = paynow.send(payment)

    # UPDATED LOGGING: This will now show the actual error message string
    print("--- PAYNOW DEBUG ---")
    print("PAYNOW SUCCESS:", response.success)
    if not response.success:
        # We use str() and check for the 'error' attribute properly
        error_detail = getattr(response, 'error', 'Unknown Error')
        print(f"PAYNOW ERROR MESSAGE: {error_detail}")
        print(f"DEBUG DATA - Email: {email}, Total: {total}")
    print("--------------------")

    if response.success:
        order = Order(
            user_email=email,
            total_amount=total,
            poll_url=response.poll_url
        )

        db.session.add(order)
        db.session.commit()

        return jsonify({
            "link": response.redirect_url,
            "poll_url": response.poll_url
        })

    return jsonify({
        "error": "Paynow failed",
        "details": str(getattr(response, 'error', 'Paynow rejected the request'))
    }), 400


# ---------------- PAYNOW UPDATE ----------------
@app.route('/api/paynow-update', methods=['POST'])
def paynow_update():
    poll_url = request.form.get('pollurl')

    if not poll_url:
        return "Missing pollurl", 400

    status = paynow.check_transaction_status(poll_url)

    order = Order.query.filter_by(poll_url=poll_url).first()
    if order:
        order.status = str(status.status)
        db.session.commit()

    return "OK", 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
