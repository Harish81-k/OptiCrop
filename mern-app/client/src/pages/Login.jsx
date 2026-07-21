import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        tokenId: credentialResponse.credential,
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data || 'Google login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <>
      <style>{`
        .login-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
        }
        .line-input {
            border: none;
            border-bottom: 2px solid var(--border-color);
            border-radius: 0 !important;
            background-color: transparent;
            padding-left: 0;
            padding-right: 0;
            transition: border-color 0.3s ease;
        }
        .line-input:focus {
            background-color: transparent;
            outline: none;
            border-bottom-color: var(--agri-dark-green);
            box-shadow: none;
        }
        .password-wrapper {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 0;
            bottom: 8px;
            background: none;
            border: none;
            padding: 0;
            color: #6c757d;
            cursor: pointer;
        }
        .password-toggle:hover {
            color: var(--agri-dark-green);
        }
        .btn-agri {
            background-color: var(--agri-dark-green);
            color: #ffffff;
            border: none;
            font-weight: 500;
        }
        .btn-agri:hover {
            background-color: var(--agri-muted-green);
            color: #ffffff;
        }
        .btn-google {
            background-color: #ffffff;
            color: var(--agri-charcoal);
            border: 1px solid var(--border-color);
            font-weight: 500;
            transition: background-color 0.2s ease;
            text-decoration: none;
        }
        .btn-google:hover {
            background-color: #f8f9fa;
            color: var(--agri-charcoal);
        }
        .divider-text {
            position: relative;
            text-align: center;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .divider-text::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: var(--border-color);
            z-index: 1;
        }
        .divider-text span {
            background-color: var(--agri-cream);
            padding: 0 15px;
            position: relative;
            z-index: 2;
            color: #6c757d;
            font-size: 0.85rem;
        }
        .text-link {
            color: var(--agri-muted-green);
            text-decoration: none;
        }
        .text-link:hover {
            color: var(--agri-dark-green);
            text-decoration: underline;
        }
      `}</style>

      <div className="row justify-content-center my-5 py-4 animate-fade-in">
          <div className="col-md-5 col-lg-4">
              <div className="card login-card shadow-sm p-4 rounded-4 animate-scale-in delay-100">
                  
                  <div className="text-center mb-4 animate-fade-in-up delay-200">
                      <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                          Secure Gateway
                      </span>
                      <h3 className="fw-bold text-dark-green mt-3 mb-1">Welcome Back</h3>
                      <p className="text-muted small">Access your agronomy prediction workspace</p>
                  </div>

                  {error && <div className="alert alert-danger p-2 small animate-fade-in-up delay-200">{error}</div>}

                  <form onSubmit={handleSubmit} className="animate-fade-in-up delay-300">
                      <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary mb-1">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control line-input" required autoComplete="email" />
                      </div>

                      <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center">
                              <label className="form-label small fw-semibold text-secondary mb-1">Password</label>
                              <span className="text-link small" style={{cursor: 'pointer'}}>Forgot?</span>
                          </div>
                          <div className="password-wrapper">
                              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-control line-input pe-4" required autoComplete="current-password" />
                              <button type="button" onClick={togglePassword} className="password-toggle" aria-label="Toggle password visibility">
                                  {showPassword ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                      </svg>
                                  ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                  )}
                              </button>
                          </div>
                      </div>

                      <button type="submit" className="btn btn-agri w-100 py-2 rounded-3 mt-2 shadow-sm">
                          Sign In
                      </button>
                  </form>

                  <div className="divider-text animate-fade-in-up delay-400">
                      <span>or identity provider</span>
                  </div>

                  <div className="mb-4 d-flex justify-content-center animate-fade-in-up delay-500">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                      />
                  </div>

                  <div className="text-center pt-2 border-top animate-fade-in-up delay-600">
                      <p className="small text-muted mb-0">
                          Don't have an account? <Link to="/register" className="text-link fw-semibold">Create account</Link>
                      </p>
                  </div>

              </div>
          </div>
      </div>
    </>
  );
}

export default Login;
