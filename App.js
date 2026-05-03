// 1. ALL imports must be at the top of the file
import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Component Imports
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';

// 2. Context Logic
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔴 AUTO LOGIN DISABLED HERE
  const [user, setUser] = useState(null);

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, user, login, logout }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Navbar Component
const Navbar = () => {
  const { cart, user, logout } = useContext(CartContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand font-weight-bold" to="/">ZIM-STORE</Link>
        <div className="d-flex align-items-center">
          <Link className="nav-link text-white mr-3" to="/">Shop</Link>
          <Link className="nav-link text-white mr-3" to="/cart">
            Cart <span className="badge badge-primary ml-1">{cart.length}</span>
          </Link>
          {user ? (
            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-toggle="dropdown">
                {user.username}
              </button>
              <div className="dropdown-menu dropdown-menu-right shadow border-0">
                <button className="dropdown-item text-danger" onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <Link className="nav-link text-white mr-2" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm px-3" style={{borderRadius: '8px'}} to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// 4. Main App Wrapper
export default function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
          <Navbar />
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
          
          <footer className="text-center py-5 text-muted">
            <hr className="container" />
            <p className="small">&copy; 2026 My Zim Online Store. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}