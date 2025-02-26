// File: src/pages/Payment.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Payment: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { planId, storeSlug } = state || {};

  const plans = {
    2: { name: 'Monthly', price: 19.99, durationDays: 30 },
    3: { name: 'Yearly', price: 119.99, durationDays: 365 },
  };

  const handlePayment = () => {
    setMessage('Processing payment...');
    setTimeout(() => {
      setMessage('Payment successful! Redirecting to dashboard...');
      // Clear state to prevent loop
      navigate(`/dashboard/${storeSlug}`, { replace: true, state: null });
    }, 2000); // Simulate payment processing
  };

  if (!planId || !plans[planId]) {
    return <Navigate to="/plan-selection" replace />;
  }

  return (
    <Layout title={`Payment for ${plans[planId].name}`}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Payment for {plans[planId].name}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Total: ${plans[planId].price.toFixed(2)}
          </p>
          <button
            onClick={handlePayment}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            Pay Now (Mock)
          </button>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payment;