import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <>
      <style>{`
        .profile-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
        }
        .meta-label {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: #6c757d;
        }
        .meta-value {
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--agri-charcoal);
        }
        .profile-divider {
            border-top: 1px dashed var(--border-color);
            margin: 1.5rem 0;
        }
      `}</style>
      <div className="row justify-content-center my-5 animate-fade-in-up">
          <div className="col-lg-6 col-md-8">
              <div className="card profile-card shadow-sm p-4 p-md-5 animate-scale-in delay-100">
                  
                  <div className="text-center mb-5 animate-fade-in-up delay-200">
                      <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                          Identity Parameters
                      </span>
                      <h3 className="fw-bold text-dark-green mt-3 mb-1">User Profile</h3>
                      <p className="text-muted small">Registered credentials and operational node access</p>
                  </div>

                  <div className="px-2 animate-fade-in-up delay-300">
                      <div className="row align-items-center">
                          <div className="col-sm-4 mb-1 mb-sm-0">
                              <span className="meta-label">Full Name</span>
                          </div>
                          <div className="col-sm-8">
                              <span className="meta-value">{user.name}</span>
                          </div>
                      </div>

                      <div className="profile-divider"></div>

                      <div className="row align-items-center">
                          <div className="col-sm-4 mb-1 mb-sm-0">
                              <span className="meta-label">Email Node</span>
                          </div>
                          <div className="col-sm-8">
                              <span className="meta-value text-break font-monospace small">{user.email}</span>
                          </div>
                      </div>

                      <div className="profile-divider"></div>

                      <div className="row align-items-center">
                          <div className="col-sm-4 mb-1 mb-sm-0">
                              <span className="meta-label">Registration</span>
                          </div>
                          <div className="col-sm-8">
                              <span className="meta-value text-muted small">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                              </span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </>
  );
}

export default Profile;
