import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BuildingStorefrontIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const ChooseStoreType: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState<'Retail' | 'Service' | 'Restaurant' | 'eCommerce' | 'Other'>('Retail');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeType) {
      setMessage('Please fill out all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a store. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/stores',
        { name: storeName, type: storeType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Store creation response:', response.data);

      if (response.status === 201) {
        localStorage.setItem('storeSlug', response.data.slug); // Keep this for dashboard
        setMessage('Store created successfully!');
        setTimeout(() => navigate('/status-dashboard'), 2000);
      } else {
        setMessage('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating store:', error.response?.data);
        setMessage(error.response?.data?.message || 'Error creating store. Please try again.');
        if (error.response?.status === 401) {
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
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

  return (
    <Layout title="Choose Store Type">
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform transition-all duration-300 hover:scale-105"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-6">
            <BuildingStorefrontIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Choose Your Store Type</h2>
            <p className="text-gray-600 mt-2">Select a store type and name to get started.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeType" className="block text-sm font-medium text-gray-700">Store Type</label>
              <select
                id="storeType"
                value={storeType}
                onChange={(e) => setStoreType(e.target.value as 'Retail' | 'Service' | 'Restaurant' | 'eCommerce' | 'Other')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="Retail">Retail</option>
                <option value="Service">Service</option>
                <option value="Restaurant">Restaurant</option>
                <option value="eCommerce">eCommerce</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                id="storeName"
                placeholder="Enter your store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <ArrowRightIcon className="h-5 w-5" />
                  <span>Create Store</span>
                </>
              )}
            </motion.button>
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
          </form>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ChooseStoreType;