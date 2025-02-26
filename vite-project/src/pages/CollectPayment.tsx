// File: src/pages/CollectPayment.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

const CollectPayment: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { planId, storeSlug } = state || {};

  const plans = {
    2: { name: 'Monthly', price: 19.99 },
    3: { name: 'Yearly', price: 119.99 },
  };

  const [formData, setFormData] = useState({
    contact: { emailOrPhone: '', newsOffers: false },
    payment: {
      method: 'creditCard',
      cardNumber: '',
      expiry: '',
      securityCode: '',
      nameOnCard: '',
      useBilling: true,
      remember: false,
      saveInfo: true,
    },
  });

  const handleChange = (section: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value },
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      payment: { ...prev.payment, method },
    }));
  };

  const handleSubmit = () => {
    // Mock subscription update
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + (planId === 2 ? 30 : 365)); // 30 days for Monthly, 365 for Yearly
    localStorage.setItem('subscription_ends_at', endsAt.toISOString());
    localStorage.setItem('planId', planId.toString());
    localStorage.setItem('planName', plans[planId].name);

    // Redirect to dashboard
    navigate(`/dashboard/${storeSlug}`, { replace: true, state: null });
  };

  if (!planId || !plans[planId]) {
    return <Navigate to="/plan-selection" replace />;
  }

  const { name, price } = plans[planId];

  return (
    <Layout title="Collect Payment">
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-100 to-pink-200 p-6">
        <div className="flex-1 max-w-full mx-auto px-4 py-6 bg-white rounded-lg shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Collect Payment for {name}</h1>
          <p className="text-center text-gray-600 mb-4 flex items-center justify-center">🔒 All transactions are secure and encrypted</p>

          {/* Express Checkout */}
          <div className="text-center mb-6">
            <h3 className="text-lg text-gray-500">Express checkout</h3>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => handlePaymentMethodChange('shopPay')}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Shop Pay
              </button>
              <button
                onClick={() => handlePaymentMethodChange('payPal')}
                className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500"
              >
                PayPal
              </button>
              <button
                onClick={() => handlePaymentMethodChange('googlePay')}
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
              >
                Google Pay
              </button>
            </div>
            <p className="text-gray-500 mt-2">OR</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact</h2>
            <input
              type="text"
              placeholder="Email or mobile phone number"
              value={formData.contact.emailOrPhone}
              onChange={(e) => handleChange('contact', 'emailOrPhone', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.contact.newsOffers}
                onChange={(e) => handleChange('contact', 'newsOffers', e.target.checked)}
                className="mr-2 accent-purple-600"
              />
              <span className="text-gray-700">Email me with news and offers</span>
            </label>
          </div>

          {/* Payment */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment</h2>
            <p className="text-gray-600 mb-4">All transactions are secure and encrypted. 🔒</p>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.payment.method === 'creditCard'}
                  onChange={() => handlePaymentMethodChange('creditCard')}
                  className="mr-2 accent-purple-600"
                />
                <span className="text-gray-700">Credit card</span>
                <div className="ml-2 flex space-x-2">
                  <span className="text-gray-600">Visa</span>
                  <span className="text-gray-600">Mastercard</span>
                  <span className="text-gray-600">Amex</span>
                  <span className="text-gray-600">Discover</span>
                  <span className="text-gray-600">+3</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="Card number"
                value={formData.payment.cardNumber}
                onChange={(e) => handleChange('payment', 'cardNumber', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Expiration date (MM/YY)"
                  value={formData.payment.expiry}
                  onChange={(e) => handleChange('payment', 'expiry', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Security code"
                  value={formData.payment.securityCode}
                  onChange={(e) => handleChange('payment', 'securityCode', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md flex items-center"
                />
              </div>
              <input
                type="text"
                placeholder="Name on card"
                value={formData.payment.nameOnCard}
                onChange={(e) => handleChange('payment', 'nameOnCard', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.payment.useBilling}
                  onChange={(e) => handleChange('payment', 'useBilling', e.target.checked)}
                  className="mr-2 accent-purple-600"
                />
                <span className="text-gray-700">Use shipping address as billing address</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payPal"
                  checked={formData.payment.method === 'payPal'}
                  onChange={() => handlePaymentMethodChange('payPal')}
                  className="mr-2 accent-purple-600"
                />
                <span className="text-gray-700">PayPal</span>
              </label>
              <p className="text-blue-600">Remember me</p>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.payment.saveInfo}
                  onChange={(e) => handleChange('payment', 'saveInfo', e.target.checked)}
                  className="mr-2 accent-purple-600"
                />
                <span className="text-gray-700">Save my information for a faster checkout with a Shop account</span>
              </label>
              <p className="text-purple-600 text-sm">
                Your info will be saved to a Shop account. By continuing, you agree to Shop’s Terms of Service and acknowledge the Privacy Policy.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700">1 x {name} Subscription</p>
              <p className="text-gray-700">${price.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                placeholder="Discount code"
                className="w-3/4 p-2 border border-gray-300 rounded-md"
              />
              <button className="w-1/4 py-2 px-4 bg-pink-200 text-gray-700 rounded-md hover:bg-pink-300">
                Apply
              </button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">${price.toFixed(2)}</p>
            </div>
            <p className="text-gray-500 mb-2">Enter your shipping address to view available shipping methods.</p>
            <div className="flex justify-between items-center">
              <p className="text-gray-800 font-semibold">Total</p>
              <p className="text-gray-800 font-semibold">CAD ${price.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            Pay Now (Mock)
          </button>
          <p className="text-center text-gray-600 mt-4 flex items-center justify-center">✅ Secure and encrypted</p>
          <p className="text-center text-gray-500 mt-2">All rights reserved retailpoz</p>
        </div>
      </div>
    </Layout>
  );
};

export default CollectPayment;