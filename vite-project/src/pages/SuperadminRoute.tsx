// File: src/pages/SuperadminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface SuperadminRouteProps {
  children: React.ReactNode;
}

const SuperadminRoute: React.FC<SuperadminRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role as string;
    if (!['superadmin', 'tech lead', 'dev', 'junior dev'].includes(role)) return <Navigate to="/" replace />;
    
    // Restrict based on role (mock for now, refine later)
    if (role === 'junior dev') {
      // Junior dev sees only tasks
      return role === 'junior dev' ? <>{children}</> : <Navigate to="/status-dashboard" replace />;
    } else if (role === 'dev') {
      // Dev sees tasks, logs
      return ['dev', 'tech lead', 'superadmin'].includes(role) ? <>{children}</> : <Navigate to="/status-dashboard" replace />;
    } else if (role === 'tech lead') {
      // Tech lead sees tasks, logs, complaints
      return ['tech lead', 'superadmin'].includes(role) ? <>{children}</> : <Navigate to="/status-dashboard" replace />;
    }
    return <>{children}</>; // Superadmin sees all
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default SuperadminRoute;