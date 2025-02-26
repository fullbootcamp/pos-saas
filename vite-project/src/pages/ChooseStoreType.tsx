import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChooseStoreType: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState<'Retail' | 'Service' | 'Restaurant' | 'eCommerce' | 'Other'>('Retail');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Choose Your Store Type
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Select a store type and name to get started.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="storeType" className="block text-sm font-medium text-gray-700">
              Store Type
            </label>
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
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
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

          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            Create Store
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChooseStoreType;