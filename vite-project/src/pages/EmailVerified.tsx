import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const EmailVerified: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    const token = queryParams.get('token');
    console.log('Verification token:', token); // Debug token
    if (emailFromQuery && token) {
      setEmail(emailFromQuery);
      setMessage('Verifying your email...');
      const verifyEmail = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
          console.log('Verification response:', response.data); // Debug response
          setName(response.data.user?.name || emailFromQuery.split('@')[0]);
          setMessage('');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setMessage(error.response?.data?.message || 'Verification failed.');
            console.error('Verification error:', error.response?.data);
          } else {
            setMessage('An unexpected error occurred.');
            console.error('Unexpected error:', error);
          }
        }
      };
      verifyEmail();
    } else {
      setMessage('Invalid verification link.');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug response
      const { token, redirectTo = '/statusdashboard' } = response.data; // Default to statusdashboard for users
      localStorage.setItem('token', token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectTo), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        console.error('Login error:', error.response?.data);
      } else {
        setMessage('An unexpected error occurred.');
        console.error('Unexpected error:', error);
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
    <Layout title="Email Verified">
      <motion.div
        className="max-w-md mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 text-center">
          <p className="text-gray-600 mb-4">Welcome, {name || 'friend'},</p>
          <p className="text-gray-600 mb-6">Your email is verified! Log in below to start creating your store.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 px-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
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
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </motion.button>
          </form>
          {message && (
            <motion.div
              className={`p-4 rounded-md text-sm ${message.includes('failed') || message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
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

export default EmailVerified;