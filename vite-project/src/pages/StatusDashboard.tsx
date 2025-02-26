// File: src/pages/StatusDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface Status {
  userName?: string;
  registration: boolean;
  emailVerified: boolean;
  storeSetup: boolean;
  planSelected: boolean;
  dashboardCreated: boolean;
}

const StatusDashboard: React.FC = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) throw new Error('No token found');

        console.log('Fetching status with token:', authToken);

        const response = await axios.get('http://localhost:5000/api/status', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        console.log('Response from /api/status:', response.data);

        if (isMounted && response.data?.status) {
          const userStatus = response.data.status;
          console.log('Parsed status:', userStatus);
          setStatus(userStatus);
          // Redirect if all but dashboardCreated are complete
          if (userStatus.registration && userStatus.emailVerified && userStatus.storeSetup && userStatus.planSelected) {
            const storeSlug = localStorage.getItem('storeSlug') || 'default';
            console.log('Redirecting to dashboard:', `/dashboard/${storeSlug}`);
            navigate(`/dashboard/${storeSlug}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching status:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => { isMounted = false; };
  }, [navigate]);

  const handleContinue = () => {
    if (status) {
      console.log('Current status in handleContinue:', status);
      if (!status.storeSetup) {
        console.log('Redirecting to choose-store-type');
        navigate('/choose-store-type');
      } else if (!status.planSelected) {
        console.log('Redirecting to plan-selection');
        navigate('/plan-selection');
      } else if (!status.dashboardCreated) {
        console.log('Redirecting to dashboard creation:', `/dashboard/${localStorage.getItem('storeSlug') || ''}`);
        navigate(`/dashboard/${localStorage.getItem('storeSlug') || ''}`);
      } else {
        console.log('Redirecting to dashboard:', `/dashboard/${localStorage.getItem('storeSlug') || ''}`);
        navigate(`/dashboard/${localStorage.getItem('storeSlug') || ''}`);
      }
    }
  };

  const getStatusStyle = (status: boolean | undefined | null) => {
    if (status === undefined || status === null) return 'text-gray-500';
    return status ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold';
  };

  const calculateProgress = (status: Status | null) => {
    if (!status) return 0;
    const totalSteps = 5;
    const completedSteps = [
      status.registration,
      status.emailVerified,
      status.storeSetup,
      status.planSelected,
      status.dashboardCreated,
    ].filter(Boolean).length;
    return (completedSteps / totalSteps) * 100;
  };

  if (loading) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-gray-600">Loading...</div></Layout>;
  if (error) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-red-500">Error: {error}</div></Layout>;
  if (!status) return <Layout title="Status Dashboard"><div className="text-center mt-8 text-gray-600">No status data available.</div></Layout>;

  return (
    <Layout title="Status Dashboard">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome, {status.userName || 'User'}!</h1>
          <div className="w-full h-2 bg-gray-300 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress(status)}%` }}
            ></div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="text-lg">Registration: <span className={getStatusStyle(status.registration)}>{status.registration ? '✅ Completed' : '⚠️ Not Started'}</span></div>
            <div className="text-lg">Email Verified: <span className={getStatusStyle(status.emailVerified)}>{status.emailVerified ? '✅ Completed' : '⚠️ Not Started'}</span></div>
            <div className="text-lg">Store Setup: <span className={getStatusStyle(status.storeSetup)}>{status.storeSetup ? '✅ Completed' : '⚠️ Not Started'}</span></div>
            <div className="text-lg">Plan Selected: <span className={getStatusStyle(status.planSelected)}>{status.planSelected ? '✅ Completed' : '⚠️ Not Started'}</span></div>
            <div className="text-lg">Dashboard Created: <span className={getStatusStyle(status.dashboardCreated)}>{status.dashboardCreated ? '✅ Completed' : '⚠️ Not Started'}</span></div>
          </div>
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
            onClick={handleContinue}
            disabled={loading || !status}
          >
            {!status.storeSetup ? 'Set Up Your Store' : !status.planSelected ? 'Select a Plan' : !status.dashboardCreated ? 'Create Dashboard' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StatusDashboard;