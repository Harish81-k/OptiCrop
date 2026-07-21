import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active-link' : 'nav-link';
  };

  return (
    <>
      <style>{`
        .navbar-agri {
            background-color: #ffffff;
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
        }
        .navbar-agri .navbar-brand {
            color: var(--agri-dark-green);
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .navbar-agri .nav-link {
            color: #555555;
            font-weight: 500;
            font-size: 0.95rem;
            padding: 0.5rem 1rem !important;
            transition: color 0.2s ease;
        }
        .navbar-agri .nav-link:hover {
            color: var(--agri-dark-green);
        }
        .navbar-agri .nav-link.active-link {
            color: var(--agri-dark-green);
            font-weight: 600;
        }
        .navbar-agri .btn-logout {
            color: #b02a37 !important;
        }
        .navbar-agri .btn-logout:hover {
            background-color: #fdf2f2;
            border-radius: 6px;
        }
      `}</style>
      <nav className="navbar navbar-expand-lg navbar-agri sticky-top">
          <div className="container">
              <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                  <span style={{color: 'var(--agri-dark-green)'}}>OptiCrop</span>
                  <span className="text-muted fw-normal fs-6 d-none d-sm-inline">| Engine</span>
              </Link>

              <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                  <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="nav">
                  <ul className="navbar-nav ms-auto gap-1">
                      <li className="nav-item">
                          <Link className={getLinkClass('/')} to="/"><i className="bi bi-house me-1"></i> Home</Link>
                      </li>

                      {user ? (
                        <>
                          <li className="nav-item">
                              <Link className={getLinkClass('/predict')} to="/predict"><i className="bi bi-graph-up me-1"></i> Predict</Link>
                          </li>
                          <li className="nav-item">
                              <Link className={getLinkClass('/dashboard')} to="/dashboard"><i className="bi bi-speedometer2 me-1"></i> Dashboard</Link>
                          </li>

                          <li className="nav-item">
                              <Link className={getLinkClass('/assistant')} to="/assistant">
                                  <i className="bi bi-robot me-1"></i> AI Assistant
                              </Link>
                          </li>

                          <li className="nav-item">
                              <button className="nav-link btn-logout btn btn-link text-decoration-none" onClick={logout}>
                                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                              </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="nav-item">
                              <Link className={getLinkClass('/login')} to="/login"><i className="bi bi-box-arrow-in-right me-1"></i> Login</Link>
                          </li>
                          <li className="nav-item">
                              <Link className={getLinkClass('/register')} to="/register"><i className="bi bi-person-plus me-1"></i> Register</Link>
                          </li>
                        </>
                      )}
                  </ul>
              </div>
          </div>
      </nav>
    </>
  );
}

export default Navbar;
