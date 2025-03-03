import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister} from '@fortawesome/free-solid-svg-icons';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      console.log('Token check:', { exp: new Date(exp), now: new Date(now), valid: now < exp });
      if (now >= exp) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        if (location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register') && !location.pathname.startsWith('/confirm-email') && !location.pathname.startsWith('/email-verified')) {
          navigate('/login');
        }
        return false;
      }
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      if (location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register') && !location.pathname.startsWith('/confirm-email') && !location.pathname.startsWith('/email-verified')) {
        navigate('/login');
      }
      return false;
    }
  }, [navigate, location]);

  useEffect(() => {
    checkTokenValidity();
    const handleStorageChange = () => checkTokenValidity();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkTokenValidity]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/confirm-email' || location.pathname === '/email-verified';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col w-screen overflow-x-hidden bg-gray-100">
      <style>{`
        header.sticky-blend {
          background: #F9FAFB; /* Matches bg-gray-50 */
        }
        @media (prefers-reduced-motion: no-preference) {
          header {
            transition: background 0.3s ease;
          }
          section {
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
        }
      `}</style>
      <header className="sticky top-0 z-10 w-full shadow-md transition-all duration-300 bg-white sticky-blend">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faCashRegister} className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-0">
              <span className="font-sans font-extrabold text-black">POS</span>
              <span className="font-sans font-extrabold text-teal-600">ly</span>
            </h1>
          </div>
          <nav className="flex space-x-6 items-center">
            {isLandingPage && (
              <>
                <a href="/#why-us" className="hover:underline text-lg text-teal-600">Why Us?</a>
                <a href="/#pricing" className="hover:underline text-lg text-teal-600">Pricing</a>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-all duration-300 font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <a href="/login" className="hover:underline text-lg text-teal-600">Login</a>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-rose-700 text-white py-2 px-4 rounded-md hover:bg-rose-800 transition-all duration-300 font-semibold"
                    >
                      Start FREE Trial
                    </button>
                  </>
                )}
              </>
            )}
            {!isLandingPage && !isAuthPage && isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-all duration-300 font-semibold"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        {!isLandingPage && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* ... */}
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;