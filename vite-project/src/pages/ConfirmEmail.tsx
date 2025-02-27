import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // Track resend loading state
  const [updating, setUpdating] = useState(false);   // Track update loading state
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

    setResending(true); // Set resending state
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
      setResending(false); // Reset resending state
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

    setUpdating(true); // Set updating state
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/update-email', { email: newEmail, token });
      setMessage(response.data.message);
      localStorage.setItem('verificationToken', response.data.token);
      setUserEmail(newEmail);
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
      setUpdating(false); // Reset updating state
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout title="Confirm Your Email">
      <motion.div
        className="max-w-md mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          <p className="text-center text-gray-600 mb-6">
            We’ve sent a verification link to: <strong>{userEmail || 'your email'}</strong>. Please check your inbox (and spam folder) to verify your account.
          </p>
          <motion.button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {resending ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                <span>Resend Verification Email</span>
              </>
            )}
          </motion.button>
          {showUpdateInput && (
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">New Email Address</label>
              <div className="mt-1 relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter your new email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>
          )}
          <motion.button
            onClick={handleUpdateEmail}
            disabled={loading}
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {updating ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <>
                {showUpdateInput ? (
                  <>
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span>Submit New Email & Resend</span>
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span>Update Email & Resend</span>
                  </>
                )}
              </>
            )}
          </motion.button>
          {message && (
            <motion.div
              className={`p-4 rounded-md text-sm ${message.includes('Error') || message.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-center">{message}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ConfirmEmail;