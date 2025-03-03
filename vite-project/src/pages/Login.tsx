import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed

interface LoginResponse {
  token: string;
  role: 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user';
  user: {
    id: number;
    email: string;
    name: string;
  };
  redirectTo?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug response
      const { token, role, redirectTo } = response.data;
      localStorage.setItem('token', token);
      setMessage('Login successful! Redirecting...');
      const destination = role === 'superadmin' ? '/superadmin-dashboard' : redirectTo || '/onboarding';
      setTimeout(() => navigate(destination), 2000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage(axiosError.response?.data?.message ?? 'Login failed. Check email and password.');
      console.error('Login error:', axiosError.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage('Please enter your email.');
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await axios.post<{ message: string }>('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
      setMessage(response.data.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setMessage(null);
      }, 5000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage(axiosError.response?.data?.message ?? 'Error sending reset email.');
      console.error('Forgot password error:', axiosError.response?.data);
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
    <Layout title={showForgotPassword ? 'Reset Your Password' : 'Login to Your Account'}>
      <motion.div
        className="max-w-md mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
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
                  <span>Login</span>
                )}
              </motion.button>
              <p
                className="text-center text-sm text-purple-600 cursor-pointer hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="forgotEmail"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className="w-full py-3 px-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center"
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Email</span>
                )}
              </motion.button>
              <p
                className="text-center text-sm text-purple-600 cursor-pointer hover:underline"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </p>
            </form>
          )}
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

export default Login;