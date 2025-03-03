import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

interface Status {
  userName?: string;
  registration: boolean;
  emailVerified: boolean;
  storeSetup: boolean;
  planSelected: boolean;
  dashboardCreated: boolean;
  payment?: boolean;
  storeSlug?: string;
  planType?: string;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) throw new Error('No token found');

        const response = await axios.get('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (isMounted && response.data?.status) {
          setStatus(response.data.status);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => { isMounted = false; };
  }, [navigate]);

  const handleContinue = () => {
    if (!status) return;

    if (!status.storeSetup) {
      navigate('/choose-store-type');
    } else if (!status.planSelected) {
      navigate('/planselection');
    } else if (status.planSelected && status.planType === 'free') {
      const storeSlug = status.storeSlug || localStorage.getItem('storeSlug') || 'default';
      navigate(`/dashboard/${storeSlug}`);
    } else if (status.planSelected && status.planType !== 'free' && !status.payment) {
      navigate('/payment');
    } else if (status.dashboardCreated) {
      const storeSlug = status.storeSlug || localStorage.getItem('storeSlug') || 'default';
      navigate(`/dashboard/${storeSlug}`);
    }
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

  if (loading) return <Layout title="Onboarding"><div className="text-center mt-8 text-gray-600">Loading...</div></Layout>;
  if (error) return <Layout title="Onboarding"><div className="text-center mt-8 text-red-500">Error: {error}</div></Layout>;
  if (!status) return <Layout title="Onboarding"><div className="text-center mt-8 text-gray-600">No status data available.</div></Layout>;

  return (
    <Layout title="Welcome to your Onboarding progress! ">
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-50 to-purple-50"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
    >
     
  
      {/* Robot Icon and Welcome Message */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-block p-4 bg-white rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faRobot} className="h-16 w-16 text-purple-600" />
        </motion.div>
        <p className="text-lg text-gray-600 mt-2">Hi {status.userName || 'User'}, let’s check your progress!</p>
      </div>
  
      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="w-full h-3 bg-gray-200 rounded-full mb-8">
          <motion.div
            className="h-full bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress(status)}%` }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
  
        {/* Task Status */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className={`h-6 w-6 ${status.registration ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-lg text-gray-700">Registration: {status.registration ? '✅ Completed' : '❌ Pending'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className={`h-6 w-6 ${status.emailVerified ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-lg text-gray-700">Email Verified: {status.emailVerified ? '✅ Completed' : '❌ Pending'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className={`h-6 w-6 ${status.storeSetup ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-lg text-gray-700">Store Setup: {status.storeSetup ? '✅ Completed' : '❌ Pending'}</span>
          </div>
        </div>
  
        {/* Continue Button */}
        <motion.button
          className="w-full py-3 mt-8 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-all"
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  </Layout>
  );
};

export default Onboarding;