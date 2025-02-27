import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid'; // Removed CheckCircleIcon
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const PlanSelection: React.FC = () => {
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const navigate = useNavigate();

  const allPlans = [
    { id: 1, name: 'Free Demo', price: 0, displayPrice: '$0', interval: '7 days', description: 'Explore our features with a 7-day trial', recommended: false },
    { id: 2, name: 'Monthly', price: 19.99, displayPrice: '$19.99', interval: '30 days', description: 'Full access, billed monthly', recommended: true, bestValue: 'Recommended' },
    { id: 3, name: 'Yearly', price: 119.99, displayPrice: '$9.99', interval: 'month', billingNote: 'Billed annually as $119.99', description: 'Regular Price: $239.88', discount: 'Save 50% Off', recommended: false },
  ];

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('PlanSelection response:', response.data);
        const status = response.data.status;
        setCurrentPlanId(status.planId || null);
      } catch (error) {
        console.error('Error fetching plan status:', error);
        setMessage('Failed to fetch current plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const plans = loading
    ? []
    : currentPlanId === 3
    ? [] // Hide all plans if on Yearly
    : currentPlanId === 1
    ? allPlans.filter(plan => plan.id === 2 || plan.id === 3) // Show Monthly and Yearly if on Free Demo
    : currentPlanId === 2
    ? allPlans.filter(plan => plan.id === 3) // Show Yearly if on Monthly
    : allPlans; // Show all plans if no current plan

  const handlePlanSelect = async (planId: number) => {
    setIsSelecting(true);
    setMessage('');
    const token = localStorage.getItem('token');
    const storeSlug = localStorage.getItem('storeSlug');

    if (!token) {
      setMessage('Authentication required. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      setIsSelecting(false);
      return;
    }

    if (!storeSlug) {
      setMessage('Store not set up. Redirecting to store selection...');
      setTimeout(() => navigate('/choose-store-type'), 2000);
      setIsSelecting(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/subscriptions',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setMessage('Plan selected successfully!');
        const plan = allPlans.find(p => p.id === planId);
        if (planId === 1) { // Free Demo
          setTimeout(() => navigate(`/dashboard/${storeSlug}`), 2000);
        } else { // Paid plans (Monthly or Yearly)
          setTimeout(() => navigate('/collect-payment', { state: { planId, storeSlug } }), 2000);
        }
      } else {
        setMessage('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      setMessage('Error selecting plan. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  if (loading) return <Layout title="Plan Selection"><div className="text-center mt-8 text-gray-600">Loading...</div></Layout>;

  return (
    <Layout title="Plan Selection">
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full transform transition-all duration-300 hover:scale-105"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <BuildingStorefrontIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">Choose Your Plan</h1>
            <p className="text-gray-600 mt-2">Select a plan to power your store’s success.</p>
          </div>
          {currentPlanId === 3 ? (
            <motion.div
              className="text-center p-6 bg-green-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-green-800">You’re on the Yearly plan! Explore modules, add-ons, or hardware upgrades.</p>
            </motion.div>
          ) : plans.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`relative p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl ${plan.recommended ? 'border-4 border-purple-600' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  {plan.discount && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                      {plan.discount}
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                      {plan.bestValue}
                    </div>
                  )}
                  <h2 className={`text-2xl font-semibold ${plan.recommended ? 'text-purple-600' : 'text-gray-800'}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-3xl font-bold mt-4 ${plan.recommended ? 'text-purple-600' : 'text-gray-800'}`}>
                    {plan.displayPrice} <span className="text-base text-gray-600">/{plan.interval}</span>
                  </p>
                  {plan.billingNote && <p className="text-sm text-gray-500 mt-1">{plan.billingNote}</p>}
                  <p className="text-gray-600 mt-4 line-clamp-2">{plan.description}</p>
                  <motion.button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`mt-6 w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${plan.recommended ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={isSelecting}
                  >
                    {isSelecting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Selecting...</span>
                      </>
                    ) : (
                      <span>Select {plan.name}</span>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center p-6 bg-red-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-red-800">No plans available or an error occurred.</p>
            </motion.div>
          )}
          {message && (
            <motion.div
              className={`p-4 rounded-md text-sm ${message.includes('error') || message.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-center">{message}</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default PlanSelection;