import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate password and email
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pass: string, confirm: string) => {
    const isLongEnough = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isMatch = pass && confirm && pass === confirm; // Only true if both are non-empty and equal
    return { isLongEnough, hasUpperCase, hasNumber, isMatch };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isLongEnough, hasUpperCase, hasNumber, isMatch } = validatePassword(password, confirmPassword);
    if (!validateEmail(email)) return;
    if (!isMatch) return;
    if (!isLongEnough || !hasUpperCase || !hasNumber) return;
    setIsLoading(true);
    try {
      console.log('Sending POST request to /api/auth/register with:', { email, password, role: 'owner' });
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        role: 'owner',
      });
      console.log('Registration response received:', response); // Detailed debug log
      if (response.status === 201 && response.data.verificationToken) {
        navigate(`/confirm-email?email=${encodeURIComponent(email)}&token=${response.data.verificationToken}`);
      } else if (response.status === 204) {
        navigate(`/confirm-email?email=${encodeURIComponent(email)}`);
      } else if (response.status === 200 && response.data.verificationToken) {
        navigate(`/confirm-email?email=${encodeURIComponent(email)}&token=${response.data.verificationToken}`);
      } else {
        console.error('Unexpected status or missing token:', response.status, response.data);
      }
    } catch (error) {
      console.error('Registration error:', error.message, error.response ? error.response.data : 'No response data'); // Detailed error log
    } finally {
      setIsLoading(false);
    }
  };

  // Get validation status
  const isEmailValid = validateEmail(email);
  const { isLongEnough, hasUpperCase, hasNumber, isMatch } = validatePassword(password, confirmPassword);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <Layout title="Register">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-white p-8 rounded-xl shadow-lg">
          {/* Email Row */}
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
              />
            </div>
          </div>
          <div className="flex items-center">
            <p className={isEmailValid ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
              {isEmailValid ? '✓ Valid email' : '✗ Please enter a valid email address'}
            </p>
          </div>

          {/* Password Row */}
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
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className={isLongEnough ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>Password requires 8 characters {isLongEnough ? '✓' : '✗'}</p>
            <p className={hasUpperCase ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>Password requires 1 capital letter {hasUpperCase ? '✓' : '✗'}</p>
            <p className={hasNumber ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>Password requires 1 number {hasNumber ? '✓' : '✗'}</p>
            <p className={isMatch ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>Passwords match {isMatch ? '✓' : '✗'}</p>
          </div>

          {/* Confirm Password Row */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div></div> {/* Empty cell to maintain grid alignment */}

          <div className="col-span-2">
            <motion.button
              type="submit"
              className="w-full py-3 px-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
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
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </motion.button>
            <p className="text-center text-sm text-purple-600 mt-4">
              Already a member? <a href="/login" className="hover:underline font-medium">Login here</a>
            </p>
          </div>
        </form>
      </motion.div>
    </Layout>
  );
};

export default Register;