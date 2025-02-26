// File: src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SuperadminDashboard from './pages/SuperadminDashboard';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import Login from './pages/Login'; // Assume this exists
import Register from './pages/Register'; // Assume this exists
import ConfirmEmail from './pages/ConfirmEmail'; // Assume this exists
import EmailVerified from './pages/EmailVerified'; // Assume this exists

const App: React.FC = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/superadmin-dashboard" element={<SuperadminDashboard />}>
            <Route path="tasks" element={<TasksPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="" element={<Navigate to="" replace />} /> {/* Default to root, not tasks */}
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Default redirect to login */}
          <Route path="/tasks" element={<Navigate to="/superadmin-dashboard/tasks" replace />} /> {/* Redirect /tasks to nested route */}
          <Route path="/users" element={<Navigate to="/superadmin-dashboard/users" replace />} /> {/* Redirect /users to nested route */}
        </Routes>
      </Router>
    
  );
};

export default App;