import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/style.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Guest Route wrapper
const GuestRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--agri-cream)' }}>
            <Navbar />
            
            <main style={{ flex: 1 }}>
              <div className="container py-2">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path="/predict" element={<ProtectedRoute><Predict /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
                  </Routes>
              </div>
            </main>

            <footer className="footer-agri text-center py-4 mt-5">
                <div className="container">
                    <div className="small fw-semibold text-dark mb-1">
                        OptiCrop Enterprise Intelligence Systems
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                        Automated Agro-Ecological Predictive Models &copy; 2026
                    </div>
                </div>
            </footer>
          </div>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
