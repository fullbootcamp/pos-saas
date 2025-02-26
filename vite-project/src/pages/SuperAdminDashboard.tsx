// File: src/pages/SuperadminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user';
  tasks: Task[];
  status?: 'active' | 'inactive';
}

interface Task {
  id: number;
  userId: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  timeSpent: string;
  deadline: string;
  notes: string;
  onTarget: boolean;
}

const SuperadminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [usersRes, tasksRes] = await Promise.all([
          fetch('/api/superadmin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/superadmin/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!usersRes.ok || !tasksRes.ok) throw new Error('Failed to fetch data');
        setUsers(await usersRes.json() as User[]);
        setTasks(await tasksRes.json() as Task[]);
      } catch (error) {
        console.error('Error fetching superadmin data:', error);
      }
    };

    void fetchData();
  }, [navigate]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout title="Superadmin Dashboard">
      <div className="flex max-h-screen">
        {/* Left Navigation Pane */}
        <nav className="w-64 bg-white shadow-md p-4 h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/tasks')}
                className={`w-full text-left px-4 py-2 rounded-md ${location.pathname === '/tasks' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-700 hover:text-white transition`}
              >
                Tasks
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/users')}
                className={`w-full text-left px-4 py-2 rounded-md ${location.pathname === '/users' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-purple-700 hover:text-white transition`}
              >
                Users
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content with Progress Bar (only on root) */}
        <div className="flex-1 p-6 overflow-y-auto">
          {location.pathname === '/superadmin-dashboard' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sprint Overview - RetailPoz</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Progress</h3>
                <p className="text-gray-600 mb-2">Completed: {completedTasks} / {totalTasks} tasks</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-vintage-rose-vibrant-pink h-4 rounded-full"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 mt-2">{overallProgress}% Complete | ~3 Days Left</p>
              </div>
            </>
          )}
          <Outlet context={{ users, setUsers, tasks, setTasks }} />
        </div>
      </div>

      
    </Layout>
  );
};

export default SuperadminDashboard;