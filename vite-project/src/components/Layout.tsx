// File: src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      console.log('Token check:', { exp: new Date(exp), now: new Date(now), valid: now < exp });
      if (now >= exp) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        return false;
      }
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    checkTokenValidity();
    // Re-check on location change (e.g., navigation)
    const handleStorageChange = () => checkTokenValidity();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Force UI update
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col w-screen overflow-x-hidden bg-gray-100">
      <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 sticky top-0 z-10 w-full shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="POS SaaS Logo" className="h-10" />
            <h1 className="text-2xl font-bold tracking-tight">POS SaaS</h1>
          </div>
          <nav className="flex space-x-6 items-center">
            {isLandingPage && (
              <>
                <a href="/#why-us" className="hover:underline text-lg text-white">Why Us?</a>
                <a href="/#pricing" className="hover:underline text-lg text-white">Pricing</a>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-vintage-rose-vibrant-pink text-white py-2 px-4 rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <a href="/login" className="hover:underline text-lg text-white">Login</a>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-vintage-rose-vibrant-pink text-white py-2 px-4 rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 font-semibold"
                    >
                      Start FREE Trial
                    </button>
                  </>
                )}
              </>
            )}
            {!isLandingPage && !isAuthPage && (
              <>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-vintage-rose-vibrant-pink text-white py-2 px-4 rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <a href="/login" className="hover:underline text-lg text-white">Login</a>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        {!isLandingPage && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;