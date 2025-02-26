// File: src/pages/Login.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface LoginResponse {
  token: string;
  role: 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user';
  user: {
    id: number;
    email: string;
    name: string;
  };
  redirectTo: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', { email, password });
      const { token, role, redirectTo } = response.data;
      localStorage.setItem('token', token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        if (role === 'superadmin') {
          navigate('/superadmin-dashboard'); // Ensure superadmin redirects to /superadmin-dashboard
        } else {
          navigate(redirectTo); // Use backend redirectTo for other roles
        }
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage(axiosError.response?.data?.message ?? 'Login failed. Check email and password.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage('Please enter your email.');
      return;
    }
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
    }
  };

  return (
    <Layout title={showForgotPassword ? 'Reset Your Password' : 'Login to Your Account'}>
      <div className="max-w-md mx-auto px-4 py-6">
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
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
              Login
            </button>
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
              <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="forgotEmail"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-vintage-rose-vibrant-pink text-white rounded-md hover:bg-vintage-rose-medium-purple transition-all duration-300 font-semibold"
            >
              Send Reset Email
            </button>
            <p
              className="text-center text-sm text-purple-600 cursor-pointer hover:underline"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </p>
          </form>
        )}
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </Layout>
  );
};

export default Login;