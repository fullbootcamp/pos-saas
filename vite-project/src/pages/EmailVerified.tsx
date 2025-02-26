// File: src/pages/EmailVerified.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const EmailVerified: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    const token = queryParams.get('token');
    if (emailFromQuery && token) {
      setEmail(emailFromQuery);
      setMessage('Verifying your email...');
      const verifyEmail = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
          setName(response.data.user?.name || emailFromQuery.split('@')[0]);
          setMessage(''); // Clear on success
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setMessage(error.response?.data?.message || 'Verification failed.');
          } else {
            setMessage('An unexpected error occurred.');
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
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, redirectTo } = loginResponse.data;
      localStorage.setItem('token', token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectTo), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <Layout title="Email Verified">
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <p className="text-gray-600 mb-4">Hi {name},</p>
        <p className="text-gray-600 mb-6">Thanks for verifying your email. Log in below to start rocking your POS!</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-vintage-rose-vibrant-pink text-white rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 font-semibold"
          >
            Log In
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </Layout>
  );
};

export default EmailVerified;