import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SuperadminDashboard from './pages/SuperAdminDashboard';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ConfirmEmail from './pages/ConfirmEmail';
import EmailVerified from './pages/EmailVerified';
import Onboarding from './pages/Onboarding'; // Renamed from StatusDashboard
import ChooseStoreType from './pages/ChooseStoreType';
import PlanSelection from './pages/PlanSelection';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/onboarding" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/onboarding" replace />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/onboarding" element={<ProtectedRoute>{<Onboarding />}</ProtectedRoute>} /> {/* Updated route */}
        <Route path="/choose-store-type" element={<ProtectedRoute>{<ChooseStoreType />}</ProtectedRoute>} />
        <Route path="/planselection" element={<ProtectedRoute>{<PlanSelection />}</ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute requireStoreSetup>{<Payment />}</ProtectedRoute>} />
        <Route path="/dashboard/:storeSlug" element={<ProtectedRoute requireStoreSetup>{<Dashboard />}</ProtectedRoute>} />
        <Route path="/superadmin-dashboard" element={isAuthenticated ? <SuperadminDashboard /> : <Navigate to="/login" replace />}>
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="" element={<Navigate to="tasks" replace />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />} /> {/* Updated wildcard */}
      </Routes>
    </Router>
  );
};

export default App;