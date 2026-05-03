import React, { useState, createContext, useEffect } from 'react';

// 1. Create the Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Store the cart items in an array
  const [cart, setCart] = useState([]);
  
  // Load the user from LocalStorage so they stay logged in if they refresh the page
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to add items to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Function to remove all items (used after successful payment or "Clear Cart" button)
  const clearCart = () => {
    setCart([]);
  };

  // Function to handle login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCart([]); // Optional: clear cart on logout
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      clearCart, 
      user, 
      login, 
      logout 
    }}>
      {children}
    </CartContext.Provider>
  );
};
