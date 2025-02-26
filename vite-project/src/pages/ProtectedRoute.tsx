// File: src/pages/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStoreSetup?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireStoreSetup = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStoreSetup, setIsStoreSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/status', { // Fixed endpoint
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('ProtectedRoute status:', response.data.status);
        setIsAuthenticated(true);
        setIsStoreSetup(!!response.data.status.storeSetup);
      } catch (error) {
        console.error('ProtectedRoute error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.log('Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (requireStoreSetup && !isStoreSetup) {
    console.log('Redirecting to /choose-store-type');
    return <Navigate to="/choose-store-type" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;