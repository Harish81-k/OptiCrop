import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const data = location.state;

  if (!data) return <div className="text-center mt-5">No prediction data. <Link to="/predict">Go back</Link></div>;

  return (
    <>
      <style>{`
        .result-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
        }
        .crop-verdict {
            color: var(--agri-dark-green);
            font-size: 3.5rem;
            font-weight: 800;
            letter-spacing: -1px;
            text-transform: capitalize;
        }
        .matrix-title {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.75px;
            font-weight: 700;
            color: var(--agri-muted-green);
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed var(--border-color);
        }
        .metric-row:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-size: 0.9rem;
            color: #6c757d;
            font-weight: 500;
        }
        .metric-value {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--agri-charcoal);
        }
        .btn-agri-outline {
            color: var(--agri-dark-green);
            background-color: transparent;
            border: 2px solid var(--agri-dark-green);
            font-weight: 600;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn-agri-outline:hover {
            color: #ffffff;
            background-color: var(--agri-dark-green);
        }
      `}</style>
      <div className="row justify-content-center my-5 animate-fade-in-up">
          <div className="col-lg-7">
              <div className="card result-card shadow-sm p-4 p-md-5 rounded-4 text-center animate-scale-in delay-100">
                  
                  <div className="mb-4">
                      <span className="text-uppercase tracking-wider small fw-bold text-success px-3 py-1 rounded-pill bg-light border animate-fade-in delay-200">
                          <i className="bi bi-cpu-fill me-1"></i> Optimization Model Match Verified
                      </span>
                  </div>

                  <p className="text-muted small mb-1 animate-fade-in-up delay-300">Recommended Agro-Ecological Match</p>
                  <h1 className="crop-verdict mb-4 animate-scale-in delay-400">
                      {data.crop}
                  </h1>
                  <p className="text-muted mb-4 animate-fade-in delay-500">Confidence: {data.confidence}%</p>

                  <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

                  <div className="text-start px-2 mb-4 animate-fade-in-up delay-600">
                      <div className="row g-4">
                          
                          <div className="col-md-6">
                              <h6 className="matrix-title mb-3">Soil Chemistry Matrix</h6>
                              <div className="bg-light p-3 rounded-3 border">
                                  <div className="metric-row">
                                      <span className="metric-label">Nitrogen (N)</span>
                                      <span className="metric-value">{data.N || '-'} <span className="text-muted fw-normal small">mg/kg</span></span>
                                  </div>
                                  <div className="metric-row">
                                      <span className="metric-label">Phosphorus (P)</span>
                                      <span className="metric-value">{data.P || '-'} <span className="text-muted fw-normal small">mg/kg</span></span>
                                  </div>
                                  <div className="metric-row">
                                      <span className="metric-label">Potassium (K)</span>
                                      <span className="metric-value">{data.K || '-'} <span className="text-muted fw-normal small">mg/kg</span></span>
                                  </div>
                                  <div className="metric-row">
                                      <span className="metric-label">Soil pH Balance</span>
                                      <span className="metric-value fw-bold text-success">{data.ph || '-'}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="col-md-6">
                              <h6 className="matrix-title mb-3">Macro-Climate Inputs</h6>
                              <div className="bg-light p-3 rounded-3 border">
                                  <div className="metric-row">
                                      <span className="metric-label">Temperature</span>
                                      <span className="metric-value">{data.temperature || '-'} °C</span>
                                  </div>
                                  <div className="metric-row">
                                      <span className="metric-label">Relative Humidity</span>
                                      <span className="metric-value">{data.humidity || '-'} %</span>
                                  </div>
                                  <div className="metric-row">
                                      <span className="metric-label">Annual Rainfall</span>
                                      <span className="metric-value">{data.rainfall || '-'} mm</span>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

                  <div className="container py-5 animate-fade-in-up">
                      <Link to="/predict" className="btn btn-agri-outline btn-lg px-5 py-3 rounded-3 shadow-sm w-100 w-sm-auto">
                          <i className="bi bi-arrow-counterclockwise me-2"></i> Initialize New Diagnostic Run
                      </Link>
                  </div>

              </div>
          </div>
      </div>
    </>
  );
}

export default Result;
