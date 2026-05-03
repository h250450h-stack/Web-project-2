import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App'; 
import { authAPI } from '../api';

const Signup = () => {
  const { login } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This calls your Python backend at http://127.0.0
      const response = await authAPI.register(formData);
      
      if (response.status === 201) {
        alert("Account created successfully! Redirecting to login...");
        navigate('/login');
      }
    } catch (err) {
      // If the URL in api.js is wrong, this will show "Network Error"
      // If the email exists, it will show "User already exists"
      const errorMsg = err.response?.data?.message || "Connection failed. Is the Backend running?";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <h2 className="text-center mb-4 font-weight-bold">Create Account</h2>
              <p className="text-center text-muted mb-4 small">
                Join our store to start shopping in 2026.
              </p>

              {error && (
                <div className="alert alert-danger py-2 small text-center" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="small font-weight-bold">Username</label>
                  <input 
                    name="username" 
                    className="form-control" 
                    placeholder="e.g. ZimShop26"
                    onChange={handleChange} 
                    required 
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="small font-weight-bold">Email Address</label>
                  <input 
                    name="email" 
                    type="email" 
                    className="form-control" 
                    placeholder="name@example.com"
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
                    placeholder="Create a password"
                    onChange={handleChange} 
                    required 
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-lg btn-block shadow-sm w-100" 
                  style={{ borderRadius: '10px', fontWeight: 'bold' }}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="small text-muted mb-0">Already have an account?</p>
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-link text-primary font-weight-bold p-0"
                  style={{ textDecoration: 'none' }}
                >
                  Login here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
