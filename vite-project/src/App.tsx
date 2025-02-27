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
import StatusDashboard from './pages/StatusDashboard'; // Assume this exists
import ChooseStoreType from './pages/ChooseStoreType'; // Import the updated file
import PlanSelection from './pages/PlanSelection'; // Import the updated file
import ProtectedRoute from './pages/ProtectedRoute'; // Import ProtectedRoute
import Dashboard from './pages/Dashboard';
// Define placeholder components locally to avoid import conflicts
//const ChooseStoreType: React.FC = () => <div>Choose Store Type Page</div>;
//const PlanSelection: React.FC = () => <div>Plan Selection Page</div>;
const Payment: React.FC = () => <div>Payment Page</div>;
//const Dashboard: React.FC = () => <div>Dashboard Page</div>;

const App: React.FC = () => {
  const token = localStorage.getItem('token'); // Check authentication status
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Public landing page */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/statusdashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/statusdashboard" replace />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} /> {/* No auth redirect for pre-login */}
        <Route path="/email-verified" element={<EmailVerified />} /> {/* No auth redirect for pre-login */}
        <Route
          path="/statusdashboard"
          element={<ProtectedRoute>{<StatusDashboard />}</ProtectedRoute>}
        />
        <Route
          path="/choose-store-type"
          element={<ProtectedRoute>{<ChooseStoreType />}</ProtectedRoute>}
        />
        <Route
          path="/plan-selection"
          element={<ProtectedRoute>{<PlanSelection />}</ProtectedRoute>}
        />
        <Route
          path="/payment"
          element={<ProtectedRoute requireStoreSetup>{<Payment />}</ProtectedRoute>}
        />
        <Route
          path="/dashboard/:storeSlug"
          element={<ProtectedRoute requireStoreSetup>{<Dashboard />}</ProtectedRoute>}
        />
        <Route
          path="/superadmin-dashboard"
          element={isAuthenticated ? <SuperadminDashboard /> : <Navigate to="/login" replace />}
        >
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="" element={<Navigate to="tasks" replace />} /> {/* Default to tasks */}
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/statusdashboard" : "/login"} replace />} /> {/* Catch-all */}
      </Routes>
    </Router>
  );
};

export default App;