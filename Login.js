import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App'; // Updated to point to App.js
import { authAPI } from '../api';

const Login = () => {
  const { login } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (isRegistering) {
        response = await authAPI.register(formData);
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        login(response.data); 
        navigate('/cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <h2 className="text-center mb-4 font-weight-bold">
                {isRegistering ? 'Join Us' : 'Welcome Back'}
              </h2>
              <p className="text-center text-muted mb-4 small">
                {isRegistering 
                  ? 'Create an account to start shopping.' 
                  : 'Login to access your cart and checkout.'}
              </p>
              
              {error && (
                <div className="alert alert-danger py-2 small text-center" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {isRegistering && (
                  <div className="form-group mb-3">
                    <label className="small font-weight-bold">Username</label>
                    <input
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                  </div>
                )}
                
                <div className="form-group mb-3">
                  <label className="small font-weight-bold">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </div>
                
                <div className="form-group mb-4">
                  <label className="small font-weight-bold">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg btn-block shadow-sm"
                  style={{ borderRadius: '10px', fontWeight: 'bold' }}
                >
                  {isRegistering ? 'CREATE ACCOUNT' : 'LOGIN'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="small text-muted mb-0">
                  {isRegistering ? 'Already have an account?' : "New to our store?"}
                </p>
                <button 
                  onClick={() => setIsRegistering(!isRegistering)} 
                  className="btn btn-link text-primary font-weight-bold p-0"
                  style={{ textDecoration: 'none' }}
                >
                  {isRegistering ? 'Login here' : 'Register here'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              Secure Store | &copy; 2024
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
