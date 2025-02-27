import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHeader from '../components/DasboardHeader';
import { BuildingStorefrontIcon, ArrowRightIcon, ShoppingCartIcon, TagIcon, TruckIcon, CreditCardIcon, ReceiptRefundIcon, DocumentTextIcon, UserGroupIcon, ChatBubbleLeftIcon, WrenchIcon, StarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';


interface Subscription {
  planName: string;
  price: number;
  interval: string;
  startsAt: string;
  endsAt: string | undefined;
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
  trial_ends_at?: string | undefined;
  subscription_ends_at?: string | undefined;
  storeName?: string;
  location?: string;
}

const Dashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);
  const [storedSlug, setStoredSlug] = useState<string | null>(localStorage.getItem('storeSlug'));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [displaySlug, setDisplaySlug] = useState<string>('Unnamed Store');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchTerm, setSearchTerm] = useState('');

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
    setDisplaySlug(slug || storedSlug || userData?.storeName || 'Unnamed Store');
  }, [slug, fetchUserData, storedSlug, userData?.storeName]);

  useEffect(() => {
    if (slug !== storedSlug && isMounted.current) {
      navigate(`/dashboard/${storedSlug || 'default'}`);
    }
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [slug, navigate, storedSlug, isDarkMode]);

  useEffect(() => {
    const handleFocus = () => fetchUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserData]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) return <DashboardLayout><div className="text-center mt-8 text-gray-600">Loading...</div></DashboardLayout>;

  const themeClass = isDarkMode ? 'dark' : 'light';
  const initial = userData?.userName ? userData.userName.charAt(0).toUpperCase() : 'U';
  const locationData = userData?.location || '123 Sherbrooke';
  const plan = userData?.subscription?.planName || '30 Days';
  const daysLeft = userData?.trial_ends_at || userData?.subscription_ends_at
    ? Math.max(0, Math.ceil((new Date(userData?.trial_ends_at || userData?.subscription_ends_at || '').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 16;
  const autoRenew = userData?.subscription?.isAutoRenew || 'ON';
  const totalSales = 635.23;
  const storeType = localStorage.getItem('storeType') || 'Not Selected';

  // Dummy data for Sales Graph and Cards
  const dummySalesData = [
    { date: 'Jan 28', value: 0 },
    { date: 'Feb 3', value: 100 },
    { date: 'Feb 9', value: 300 },
    { date: 'Feb 15', value: 200 },
    { date: 'Feb 21', value: 400 },
  ];

  const dummyOrders = [
    { id: '#3642', client: 'Joe', amount: 67.89 },
    { id: '#34652', client: 'GUEST', amount: 89.45 },
    { id: '#36652', client: 'Alice', amount: 120.30 },
    { id: '#4534', client: 'Bob', amount: 45.67 },
  ];

  // Determine content based on menu selection
  const getContent = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'store-overview':
        return (
          <div>
            <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Store Overview</h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p><strong>Location:</strong> {locationData}</p>
                <p><strong>Plan:</strong> {plan}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p><strong>Status:</strong> {`${daysLeft} days left, Auto-renew: ${autoRenew}`}</p>
                <p><strong>Store Type:</strong> {storeType}</p>
              </div>
            </div>
          </div>
        );
      case 'sales':
        return (
          <div>
            <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Sales</h3>
            {/* Sales Graph */}
            <div className={`bg-white ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-6`}>
              <svg className="w-full h-40" viewBox="0 0 500 100">
                <polyline
                  fill="none"
                  stroke={themeClass === 'dark' ? '#4A5568' : '#CBD5E0'}
                  strokeWidth="2"
                  points={dummySalesData.map((d, i) => `${i * 100}, ${100 - d.value}`).join(' ')}
                />
                <text x="10" y="10" className={themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'} fontSize="10">Jan 28 - Feb 21</text>
                {dummySalesData.map((d, i) => (
                  <text key={i} x={i * 100} y={105} className={themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'} fontSize="10">{d.date}</text>
                ))}
              </svg>
            </div>
            {/* Filters and Views */}
            <div className={`flex justify-between items-center mb-4 ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              <div>
                <h2 className="text-2xl font-semibold">Total Sales: ${totalSales.toFixed(2)}</h2>
                <p className="text-sm">Date: 27-02-2025 Time: 11:52am</p>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`p-2 rounded-md ${themeClass === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} border ${themeClass === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                />
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 rounded-md ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} text-white ${viewMode === 'card' ? 'bg-gray-600' : ''}`}
                >
                  Card View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} text-white ${viewMode === 'list' ? 'bg-gray-600' : ''}`}
                >
                  List View
                </button>
              </div>
            </div>
            {/* Sales Cards or List */}
            <div className={`bg-white ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
              {viewMode === 'card' ? (
                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {dummyOrders
                    .filter(order => order.client.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((order, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
                        <p className="text-sm font-medium">{order.id}</p>
                        <ShoppingCartIcon className="h-10 w-10 text-white mb-2" />
                        <p className="text-sm">Client: {order.client}</p>
                        <p className="text-sm font-bold">Amount: ${order.amount.toFixed(2)}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <ul className={`space-y-2 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {dummyOrders
                    .filter(order => order.client.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((order, index) => (
                      <li key={index} className="p-2 bg-gray-700 rounded-md flex justify-between">
                        <span>{order.id} - {order.client}</span>
                        <span>${order.amount.toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h3 className={`text-lg font-medium ${themeClass === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Store Overview</h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p><strong>Location:</strong> {locationData}</p>
                <p><strong>Plan:</strong> {plan}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p><strong>Status:</strong> {`${daysLeft} days left, Auto-renew: ${autoRenew}`}</p>
                <p><strong>Store Type:</strong> {storeType}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader initial={initial} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <nav className="space-y-3">
        <motion.button
          onClick={() => navigate(`/dashboard/${displaySlug}`)}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
          <span>Store Overview</span>
        </motion.button>
        <motion.button
          onClick={() => navigate(`/pos/${displaySlug}`)}
          className={`w-full text-left py-2 px-4 bg-[#76ABAE] hover:bg-teal-600 rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRightIcon className="h-5 w-5 mr-2" />
          <span>POS</span>
        </motion.button>
        <motion.button
          onClick={() => navigate('/sales')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          <span>Sales</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Products clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TagIcon className="h-5 w-5 mr-2" />
          <span>Products</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Services clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TruckIcon className="h-5 w-5 mr-2" />
          <span>Services</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Categories clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TagIcon className="h-5 w-5 mr-2" />
          <span>Categories</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Suppliers clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TruckIcon className="h-5 w-5 mr-2" />
          <span>Suppliers</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Purchases clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CreditCardIcon className="h-5 w-5 mr-2" />
          <span>Purchases</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Refunds clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ReceiptRefundIcon className="h-5 w-5 mr-2" />
          <span>Refunds</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Inventory clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TagIcon className="h-5 w-5 mr-2" />
          <span>Inventory</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Reports clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          <span>Reports</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('AI Insights clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
          <span>AI Insights</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Loyalty Programs clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <StarIcon className="h-5 w-5 mr-2" />
          <span>Loyalty Programs</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Custom Workflows clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WrenchIcon className="h-5 w-5 mr-2" />
          <span>Custom Workflows</span>
        </motion.button>
        <motion.button
          onClick={() => console.log('Multi-Location Sync clicked')}
          className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserGroupIcon className="h-5 w-5 mr-2" />
          <span>Multi-Location Sync</span>
        </motion.button>
      </nav>
      {getContent()}
    </DashboardLayout>
  );
};

export default Dashboard;