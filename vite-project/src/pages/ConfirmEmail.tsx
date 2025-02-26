// File: src/pages/ConfirmEmail.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpdateInput, setShowUpdateInput] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const location = useLocation();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) setUserEmail(emailFromQuery);
  }, [location]);

  const handleResendEmail = async () => {
    const token = localStorage.getItem('verificationToken');
    if (!token) {
      setMessage('No verification token found. Please register again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification-email', { token });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error resending email. Please try again.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    const token = localStorage.getItem('verificationToken');
    if (!token) {
      setMessage('No verification token found. Please register again.');
      return;
    }

    if (!showUpdateInput) {
      setShowUpdateInput(true);
      return;
    }

    if (!newEmail) {
      setMessage('Please enter a new email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/update-email', { email: newEmail, token });
      setMessage(response.data.message);
      localStorage.setItem('verificationToken', response.data.token);
      setUserEmail(newEmail); // Update displayed email
      setShowUpdateInput(false);
      setNewEmail('');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error updating email. Please try again.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Confirm Your Email">
      <div className="max-w-md mx-auto px-4 py-6">
        <p className="text-center text-gray-600 mb-6">We’ve sent a verification email to: <strong>{userEmail || 'your email'}</strong>. Check your inbox (and spam folder).</p>
        <div className="space-y-6">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          {showUpdateInput && (
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={loading}
              />
            </div>
          )}
          <button
            onClick={handleUpdateEmail}
            disabled={loading}
            className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : showUpdateInput ? 'Submit New Email & Resend' : 'Update Email & Resend'}
          </button>
        </div>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </div>
    </Layout>
  );
};

export default ConfirmEmail;