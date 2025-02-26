// File: src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

interface Subscription {
  planName: string;
  price: number;
  interval: string;
  startsAt: string;
  endsAt: string;
  isAutoRenew: boolean;
}

interface Status {
  userName: string;
  registration: boolean;
  emailVerified: boolean;
  storeSetup: boolean;
  planSelected: boolean;
  dashboardCreated: boolean;
  subscription: Subscription | null;
  planId?: number;
  trial_ends_at?: string;
  subscription_ends_at?: string;
}

const Dashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get<{ status: Status }>('http://localhost:5000/api/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Dashboard fetch response:', response.data);
      setUserData(response.data.status);

      if (!response.data.status.dashboardCreated) {
        await axios.post('http://localhost:5000/api/update-dashboard-created', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshedResponse = await axios.get<{ status: Status }>('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(refreshedResponse.data.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleFocus = () => fetchUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordMessage('Not authenticated. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/update-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage(response.data.message);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordMessage(''), 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPasswordMessage(error.response?.data?.message || 'Error updating password.');
      } else {
        setPasswordMessage('An unexpected error occurred.');
      }
    }
  };

  if (loading) return <Layout title="Dashboard"><div>Loading...</div></Layout>;

  const subEnds = userData?.subscription_ends_at ? new Date(userData.subscription_ends_at) : null;
  const trialEnds = userData?.trial_ends_at && !subEnds ? new Date(userData.trial_ends_at) : null;
  const expiryDate = subEnds || trialEnds;
  const daysLeft = expiryDate ? Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const isYearly = userData?.planId === 3;

  return (
    <Layout title={`Dashboard - ${slug}`}>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Your {slug} Dashboard, {userData?.userName || 'User'}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Plan Status</h2>
            <p className="text-gray-600 mt-2">
              {userData?.subscription?.planName || 'Free Demo'}
            </p>
            <p className="text-gray-600 mt-1">
              {daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}
            </p>
            {!isYearly && (
              <button
                onClick={() => navigate('/plan-selection')}
                className="mt-4 w-full py-3 px-6 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 text-lg"
              >
                Upgrade Plan
              </button>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Store Details</h2>
            <p className="text-gray-600 mt-2">Name: {slug}</p>
            <p className="text-gray-600">Type: {userData?.storeSetup ? 'Active' : 'Pending'}</p>
            <button
              onClick={() => navigate(`/pos/${slug}`)}
              className="mt-4 w-full py-3 px-6 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 text-lg"
            >
              Launch POS
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="mt-4 w-full py-3 px-6 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 text-lg"
            >
              {showPasswordForm ? 'Cancel' : 'Update Password'}
            </button>
            {showPasswordForm && (
              <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  Save New Password
                </button>
              </form>
            )}
            {passwordMessage && (
              <p className="mt-2 text-center text-sm text-red-600">{passwordMessage}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;