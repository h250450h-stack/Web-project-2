import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../App'; // Updated to point to App.js
import { productAPI } from '../api';

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        // If the backend returns products, use them. 
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          throw new Error("No products in database");
        }
      } catch (error) {
        console.error("Using fallback products:", error);
        // Fallback list of 5 products that matches your original Database Model
        setProducts([
          { id: 1, name: "Premium Zim Coffee", price: 15.00, description: "Dark roast beans from the Eastern Highlands." },
          { id: 2, name: "Wireless Pro Headphones", price: 85.50, description: "Noise-cancelling over-ear headphones." },
          { id: 3, name: "Smart Fitness Watch", price: 45.00, description: "Track your steps, heart rate, and sleep." },
          { id: 4, name: "Leather Travel Bag", price: 120.00, description: "Handcrafted genuine leather weekender bag." },
          { id: 5, name: "Organic Green Tea", price: 10.50, description: "Refreshing herbal tea with antioxidants." },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading store...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="font-weight-bold" style={{ letterSpacing: '-1px' }}>Our Collection</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Explore our latest arrivals. High-quality products curated just for you.
        </p>
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '20px' }}>
              {/* Simple Visual Placeholder (No specific icons needed in DB) */}
              <div style={{ 
                height: '180px', 
                backgroundColor: '#f1f3f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px'
              }}>
                <span style={{ fontSize: '3.5rem' }}>📦</span>
              </div>
              
              <div className="card-body d-flex flex-column p-4">
                <div className="mb-2">
                  <span className="badge badge-success px-3 py-2 mb-2" style={{ borderRadius: '10px' }}>Available</span>
                  <h5 className="card-title font-weight-bold mb-1">{product.name}</h5>
                </div>
                
                <p className="card-text text-muted small flex-grow-1">
                  {product.description || "Premium quality product available for immediate delivery."}
                </p>
                
                <hr className="my-4" />
                
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Price</small>
                    <span className="h4 mb-0 text-dark font-weight-bold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(product);
                      alert(`${product.name} added to cart!`);
                    }}
                    className="btn btn-dark px-4 py-2 shadow-sm"
                    style={{ borderRadius: '12px', fontWeight: '600' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
