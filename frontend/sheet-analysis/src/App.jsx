import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ChartsPage from './pages/ChartsPage.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';

function App() {
  const user = useSelector((state) => state.auth.user);

  // Protected route component for admin access
  const AdminRoute = ({ children }) => {
    if (!user) {
      // Not logged in, redirect to login
      return <Navigate to="/login" replace />;
    }
    if (user.role !== 'admin') {
      // Logged in but not admin, redirect to dashboard instead of home
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/login" replace />} />
        <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" replace />} />
        <Route path="/chart" element={user ? <ChartsPage /> : <Navigate to="/login" replace />} />
        <Route path="/ai-insights" element={user ? <AIInsightsPage /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" replace />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
