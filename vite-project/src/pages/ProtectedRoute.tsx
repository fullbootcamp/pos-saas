import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking authentication with token:', token);

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

        if (isMounted && response.data?.status && typeof response.data.status === 'object') {
          console.log('ProtectedRoute status response:', response.data.status);
          setIsAuthenticated(true);
          setIsStoreSetup(!!response.data.status.storeSetup);
        } else {
          console.error('Invalid status response:', response.data);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ProtectedRoute error:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkStatus();

    return () => { isMounted = false; };
  }, [currentPath, navigate]);

  if (isLoading) return <div className="text-center mt-8 text-gray-600">Loading...</div>;

  if (!isAuthenticated && !(currentPath === '/confirm-email' || currentPath === '/email-verified')) {
    console.log('Redirecting to /login due to unauthenticated');
    return <Navigate to="/login" replace />;
  }

  if (requireStoreSetup && !isStoreSetup && currentPath !== '/onboarding') {
    console.log('Redirecting to /choose-store-type due to missing store setup');
    return <Navigate to="/choose-store-type" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;