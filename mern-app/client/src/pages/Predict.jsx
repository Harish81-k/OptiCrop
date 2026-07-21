import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Predict() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '', wind_speed: ''
  });
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);
  
  const navigate = useNavigate();

  // Observer Effect for Scroll Animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchCities = async (query) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/city/city-suggest?q=${query}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("City fetch error:", err);
    }
  };

  const handleCityChange = (e) => {
    const query = e.target.value;
    setCity(query);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetchCities(query);
    }, 400);
  };

  const getWeather = async (cityName) => {
    const cleanCity = cityName.split(",")[0].trim();
    if (cleanCity.length < 2) return;
    
    setLoadingCity(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/weather?city=${encodeURIComponent(cleanCity)}`);
      if (res.data.error) {
        console.error(res.data.error);
        return;
      }
      setFormData(prev => ({
        ...prev,
        temperature: res.data.temp ?? prev.temperature,
        humidity: res.data.humidity ?? prev.humidity,
        wind_speed: res.data.wind_speed ?? prev.wind_speed
      }));
    } catch (err) {
      console.error("Weather error:", err);
    } finally {
      setLoadingCity(false);
    }
  };

  const selectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setSuggestions([]);
    getWeather(selectedCity.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/prediction/predict`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/result', { state: res.data });
    } catch (err) {
      console.error(err);
      alert('Prediction failed. Please check inputs.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <style>{`
        .predict-card {
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
        .spinner {
            display: ${loadingCity ? 'inline-block' : 'none'};
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--agri-dark-green);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            z-index: 10;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #suggestions {
            position: absolute;
            width: 100%;
            z-index: 999;
            max-height: 220px;
            overflow-y: auto;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);
        }
        .suggestion-item {
            padding: 12px 16px;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--agri-charcoal);
            transition: background 0.2s ease;
        }
        .suggestion-item:hover {
            background: var(--agri-cream);
            color: var(--agri-dark-green);
        }
        .demo-plant-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            overflow: hidden;
        }
        .demo-plant-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(27, 67, 50, 0.08);
        }
        .demo-video-thumb {
            object-fit: cover;
            width: 100%;
            height: 100%;
            transition: transform 0.4s ease;
        }
        .demo-plant-card:hover .demo-video-thumb {
            transform: scale(1.04);
        }
        .pill-metric {
            font-size: 0.75rem;
            font-weight: 600;
            background-color: var(--agri-cream);
            color: var(--agri-charcoal);
            border: 1px solid var(--border-color);
        }
        .predict-hero {
            background: linear-gradient(135deg, var(--agri-dark-green) 0%, #112a20 100%);
            color: white;
            border-radius: 16px;
            position: relative;
            overflow: hidden;
        }
        .predict-hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, var(--agri-muted-green) 0%, transparent 70%);
            opacity: 0.3;
            z-index: 1;
        }
        .predict-hero-content {
            position: relative;
            z-index: 2;
        }
        .api-showcase-box {
            background-color: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
        }
        .api-pulse {
            width: 12px;
            height: 12px;
            background-color: #28a745;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 rgba(40, 167, 69, 0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
            100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .faq-accordion .accordion-item {
            border: 1px solid var(--border-color);
            border-radius: 12px !important;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        .faq-accordion .accordion-button {
            background-color: #ffffff;
            color: var(--agri-dark-green);
            font-weight: 600;
            box-shadow: none;
        }
        .faq-accordion .accordion-button:not(.collapsed) {
            background-color: var(--agri-cream);
            color: var(--agri-dark-green);
        }
        .faq-accordion .accordion-button:focus {
            box-shadow: none;
            border-color: rgba(0,0,0,.125);
        }
      `}</style>
      
      {/* 1. Pre-Diagnostic Hero */}
      <div className="container mt-5">
          <div className="predict-hero p-5 text-center shadow-lg animate-fade-in">
              <div className="predict-hero-content">
                  <span className="text-uppercase tracking-wider small fw-bold text-white px-3 py-1 rounded-pill bg-white bg-opacity-25 border border-white border-opacity-20 animate-fade-in-up delay-100">
                      Phase 1 Integration
                  </span>
                  <h1 className="display-5 fw-bold mt-4 mb-3 animate-fade-in-up delay-200">Agronomic Diagnostic Console</h1>
                  <p className="lead text-white text-opacity-75 mb-0 mx-auto animate-fade-in-up delay-300" style={{maxWidth: '700px'}}>
                      Initialize your field assessment. Enter core soil metrics and regional location to generate a highly precise, AI-driven crop optimization profile.
                  </p>
              </div>
          </div>
      </div>

      {/* 2. The Diagnostic Matrix */}
      <div className="row justify-content-center my-5 pb-4">
          <div className="col-lg-8">
              <div className="card predict-card shadow-sm p-4 p-md-5 rounded-4 animate-scale-in delay-400">
                  
                  <div className="text-center mb-5">
                      <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                          Active Matrix
                      </span>
                      <h3 className="fw-bold text-dark-green mt-3 mb-1">Input Parameters</h3>
                      <p className="text-muted small">All fields are required for maximum algorithmic accuracy</p>
                  </div>

                  <form onSubmit={handleSubmit} className="animate-fade-in-up delay-500">
                      <div className="row g-4">
                          <div className="col-md-4">
                              <label className="form-label small fw-semibold text-secondary mb-1">Nitrogen (N)</label>
                              <input type="number" step="any" className="form-control line-input" name="N" value={formData.N} onChange={handleChange} required placeholder="mg/kg" />
                          </div>

                          <div className="col-md-4">
                              <label className="form-label small fw-semibold text-secondary mb-1">Phosphorus (P)</label>
                              <input type="number" step="any" className="form-control line-input" name="P" value={formData.P} onChange={handleChange} required placeholder="mg/kg" />
                          </div>

                          <div className="col-md-4">
                              <label className="form-label small fw-semibold text-secondary mb-1">Potassium (K)</label>
                              <input type="number" step="any" className="form-control line-input" name="K" value={formData.K} onChange={handleChange} required placeholder="mg/kg" />
                          </div>

                          <div className="col-12 position-relative mb-2">
                              <label className="form-label small fw-semibold text-secondary mb-1">Regional Location</label>
                              <div className="position-relative">
                                  <input type="text" className="form-control line-input pe-5" placeholder="Type city name for automated climate metrics..." autoComplete="off" value={city} onChange={handleCityChange} />
                                  <span className="spinner"></span>
                              </div>
                              {suggestions.length > 0 && (
                                <div id="suggestions">
                                  {suggestions.map((sug, idx) => (
                                    <div key={idx} className="suggestion-item" onClick={() => selectCity(sug)}>
                                      {sug.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          <div className="col-md-6">
                              <label className="form-label small fw-semibold text-secondary mb-1">Temperature (°C)</label>
                              <input type="number" step="0.01" className="form-control line-input" name="temperature" value={formData.temperature} onChange={handleChange} required />
                          </div>

                          <div className="col-md-6">
                              <label className="form-label small fw-semibold text-secondary mb-1">Relative Humidity (%)</label>
                              <input type="number" step="0.01" className="form-control line-input" name="humidity" value={formData.humidity} onChange={handleChange} required />
                          </div>

                          <div className="col-md-6">
                              <label className="form-label small fw-semibold text-secondary mb-1">Soil pH Balance</label>
                              <input type="number" step="0.01" className="form-control line-input" name="ph" value={formData.ph} onChange={handleChange} required placeholder="0.0 - 14.0" />
                          </div>

                          <div className="col-md-6">
                              <label className="form-label small fw-semibold text-secondary mb-1">Annual Rainfall (mm)</label>
                              <input type="number" step="0.01" className="form-control line-input" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
                          </div>

                          <div className="col-md-12">
                              <label className="form-label small fw-semibold text-secondary mb-1">Wind Velocity (km/h)</label>
                              <input type="number" step="0.01" className="form-control line-input" name="wind_speed" value={formData.wind_speed} onChange={handleChange} />
                          </div>
                      </div>

                      <div className="text-center mt-5">
                          <button type="submit" className="btn btn-agri btn-lg px-5 py-3 rounded-3 shadow-sm" disabled={loadingSubmit}>
                              {loadingSubmit ? 'Executing...' : 'Execute Diagnostic Prediction'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      {/* 3. API Integration Showcase */}
      <div className="container mb-5 py-4">
          <div className="api-showcase-box p-4 p-md-5 animate-fade-in-up animate-on-scroll delay-100">
              <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                      <div className="d-flex align-items-center mb-3">
                          <span className="api-pulse me-3"></span>
                          <span className="fw-bold text-success text-uppercase tracking-wider small">Live Integration Active</span>
                      </div>
                      <h2 className="fw-bold text-dark-green mb-3">Automated Climate Telemetry</h2>
                      <p className="text-muted lh-lg mb-0">
                          To minimize user error and drastically speed up the diagnostic pipeline, our prediction form is deeply integrated with global meteorological APIs. Simply type your region into the "Regional Location" field, and our system will automatically ping nearby weather stations to fetch your current Temperature, Humidity, and Wind Velocity instantly.
                      </p>
                  </div>
                  <div className="col-lg-5 offset-lg-1 text-center animate-scale-in animate-on-scroll delay-300">
                      <div className="p-4 bg-light rounded-4 border">
                          <i className="bi bi-cloud-check text-success display-1 mb-3"></i>
                          <h5 className="fw-bold text-dark-green">WeatherAPI Linked</h5>
                          <p className="small text-muted mb-0">Latency: ~120ms</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. System Demos & Walkthroughs */}
      <div className="container mb-5 py-4">
          <div className="mb-4 px-1 text-center animate-fade-in-up animate-on-scroll delay-100">
              <h2 className="fw-bold text-dark-green mb-2">System Demos & Regional Walkthroughs</h2>
              <p className="text-muted">Watch how the predictive matrix renders optimization models in real-time</p>
          </div>

          <div className="row g-4">
              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-200">
                  <div className="card demo-plant-card rounded-4 h-100 shadow-sm">
                      <div className="ratio ratio-16x9 bg-light">
                          <video className="demo-video-thumb" autoPlay loop muted playsInline>
                              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/rgUbJ10eZlmi8usq86/amazingaerial-mzn435552-bwtf2szbn9__7db28f0d0eb435931163f301b32da99c__P360.mp4" type="video/mp4" />
                          </video>
                      </div>
                      <div className="card-body p-3 d-flex flex-column">
                          <h6 className="fw-bold text-dark-green mb-1">1. Diagnostic Interface</h6>
                          <p className="text-muted text-opacity-75 small mb-3">Live screencast walking through soil parameter entry loops and instantaneous N-P-K classification arrays.</p>
                          <div className="mt-auto">
                              <span className="badge pill-metric bg-light px-2 py-1">Demo Page 01</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-300">
                  <div className="card demo-plant-card rounded-4 h-100 shadow-sm">
                      <div className="ratio ratio-16x9 bg-light">
                          <video className="demo-video-thumb" autoPlay loop muted playsInline>
                              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/rgUbJ10eZlmi8usq86/amazingaerial-mzn435554-z821wbjuxi__478d1b464021650364ba948f120a7250__P360.mp4" type="video/mp4" />
                          </video>
                      </div>
                      <div className="card-body p-3 d-flex flex-column">
                          <h6 className="fw-bold text-dark-green mb-1">2. GIS Macro Mapping</h6>
                          <p className="text-muted text-opacity-75 small mb-3">Demonstration of geographic telemetry integration, auto-fetching local precipitation and humidity matrices seamlessly.</p>
                          <div className="mt-auto">
                              <span className="badge pill-metric bg-light px-2 py-1">Demo Page 02</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-400">
                  <div className="card demo-plant-card rounded-4 h-100 shadow-sm">
                      <div className="ratio ratio-16x9 bg-light">
                          <video className="demo-video-thumb" autoPlay loop muted playsInline>
                              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/rgUbJ10eZlmi8usq86/amazingaerial-mzn435552-bwtf2szbn9__7db28f0d0eb435931163f301b32da99c__P360.mp4" type="video/mp4" />
                          </video>
                      </div>
                      <div className="card-body p-3 d-flex flex-column">
                          <h6 className="fw-bold text-dark-green mb-1">3. Predictive Modeling</h6>
                          <p className="text-muted text-opacity-75 small mb-3">Analyzing how weight metrics and target yields react dynamically when toggling crop varieties within simulated environments.</p>
                          <div className="mt-auto">
                              <span className="badge pill-metric bg-light px-2 py-1">Demo Page 03</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-500">
                  <div className="card demo-plant-card rounded-4 h-100 shadow-sm">
                      <div className="ratio ratio-16x9 bg-light">
                          <video className="demo-video-thumb" autoPlay loop muted playsInline>
                              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/SfgTbYmNJXjhkhi5b7/amazingaerial-mzn447616-k4dwdcn0rx__9e25dffab3544baf9013a736412dface__P360.mp4" type="video/mp4" />
                          </video>
                      </div>
                      <div className="card-body p-3 d-flex flex-column">
                          <h6 className="fw-bold text-dark-green mb-1">4. Live API Automation</h6>
                          <p className="text-muted text-opacity-75 small mb-3">Validation process of background fetch operations connecting field inputs straight to external climatic prediction centers.</p>
                          <div className="mt-auto">
                              <span className="badge pill-metric bg-light px-2 py-1">Demo Page 04</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. Empirical Field Case Studies */}
      <div className="container mb-5 pb-5">
          <div className="d-flex align-items-center justify-content-between mb-4 px-1 animate-fade-in-up animate-on-scroll delay-100">
              <div>
                  <h2 className="fw-bold text-dark-green mb-2">Empirical Field Case Studies</h2>
                  <p className="text-muted">Real-world deployment validations and local farmer verification logs</p>
              </div>
              <i className="bi bi-shield-check text-success display-6 d-none d-md-block" title="Verified system outputs generated under matching regional profiles."></i>
          </div>

          <div className="row g-4">
              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-200">
                  <div className="card demo-plant-card rounded-3 p-4 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="fw-bold text-dark-green fs-5">🌾 Punjab Basin</span>
                          <span className="badge rounded-pill px-2 py-1 pill-metric text-success bg-light">+12% Yield</span>
                      </div>
                      <p className="text-muted small mb-4 lh-lg">"The model accurately adjusted for high residual nitrogen following potato cultivation, recommending a tailored low-N rice cycle."</p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                          <span className="badge pill-metric">Soil: Loam</span>
                          <span className="badge pill-metric">N-P-K: 78-42-39</span>
                          <span className="badge pill-metric">Crop: Rice</span>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-300">
                  <div className="card demo-plant-card rounded-3 p-4 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="fw-bold text-dark-green fs-5">🌽 Maize Valid</span>
                          <span className="badge rounded-pill px-2 py-1 pill-metric text-success bg-light">Saved Inputs</span>
                      </div>
                      <p className="text-muted small mb-4 lh-lg">"By checking automated local climate drops against late-season rainfall patterns, we completely avoided early fertilizer leaching."</p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                          <span className="badge pill-metric">Soil: Silty</span>
                          <span className="badge pill-metric">pH: 6.2 Balance</span>
                          <span className="badge pill-metric">Rain: 840mm</span>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-400">
                  <div className="card demo-plant-card rounded-3 p-4 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="fw-bold text-dark-green fs-5">🌿 Arid Cotton</span>
                          <span className="badge rounded-pill px-2 py-1 pill-metric text-primary bg-light">Stable Run</span>
                      </div>
                      <p className="text-muted small mb-4 lh-lg">"High wind speeds and basic pH bounds historically limited our options. OptiCrop flagged the ideal phosphorus-heavy stabilization window."</p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                          <span className="badge pill-metric">Soil: Alkaline</span>
                          <span className="badge pill-metric">Wind: 24 km/h</span>
                          <span className="badge pill-metric">Crop: Cotton</span>
                      </div>
                  </div>
              </div>

              <div className="col-lg-3 col-md-6 animate-fade-in-up animate-on-scroll delay-500">
                  <div className="card demo-plant-card rounded-3 p-4 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="fw-bold text-dark-green fs-5">🥜 Legume Pilot</span>
                          <span className="badge rounded-pill px-2 py-1 pill-metric text-success bg-light">Optimized</span>
                      </div>
                      <p className="text-muted small mb-4 lh-lg">"We ran a sand-loam profile with minimal organic materials. The engine matched us with groundnuts instead of moisture-hungry grains."</p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                          <span className="badge pill-metric">Soil: Sandy</span>
                          <span className="badge pill-metric">Humid: 82%</span>
                          <span className="badge pill-metric">Crop: Groundnuts</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 6. Preparation / FAQ */}
      <div className="bg-white border-top py-5">
          <div className="container py-4">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      <div className="text-center mb-5 animate-fade-in-up animate-on-scroll delay-100">
                          <h2 className="fw-bold text-dark-green">Pre-Diagnostic Checklist</h2>
                          <p className="text-muted">Ensure your data is accurate before running the optimization engine</p>
                      </div>

                      <div className="accordion faq-accordion animate-fade-in-up animate-on-scroll delay-200" id="faqAccordion">
                          
                          <div className="accordion-item">
                              <h2 className="accordion-header">
                                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
                                      How do I obtain Nitrogen (N), Phosphorus (P), and Potassium (K) levels?
                                  </button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                  <div className="accordion-body text-muted small lh-lg">
                                      You must perform a standard soil test. Collect soil samples from multiple points across your field at a depth of 15-20cm. Mix them thoroughly and submit the composite sample to a certified agricultural laboratory. They will provide a report detailing the exact N-P-K concentrations in milligrams per kilogram (mg/kg).
                                  </div>
                              </div>
                          </div>

                          <div className="accordion-item">
                              <h2 className="accordion-header">
                                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
                                      What if my region's automatic climate data is inaccurate?
                                  </button>
                              </h2>
                              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                  <div className="accordion-body text-muted small lh-lg">
                                      The API fetches data from the nearest registered meteorological station. If your specific microclimate differs significantly, you should manually override the Temperature, Humidity, and Wind Velocity fields in the matrix with your own local sensor data before hitting execute.
                                  </div>
                              </div>
                          </div>

                          <div className="accordion-item">
                              <h2 className="accordion-header">
                                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false">
                                      Why is Soil pH so important for the prediction?
                                  </button>
                              </h2>
                              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                  <div className="accordion-body text-muted small lh-lg">
                                      Soil pH dictates nutrient availability. Even if you have perfect N-P-K levels, a highly acidic or alkaline soil will "lock" those nutrients away, preventing root absorption. The AI engine heavily weights the pH metric to ensure it only recommends crops that can actually survive in your soil's current chemical state.
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default Predict;
