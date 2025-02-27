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
  const currentPath = window.location.pathname;

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking authentication with token:', token); // Debug token

      // Bypass authentication check for confirm-email and email-verified pages
      if (currentPath === '/confirm-email' || currentPath === '/email-verified') {
        if (isMounted) setIsLoading(false);
        return;
      }

      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('ProtectedRoute status response:', response.data); // Debug response
        if (isMounted && response.data?.status) {
          setIsAuthenticated(true);
          setIsStoreSetup(!!response.data.status.storeSetup);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ProtectedRoute error:', error.response?.data || error.message);
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkStatus();

    return () => { isMounted = false; };
  }, [currentPath]);

  if (isLoading) return <div className="text-center mt-8 text-gray-600">Loading...</div>;

  if (!isAuthenticated && !(currentPath === '/confirm-email' || currentPath === '/email-verified')) {
    console.log('Redirecting to /login due to unauthenticated');
    return <Navigate to="/login" replace />;
  }

  if (requireStoreSetup && !isStoreSetup && !(currentPath === '/statusdashboard')) {
    console.log('Redirecting to /choose-store-type due to missing store setup');
    return <Navigate to="/choose-store-type" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;