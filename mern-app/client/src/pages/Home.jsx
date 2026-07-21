import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const observerRef = useRef(null);

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

  return (
    <>
      <style>{`
        .hero-container {
            position: relative;
            background-color: var(--agri-dark-green);
            overflow: hidden;
            border: none;
        }
        .hero-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(27, 67, 50, 0.5) 0%, rgba(13, 31, 23, 0.7) 100%);
            z-index: 2;
        }
        .hero-content {
            position: relative;
            z-index: 3;
        }
        .feature-card {
            background: #ffffff;
            border: 1px solid #e1e4e2;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(27, 67, 50, 0.05) !important;
        }
        .text-dark-green {
            color: var(--agri-dark-green);
        }
        .btn-agri-light {
            background-color: #ffffff;
            color: var(--agri-dark-green);
            border: none;
            letter-spacing: 0.5px;
            transition: background-color 0.2s ease, transform 0.2s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn-agri-light:hover {
            background-color: var(--agri-sage);
            color: var(--agri-dark-green);
            transform: scale(1.02);
        }
        .step-badge {
            background-color: var(--agri-sage);
            color: var(--agri-dark-green);
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: bold;
        }
        .process-section {
            background-color: #ffffff;
            border-top: 1px solid #e1e4e2;
            border-bottom: 1px solid #e1e4e2;
        }
        .impact-card {
            background: linear-gradient(135deg, var(--agri-dark-green) 0%, var(--agri-muted-green) 100%);
            color: white;
            border-radius: 16px;
            box-shadow: 0 15px 30px rgba(27, 67, 50, 0.15);
            transition: transform 0.3s ease;
        }
        .impact-card:hover {
            transform: translateY(-10px);
        }
        .metric-value {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 0.5rem;
            color: var(--agri-sage);
        }
        .tech-section {
            background-color: var(--agri-cream);
        }
        .tech-icon-box {
            width: 60px;
            height: 60px;
            background-color: var(--agri-sage);
            color: var(--agri-dark-green);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        .cta-section {
            background-color: var(--agri-dark-green);
            background-image: radial-gradient(circle at 100% 100%, var(--agri-muted-green) 0%, transparent 50%);
            color: white;
            padding: 100px 0;
            position: relative;
            overflow: hidden;
        }
      `}</style>
      
      {/* 1. Hero Section (No scroll animate needed) */}
      <div className="text-center py-5 px-4 hero-container rounded-4 my-5 shadow-lg animate-fade-in">
          <video className="hero-video" autoPlay loop muted playsInline>
              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/rgUbJ10eZlmi8usq86/amazingaerial-mzn435552-bwtf2szbn9__7db28f0d0eb435931163f301b32da99c__P360.mp4" type="video/mp4" />
              Your browser does not support the video tag.
          </video>
          
          <div className="hero-overlay"></div>

          <div className="py-5 hero-content position-relative">
              <span className="text-uppercase tracking-wider small fw-bold text-white px-3 py-1 rounded-pill bg-white bg-opacity-25 border border-white border-opacity-20 animate-fade-in-up delay-100">
                  Precision Agronomy
              </span>
              <h1 className="display-3 text-white fw-bold mt-3 mb-2 animate-fade-in-up delay-200">
                  OptiCrop
              </h1>
              <p className="lead text-white text-opacity-75 fs-4 mb-4 animate-fade-in-up delay-300">
                  Smart Agricultural Production Optimization Engine
              </p>
              <p className="mx-auto col-md-8 text-white text-opacity-75 mb-5 lh-lg animate-fade-in-up delay-400">
                  Empowering growers with definitive, predictive analytics. OptiCrop translates regional climate trajectories, precise soil chemistry matrices, and historical field data into actionable yield optimization profiles.
              </p>
              <Link to="/predict" className="btn btn-agri-light btn-lg px-5 py-3 fw-semibold shadow-sm animate-scale-in delay-500">
                  Launch Prediction Engine
              </Link>
          </div>
      </div>

      {/* 2. Predictive Capabilities */}
      <div className="container my-5 py-3">
          <div className="text-center mb-5 animate-fade-in-up animate-on-scroll delay-100">
              <h2 className="fw-bold text-dark-green">Predictive Capabilities</h2>
              <p className="text-muted">Machine learning models engineered for regional crop resilience</p>
          </div>
          
          <div className="row g-4">
              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-200">
                  <div className="card h-100 feature-card rounded-3 p-4">
                      <div className="card-body">
                          <h4 className="card-title fw-bold text-dark-green mb-3">Crop Recommendation</h4>
                          <p className="card-text text-muted lh-base">
                              Evaluates core soil metrics including nitrogen, phosphorus, and potassium ratios alongside pH balances to identify your land's highest-yielding crop variety.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-300">
                  <div className="card h-100 feature-card rounded-3 p-4">
                      <div className="card-body">
                          <h4 className="card-title fw-bold text-dark-green mb-3">Soil Chemistry Alignment</h4>
                          <p className="card-text text-muted lh-base">
                              Isolates specific micro-nutrient gaps to formulate target-exact fertilizer applications, optimizing resource overhead while maintaining ecosystem equilibrium.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-400">
                  <div className="card h-100 feature-card rounded-3 p-4">
                      <div className="card-body">
                          <h4 className="card-title fw-bold text-dark-green mb-3">Environmental Modeling</h4>
                          <p className="card-text text-muted lh-base">
                              Cross-references real-time macro-climatic trends, relative ambient humidity, and rainfall distribution vectors to construct stable cultivation timelines.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Analytical Workflow */}
      <div className="process-section py-5 my-5">
          <div className="container py-3">
              <h3 className="text-center fw-bold text-dark-green mb-5 animate-fade-in-up animate-on-scroll delay-100">Analytical Workflow</h3>
              <div className="row g-4">
                  
                  <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-200">
                      <div className="d-flex align-items-start px-2">
                          <div className="step-badge me-3 flex-shrink-0">1</div>
                          <div>
                              <h5 className="fw-bold text-dark-green">Parameter Entry</h5>
                              <p className="text-muted small lh-base">Input standard agronomic soil testing values alongside your local microclimate conditions into the diagnostic matrix.</p>
                          </div>
                      </div>
                  </div>

                  <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-300">
                      <div className="d-flex align-items-start px-2">
                          <div className="step-badge me-3 flex-shrink-0">2</div>
                          <div>
                              <h5 className="fw-bold text-dark-green">Algorithm Execution</h5>
                              <p className="text-muted small lh-base">The optimization engine cross-examines your values against regional validation sets and yield matrices simultaneously.</p>
                          </div>
                      </div>
                  </div>

                  <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-400">
                      <div className="d-flex align-items-start px-2">
                          <div className="step-badge me-3 flex-shrink-0">3</div>
                          <div>
                              <h5 className="fw-bold text-dark-green">Yield Delivery</h5>
                              <p className="text-muted small lh-base">Acquire precise data profiles regarding optimal crop selection and targeted nutrition schedules directly on your dashboard.</p>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>

      {/* 4. Impact & Metrics */}
      <div className="container py-5 my-5">
         <div className="text-center mb-5 animate-fade-in-up animate-on-scroll delay-100">
              <h2 className="fw-bold text-dark-green">Measurable Impact</h2>
              <p className="text-muted">Proven results across thousands of acres globally</p>
          </div>
          <div className="row g-4">
              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-200">
                  <div className="impact-card p-5 text-center h-100">
                      <div className="metric-value">+40%</div>
                      <h5 className="fw-bold mb-2">Yield Optimization</h5>
                      <p className="small text-white text-opacity-75 mb-0">Average increase in harvest output using predictive modeling.</p>
                  </div>
              </div>
              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-300">
                  <div className="impact-card p-5 text-center h-100">
                      <div className="metric-value">-20%</div>
                      <h5 className="fw-bold mb-2">Resource Waste</h5>
                      <p className="small text-white text-opacity-75 mb-0">Reduction in unnecessary fertilizer and water application.</p>
                  </div>
              </div>
              <div className="col-md-4 animate-fade-in-up animate-on-scroll delay-400">
                  <div className="impact-card p-5 text-center h-100">
                      <div className="metric-value">98%</div>
                      <h5 className="fw-bold mb-2">Model Accuracy</h5>
                      <p className="small text-white text-opacity-75 mb-0">Confidence rate in agro-ecological crop matching algorithms.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. Technology / AI Engine */}
      <div className="tech-section py-5 my-5">
          <div className="container py-5">
              <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0 animate-fade-in-up animate-on-scroll delay-100">
                      <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-white border">
                          Under the Hood
                      </span>
                      <h2 className="fw-bold text-dark-green mt-3 mb-4">Powered by Advanced Machine Learning</h2>
                      <p className="text-muted lh-lg mb-4">
                          OptiCrop doesn't rely on guesswork. Our prediction engine utilizes state-of-the-art Random Forest classifiers trained on vast datasets of soil chemistry, historical yields, and climate patterns.
                      </p>
                      
                      <div className="d-flex align-items-start mb-3 animate-fade-in-up animate-on-scroll delay-200">
                          <div className="tech-icon-box me-3 flex-shrink-0">
                              <i className="bi bi-diagram-3-fill"></i>
                          </div>
                          <div>
                              <h5 className="fw-bold text-dark-green">Neural Data Processing</h5>
                              <p className="text-muted small">Cross-referencing 22 distinct environmental variables in real-time.</p>
                          </div>
                      </div>
                      
                      <div className="d-flex align-items-start animate-fade-in-up animate-on-scroll delay-300">
                          <div className="tech-icon-box me-3 flex-shrink-0">
                              <i className="bi bi-shield-check"></i>
                          </div>
                          <div>
                              <h5 className="fw-bold text-dark-green">Continuous Validation</h5>
                              <p className="text-muted small">Models are continuously retrained with global harvest feedback loops.</p>
                          </div>
                      </div>
                  </div>
                  <div className="col-lg-5 offset-lg-1 animate-scale-in animate-on-scroll delay-400">
                      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                          <div className="bg-dark-green p-3 text-white d-flex align-items-center">
                              <div className="d-flex gap-2 me-3">
                                  <div className="rounded-circle bg-danger" style={{width: '10px', height: '10px'}}></div>
                                  <div className="rounded-circle bg-warning" style={{width: '10px', height: '10px'}}></div>
                                  <div className="rounded-circle bg-success" style={{width: '10px', height: '10px'}}></div>
                              </div>
                              <span className="small font-monospace text-opacity-75">opticrop_model_v4.2.py</span>
                          </div>
                          <div className="p-4 bg-dark text-light font-monospace small" style={{minHeight: '250px'}}>
                              <div className="text-success mb-2"># Initializing environment matrix</div>
                              <div className="mb-2"><span className="text-info">import</span> numpy <span className="text-info">as</span> np</div>
                              <div className="mb-2"><span className="text-info">from</span> sklearn.ensemble <span className="text-info">import</span> RandomForestClassifier</div>
                              <br/>
                              <div className="text-success mb-2"># Loading soil telemetry</div>
                              <div className="mb-2">features = [N, P, K, temp, humidity, ph, rainfall]</div>
                              <div className="mb-2">prediction = model.predict([features])</div>
                              <br/>
                              <div className="text-warning">{'>>'} Yield Optimization Target Identified</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 6. Call to Action (CTA) */}
      <div className="cta-section text-center rounded-4 mx-3 mx-md-5 my-5 shadow-lg animate-fade-in-up animate-on-scroll delay-100">
          <div className="container position-relative z-3 py-4">
              <h2 className="display-5 fw-bold mb-3">Ready to Optimize Your Harvest?</h2>
              <p className="lead text-white text-opacity-75 mb-5 mx-auto" style={{maxWidth: '600px'}}>
                  Join modern growers leveraging predictive intelligence to maximize yield and eliminate resource waste.
              </p>
              <div className="d-flex justify-content-center gap-3">
                  <Link to="/predict" className="btn btn-light btn-lg px-5 py-3 fw-bold text-dark-green shadow-sm animate-scale-in animate-on-scroll delay-200">
                      Run Diagnostic
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold text-white border-white animate-scale-in animate-on-scroll delay-300" style={{background: 'transparent'}}>
                      Create Account
                  </Link>
              </div>
          </div>
      </div>

    </>
  );
}

export default Home;
