import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App';
import { checkoutAPI } from '../api';

const Cart = () => {
  const { cart, user, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate the grand total
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to proceed to checkout.");
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // FIXED: clean + safe conversion
      const cleanItems = cart.map(item => ({
        name: item.name,
        price: Number(item.price) || 0
      }));

      const orderData = {
        items: cleanItems,
        total_amount: total,
        email: user.email
      };

      const response = await checkoutAPI.startPayment(orderData);

      if (response.data.link) {
        window.location.href = response.data.link;
      }
    } catch (error) {
      // 🔴 IMPORTANT DEBUG FIX (so we can see real backend error)
      console.log("FULL ERROR:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);

      alert(error.response?.data?.error || "Checkout failed. Check console.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">

        {/* Left Side */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4 mb-3">
            <h2 className="mb-4">🛒 Your Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted h5">Your cart is feeling a bit light...</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                  Go Shopping
                </button>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {cart.map((item, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                      <h6 className="mb-0 font-weight-bold">{item.name}</h6>
                      <small className="text-muted">High Quality Item</small>
                    </div>
                    <span className="badge badge-pill badge-light text-dark" style={{ fontSize: '1.1rem' }}>
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <button onClick={clearCart} className="btn btn-link text-danger p-0 mt-2">
              Clear all items from cart
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <h4 className="mb-4">Order Summary</h4>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <span className="text-muted">Shipping</span>
              <span className="text-success font-weight-bold">FREE</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="h5">Total</span>
              <span className="h5 text-primary">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-success btn-lg btn-block shadow-sm"
              style={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Proceed to Payment
            </button>

            <div className="text-center mt-3">
              <small className="text-muted">
                Securely processed by <br />
                <strong>Paynow Zimbabwe</strong>
              </small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;