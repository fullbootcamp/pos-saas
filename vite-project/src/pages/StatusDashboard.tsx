import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

interface Status {
  userName?: string;
  registration: boolean;
  emailVerified: boolean;
  storeSetup: boolean;
  planSelected: boolean;
  dashboardCreated: boolean;
  payment?: boolean; // Added to track payment status
  storeSlug?: string;
  planType?: string; // e.g., 'free', 'monthly', 'yearly'
}

const StatusDashboard: React.FC = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) throw new Error('No token found');

        console.log('Fetching status with token:', authToken);

        const response = await axios.get('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        console.log('Response from /api/status:', response.data);

        if (isMounted && response.data?.status) {
          const userStatus = response.data.status;
          console.log('Parsed status:', userStatus);
          setStatus(userStatus);
          // Redirect based on status
          if (userStatus.registration && userStatus.emailVerified && userStatus.storeSetup && userStatus.planSelected && userStatus.dashboardCreated) {
            const storeSlug = userStatus.storeSlug || localStorage.getItem('storeSlug') || 'default';
            navigate(`/dashboard/${storeSlug}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching status:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => { isMounted = false; };
  }, [navigate]);

  const handleContinue = () => {
    if (!status) return;

    console.log('Current status in handleContinue:', status);
    if (!status.storeSetup) {
      console.log('Redirecting to choose-store-type');
      navigate('/choose-store-type');
    } else if (!status.planSelected) {
      console.log('Redirecting to plan-selection');
      navigate('/plan-selection');
    } else if (status.planSelected && status.planType === 'free') {
      console.log('Redirecting to dashboard for free demo');
      const storeSlug = status.storeSlug || localStorage.getItem('storeSlug') || 'default';
      navigate(`/dashboard/${storeSlug}`);
    } else if (status.planSelected && status.planType !== 'free' && !status.payment) {
      console.log('Redirecting to payment page');
      navigate('/payment');
    } else if (status.dashboardCreated) {
      console.log('Redirecting to dashboard');
      const storeSlug = status.storeSlug || localStorage.getItem('storeSlug') || 'default';
      navigate(`/dashboard/${storeSlug}`);
    }
  };

  const getStatusStyle = (status: boolean | undefined | null) => {
    if (status === undefined || status === null) return 'text-gray-500';
    return status ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold';
  };

  const calculateProgress = (status: Status | null) => {
    if (!status) return 0;
    const totalSteps = 5;
    const completedSteps = [
      status.registration,
      status.emailVerified,
      status.storeSetup,
      status.planSelected,
      status.dashboardCreated,
    ].filter(Boolean).length;
    return (completedSteps / totalSteps) * 100;
  };

  if (loading) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-gray-600">Loading...</div></Layout>;
  if (error) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-red-500">Error: {error}</div></Layout>;
  if (!status) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-gray-600">No status data available.</div></Layout>;

  return (
    <Layout title="Status Dashboard">
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
      >
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform transition-all duration-300 hover:scale-105"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome, {status.userName || 'User'}!</h1>
          <div className="w-full h-2 bg-gray-300 rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress(status)}%` }}
            ></motion.div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="text-lg flex items-center space-x-2">
              <CheckCircleIcon className={`h-6 w-6 ${getStatusStyle(status.registration)}`} />
              <span>Registration: {status.registration ? '✅ Completed' : '⚠️ Not Started'}</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <CheckCircleIcon className={`h-6 w-6 ${getStatusStyle(status.emailVerified)}`} />
              <span>Email Verified: {status.emailVerified ? '✅ Completed' : '⚠️ Not Started'}</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <CheckCircleIcon className={`h-6 w-6 ${getStatusStyle(status.storeSetup)}`} />
              <span>Store Setup: {status.storeSetup ? '✅ Completed' : '⚠️ Not Started'}</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <CheckCircleIcon className={`h-6 w-6 ${getStatusStyle(status.planSelected)}`} />
              <span>Plan Selected: {status.planSelected ? '✅ Completed' : '⚠️ Not Started'}</span>
            </div>
            <div className="text-lg flex items-center space-x-2">
              <CheckCircleIcon className={`h-6 w-6 ${getStatusStyle(status.dashboardCreated)}`} />
              <span>Dashboard Created: {status.dashboardCreated ? '✅ Completed' : '⚠️ Not Started'}</span>
            </div>
          </div>
          <motion.button
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={handleContinue}
            disabled={loading || !status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRightIcon className="h-5 w-5" />
            <span>
              {!status.storeSetup ? 'Set Up Your Store' : !status.planSelected ? 'Select a Plan' : !status.dashboardCreated ? 'Create Dashboard' : 'Go to Dashboard'}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default StatusDashboard;