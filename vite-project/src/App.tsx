import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SuperadminDashboard from './pages/SuperAdminDashboard';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import Login from './pages/Login'; // Assume this exists
import Register from './pages/Register'; // Assume this exists
import ConfirmEmail from './pages/ConfirmEmail'; // Assume this exists
import EmailVerified from './pages/EmailVerified'; // Assume this exists

const App: React.FC = () => {
  const token = localStorage.getItem('token'); // Check authentication status
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Public landing page */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/superadmin-dashboard/tasks" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/superadmin-dashboard/tasks" replace />}
        />
        <Route
          path="/confirm-email"
          element={!isAuthenticated ? <ConfirmEmail /> : <Navigate to="/superadmin-dashboard/tasks" replace />}
        />
        <Route
          path="/email-verified"
          element={!isAuthenticated ? <EmailVerified /> : <Navigate to="/superadmin-dashboard/tasks" replace />}
        />
        <Route
          path="/superadmin-dashboard"
          element={isAuthenticated ? <SuperadminDashboard /> : <Navigate to="/login" replace />}
        >
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="" element={<Navigate to="tasks" replace />} /> {/* Default to tasks */}
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/superadmin-dashboard/tasks" : "/login"} replace />} /> {/* Catch-all */}
      </Routes>
    </Router>
  );
};

export default App;