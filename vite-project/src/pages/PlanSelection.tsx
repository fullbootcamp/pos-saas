// File: src/pages/PlanSelection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

const PlanSelection: React.FC = () => {
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const allPlans = [
    { id: 1, name: 'Free Demo', price: 0, displayPrice: '0', interval: '7 days', description: 'Explore our features and try out for 7 days' },
    { id: 2, name: 'Monthly', price: 19.99, displayPrice: '19.99', interval: '30 days', description: 'Full access, billed monthly', recommended: true, bestvalue: 'Recommended' },
    { id: 3, name: 'Yearly', price: 119.99, displayPrice: '9.99', interval: 'Month', billingNote: 'billed annually as $119.99', description: 'Regular Price: $239.88', discount: 'Save 50% Off' },
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
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const plans = loading
    ? []
    : currentPlanId === 3
    ? []
    : currentPlanId
    ? allPlans.filter(plan => plan.id !== 1 && plan.id !== currentPlanId)
    : allPlans;

  const handlePlanSelect = async (planId: number) => {
    const token = localStorage.getItem('token');
    const storeSlug = localStorage.getItem('storeSlug');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!storeSlug) {
      navigate('/choose-store-type');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/subscriptions',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        if (planId === 1) {
          setTimeout(() => navigate(`/dashboard/${storeSlug}`), 2000);
        } else {
          setTimeout(() => navigate('/collect-payment', { state: { planId, storeSlug } }), 2000);
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  if (loading) return <Layout title="Plan Selection"><div className="text-center text-white mt-8">Loading...</div></Layout>;

  return (
    <Layout title="Plan Selection">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
        <h1 className="text-4xl font-bold text-white mb-10">Choose Your Plan</h1>
        {currentPlanId === 3 ? (
          <p className="text-white text-lg">You’re on the Yearly plan—check back later for add-on modules!</p>
        ) : plans.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex-1 p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 ${plan.recommended ? 'border-4 border-purple-700' : ''}`}
              >
                {plan.discount && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-sm font-bold px-4 py-1 rounded-full">
                    {plan.discount}
                  </div>
                )}
                {plan.bestvalue && (
                  <div className="absolute top-0 right-0 bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {plan.bestvalue}
                  </div>
                )}
                <h2 className={`text-2xl font-semibold ${plan.recommended ? 'text-purple-700' : 'text-gray-800'}`}>
                  {plan.name}
                </h2>
                <p className={`text-3xl font-bold mt-4 ${plan.recommended ? 'text-purple-700' : 'text-gray-800'}`}>
                  ${plan.displayPrice} <span className="text-base text-gray-600">/{plan.interval}</span>
                </p>
                {plan.billingNote && <p className="text-sm text-gray-500 mt-1">{plan.billingNote}</p>}
                <p className="text-gray-600 mt-4">{plan.description}</p>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-6 w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${plan.recommended ? 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-600' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300`}
                >
                  Select {plan.name}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-lg">No plans available.</p>
        )}
      </div>
    </Layout>
  );
};

export default PlanSelection;