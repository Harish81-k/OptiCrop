import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function History() {
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

  return (
    <>
      <style>{`
        .history-card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
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
            display: inline-block;
        }
      `}</style>
      <div className="container my-5 animate-fade-in-up">
          <div className="mb-5 animate-fade-in-up delay-100">
              <span className="text-uppercase tracking-wider small fw-bold text-muted px-3 py-1 rounded-pill bg-light border">
                  Archive Matrix
              </span>
              <h2 className="fw-bold text-dark-green mt-3 mb-1">Prediction History</h2>
              <p className="text-muted small">Comprehensive repository of analytical diagnostic profiles processed by the engine</p>
          </div>

          <div className="card history-card shadow-sm border-0 animate-fade-in-up delay-200">
              <div className="card-body p-4 p-md-5">
                  {loading ? <p className="text-muted text-center">Loading history...</p> : history.length > 0 ? (
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
                              {history.map((row) => (
                              <tr key={row._id}>
                                  <td className="text-muted font-monospace small">#{row._id.substring(row._id.length - 6)}</td>
                                  <td className="fw-semibold text-dark text-capitalize">{row.crop}</td>
                                  <td>
                                      <span className="badge-confidence">
                                          {row.confidence}%
                                      </span>
                                  </td>
                                  <td className="text-muted small">
                                      {new Date(row.createdAt).toLocaleString()}
                                  </td>
                              </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  ) : (
                  <div className="alert alert-light text-center border p-5 rounded-3 text-muted small mb-0">
                      No historical records are currently committed to this database archive.
                  </div>
                  )}
              </div>
          </div>
      </div>
    </>
  );
}

export default History;
