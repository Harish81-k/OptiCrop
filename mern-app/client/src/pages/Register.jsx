import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <>
      <style>{`
        .register-card {
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
        .text-link {
            color: var(--agri-muted-green);
            text-decoration: none;
        }
        .text-link:hover {
            color: var(--agri-dark-green);
            text-decoration: underline;
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
      `}</style>

      <div className="row justify-content-center my-5 py-4 animate-fade-in">
          <div className="col-md-5 col-lg-4">
              <div className="card register-card shadow-sm p-4 rounded-4 animate-scale-in delay-100">
                  
                  <div className="text-center mb-4 animate-fade-in-up delay-200">
                      <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                          New Operator
                      </span>
                      <h3 className="fw-bold text-dark-green mt-3 mb-1">Create Account</h3>
                      <p className="text-muted small">Initialize your optimization platform</p>
                  </div>

                  {error && <div className="alert alert-danger p-2 small animate-fade-in-up delay-200">{error}</div>}

                  <form onSubmit={handleSubmit} className="animate-fade-in-up delay-300">
                      <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary mb-1">Full Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control line-input" required autoComplete="name" />
                      </div>

                      <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary mb-1">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control line-input" required autoComplete="email" />
                      </div>

                      <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary mb-1">Create Password</label>
                          <div className="password-wrapper">
                              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-control line-input pe-4" required autoComplete="new-password" />
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

                      <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary mb-1">Confirm Password</label>
                          <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control line-input" required autoComplete="new-password" />
                      </div>

                      <button type="submit" className="btn btn-agri w-100 py-2 rounded-3 mt-2 shadow-sm">
                          Create Account
                      </button>
                  </form>

                  <div className="divider-text animate-fade-in-up delay-400">
                      <span>or identity provider</span>
                  </div>

                  <a href="http://localhost:5000/api/auth/google" className="btn btn-google w-100 py-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm mb-4 animate-fade-in-up delay-500">
                      <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.55 2.97-2.22 5.5-4.78 7.21l7.45 5.78c4.35-4.01 6.98-9.92 6.98-17.25z"/>
                          <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.45-5.78c-2.07 1.39-4.72 2.22-8.44 2.22-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      Sign up with Google
                  </a>

                  <div className="text-center pt-2 border-top animate-fade-in-up delay-600">
                      <p className="small text-muted mb-0">
                          Already have an account? <Link to="/login" className="text-link fw-semibold">Sign in here</Link>
                      </p>
                  </div>

              </div>
          </div>
      </div>
    </>
  );
}

export default Register;
