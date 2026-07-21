import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const total = history.length;
  const latest = history.slice(0, 5);
  
  const cropCounts = history.reduce((acc, row) => {
    acc[row.crop] = (acc[row.crop] || 0) + 1;
    return acc;
  }, {});
  
  const labels = Object.keys(cropCounts);
  const values = Object.values(cropCounts);
  
  let most_crop = 'N/A';
  let maxCount = 0;
  Object.entries(cropCounts).forEach(([crop, count]) => {
    if (count > maxCount) {
      maxCount = count;
      most_crop = crop;
    }
  });

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Crop Count',
      data: values,
      backgroundColor: [
        '#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc'
      ],
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  return (
    <>
      <style>{`
        .dash-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(27, 67, 50, 0.03) !important;
        }
        .stat-value {
            color: var(--agri-dark-green);
            font-weight: 700;
            letter-spacing: -1px;
        }
        .stat-label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: #6c757d;
        }
        .table-responsive {
            border-radius: 8px;
            overflow: hidden;
        }
        .table-agri {
            margin-bottom: 0;
        }
        .table-agri thead {
            background-color: #ffffff;
            border-bottom: 2px solid var(--border-color);
        }
        .table-agri th {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: var(--agri-charcoal);
            padding: 16px;
        }
        .table-agri td {
            padding: 16px;
            font-size: 0.95rem;
            color: var(--agri-charcoal);
            border-bottom: 1px solid var(--border-color);
        }
        .table-agri tbody tr:last-child td {
            border-bottom: none;
        }
        .table-agri tbody tr:hover {
            background-color: var(--agri-cream);
        }
        .badge-confidence {
            background-color: var(--agri-sage);
            color: var(--agri-dark-green);
            font-weight: 500;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
        }
      `}</style>

      <div className="container my-5">
          <div className="mb-5 d-flex justify-content-between align-items-start animate-fade-in-up">
              <div>
                  <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                      System Overview
                  </span>
                  <h2 className="fw-bold text-dark-green mt-3 mb-1">Analytical Dashboard</h2>
                  <p className="text-muted small">
                      Welcome back, <span className="fw-semibold text-dark">{user?.name || 'User'}</span>. Reviewing real-time agronomic models.
                  </p>
              </div>
              <div className="mt-2">
                  <Link to="/history" className="btn btn-outline-success rounded-pill px-4 shadow-sm">
                      View Full History ➔
                  </Link>
              </div>
          </div>

          <div className="row g-4 mb-5">
              <div className="col-lg-4 col-md-6 animate-fade-in-up delay-100">
                  <div className="card dash-card shadow-sm p-4 text-center h-100">
                      <div className="stat-label mb-2">Total Diagnostic Runs</div>
                      <h1 className="stat-value display-5 m-0">{total}</h1>
                  </div>
              </div>
              <div className="col-lg-4 col-md-6 animate-fade-in-up delay-200">
                  <div className="card dash-card shadow-sm p-4 text-center h-100">
                      <div className="stat-label mb-2">Primary Yield Profile</div>
                      <h2 className="stat-value text-truncate px-2 m-0 mt-1" style={{ fontSize: '2rem', textTransform: 'capitalize' }}>{most_crop}</h2>
                  </div>
              </div>
              <div className="col-lg-4 col-md-12 animate-fade-in-up delay-300">
                  <div className="card dash-card shadow-sm p-4 text-center h-100">
                      <div className="stat-label mb-2">Recent Batch Queries</div>
                      <h1 className="stat-value display-5 m-0">{latest.length}</h1>
                  </div>
              </div>
          </div>

          <div className="card dash-card shadow-sm border-0 mb-5 animate-fade-in-up delay-400">
              <div className="card-body p-4 p-md-5">
                  <div className="mb-4">
                      <h4 className="fw-bold text-dark-green mb-1">Recent Prediction History</h4>
                      <p className="text-muted small mb-0">Chronological list of execution matrices processed by the analytical engine</p>
                  </div>

                  {loading ? <p className="text-muted text-center">Loading data...</p> : latest.length > 0 ? (
                  <div className="table-responsive border">
                      <table className="table table-agri align-middle table-hover">
                          <thead>
                              <tr>
                                  <th>Matrix ID</th>
                                  <th>Target Crop</th>
                                  <th>Confidence Index</th>
                                  <th>Timestamp</th>
                              </tr>
                          </thead>
                          <tbody>
                              {latest.map((row) => (
                              <tr key={row._id}>
                                  <td className="text-muted font-monospace small">#{row._id.substring(row._id.length - 6)}</td>
                                  <td className="fw-semibold text-dark text-capitalize">{row.crop}</td>
                                  <td>
                                      <span className="badge-confidence">
                                          {row.confidence}%
                                      </span>
                                  </td>
                                  <td className="text-muted small">{new Date(row.createdAt).toLocaleString()}</td>
                              </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  ) : (
                  <div className="alert alert-light text-center border p-4 rounded-3 text-muted small">
                      No telemetry or prediction records are currently linked to this profile.
                  </div>
                  )}
              </div>
          </div>

          {labels.length > 0 && (
          <div className="row g-4">
              <div className="col-lg-6 animate-fade-in-up delay-500">
                  <div className="card dash-card shadow-sm p-4 h-100">
                      <div className="mb-4">
                          <h5 className="fw-bold text-dark-green mb-1">Crop Distribution</h5>
                          <p className="text-muted small mb-0">Proportional allocation of predicted profiles</p>
                      </div>
                      <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                          <Pie data={chartData} options={pieOptions} />
                      </div>
                  </div>
              </div>

              <div className="col-lg-6 animate-fade-in-up delay-600">
                  <div className="card dash-card shadow-sm p-4 h-100">
                      <div className="mb-4">
                          <h5 className="fw-bold text-dark-green mb-1">Prediction Count</h5>
                          <p className="text-muted small mb-0">Frequency metrics breakdown across target varieties</p>
                      </div>
                      <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                          <Bar data={chartData} options={barOptions} />
                      </div>
                  </div>
              </div>
          </div>
          )}

      </div>
    </>
  );
}

export default Dashboard;
