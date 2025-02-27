import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { BuildingStorefrontIcon, ArrowRightIcon } from '@heroicons/react/24/solid'; // Solid icons
import { ArrowLeftOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'; // Removed UserIcon, kept relevant icons
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

interface Subscription {
  planName: string;
  price: number;
  interval: string;
  startsAt: string;
  endsAt: string;
  isAutoRenew: boolean;
}

interface Status {
  userName: string;
  registration: boolean;
  emailVerified: boolean;
  storeSetup: boolean;
  planSelected: boolean;
  dashboardCreated: boolean;
  subscription: Subscription | null;
  planId?: number;
  trial_ends_at?: string;
  subscription_ends_at?: string;
  storeName?: string;
}

const Dashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);
  const [storedSlug, setStoredSlug] = useState<string | null>(localStorage.getItem('storeSlug'));
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!isMounted.current) {
        isMounted.current = true;
        navigate('/login');
      }
      return;
    }

    try {
      const response = await axios.get<{ status: Status }>('http://localhost:5000/api/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Dashboard fetch response:', response.data);
      setUserData(response.data.status);

      if (!response.data.status.dashboardCreated && slug === storedSlug && !isMounted.current) {
        isMounted.current = true;
        await axios.post('http://localhost:5000/api/update-dashboard-created', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshedResponse = await axios.get<{ status: Status }>('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(refreshedResponse.data.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate, slug, storedSlug]);

  useEffect(() => {
    isMounted.current = true;
    fetchUserData();
    setStoredSlug(localStorage.getItem('storeSlug'));
  }, [slug, fetchUserData]);

  useEffect(() => {
    if (slug !== storedSlug && isMounted.current) {
      navigate(`/dashboard/${storedSlug || 'default'}`);
    }
  }, [slug, navigate, storedSlug]);

  useEffect(() => {
    const handleFocus = () => fetchUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storeSlug');
    navigate('/login');
  };

  const handleProfileSettings = () => {
    console.log('Navigate to Profile Settings');
    // navigate('/profile-settings'); // Uncomment and define route when ready
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) return <Layout title="Dashboard"><div className="text-center mt-8 text-gray-600">Loading...</div></Layout>;

  const displaySlug = slug || storedSlug || userData?.storeName || 'Unnamed Store';
  const themeClass = isDarkMode ? 'dark' : 'light';
  const initial = userData?.userName ? userData.userName.charAt(0).toUpperCase() : 'U';

  return (
    <Layout title={`${displaySlug} Dashboard`}>
      <div className={`flex flex-col h-screen ${themeClass === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        {/* Top Menubar */}
        <div className={`flex items-center justify-between p-4 ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">POS SaaS</span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-300" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={handleProfileSettings}
                className={`w-10 h-10 rounded-full ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center text-lg font-medium`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {initial}
              </motion.button>
              <motion.div
                className={`absolute right-0 mt-2 w-48 ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md shadow-lg py-1 hidden group-hover:block`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  onClick={handleProfileSettings}
                  className={`w-full text-left px-4 py-2 text-sm ${themeClass === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} rounded-t-md`}
                  whileHover={{ backgroundColor: themeClass === 'dark' ? '#4B5563' : '#F3F4F6' }}
                >
                  Profile Settings
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 text-sm ${themeClass === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} rounded-b-md`}
                  whileHover={{ backgroundColor: themeClass === 'dark' ? '#4B5563' : '#F3F4F6' }}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 inline" /> Sign Out
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Pane for Store Settings and Navigation */}
          <aside className={`w-72 ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-gray-800'} text-white p-8 flex flex-col space-y-8 border-t-0`}>
            <h3 className={`text-2xl font-semibold ${themeClass === 'dark' ? 'border-gray-700' : 'border-gray-600'} pb-4 border-b`}>Store Menu</h3>
            <nav className="space-y-4">
              <motion.button
                onClick={() => navigate(`/dashboard/${displaySlug}`)}
                className={`w-full text-left py-3 px-6 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-lg transition-all duration-300 flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BuildingStorefrontIcon className="h-6 w-6 mr-3" />
                <span className="text-lg">Store Overview</span>
              </motion.button>
              <motion.button
                onClick={() => navigate(`/pos/${displaySlug}`)}
                className={`w-full text-left py-3 px-6 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-lg transition-all duration-300 flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRightIcon className="h-6 w-6 mr-3" />
                <span className="text-lg">Launch POS</span>
              </motion.button>
              <motion.button
                onClick={() => console.log('Plan Status clicked')} // Placeholder
                className={`w-full text-left py-3 px-6 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-lg transition-all duration-300 flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">Plan Status</span>
              </motion.button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className={`flex-1 p-8 ${themeClass === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <h2 className={`text-3xl font-semibold ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'} mb-6`}>Dashboard Content</h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`bg-white ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <h3 className={`text-xl font-medium ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Store Info</h3>
                <p>Name: {displaySlug}</p>
                <p>Status: {userData?.storeSetup ? 'Active' : 'Pending'}</p>
              </div>
              <div className={`bg-white ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <h3 className={`text-xl font-medium ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Upcoming Features</h3>
                <p>Analytics, Inventory, Reports - Coming Soon!</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;