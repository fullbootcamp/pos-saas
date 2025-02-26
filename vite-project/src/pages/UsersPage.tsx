// File: src/pages/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure named export


interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user';
  tasks: Task[];
  status?: 'active' | 'inactive';
  password?: string; // Optional for user creation
}

interface Task {
  id: number;
  userId: number[]; // Array for multiple users
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  timeSpent: string;
  deadline: string | null; // ISO date string or null for stored tasks
  notes: string;
  onTarget: boolean;
}

interface TokenPayload {
  id: number;
  role: 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user';
  locationRoles: Array<{ store_location_id: number; role: string }>;
}

const UsersPage: React.FC = () => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', password: '', role: 'superadmin', tasks: [], status: 'active' });
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        // Decode token to verify logged-in user (superadmin, ID 18)
        const decodedToken = jwtDecode<TokenPayload>(token);
        console.log('Decoded Token:', decodedToken);

        if (decodedToken.role !== 'superadmin') throw new Error('Access denied');

        // Fetch users
        const usersResponse = await axios.get<User[]>('http://localhost:5000/api/superadmin/users', { headers: { Authorization: `Bearer ${token}` } });
        setUsers(usersResponse.data || []);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error('Error fetching users:', axiosError.message);
        setError(axiosError.message || 'Error fetching users');
      }
    };

    void fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const decodedToken = jwtDecode<TokenPayload>(token);
      if (decodedToken.role !== 'superadmin') throw new Error('Access denied');

      const userData: Partial<User> = {
        name: newUser.name ?? '',
        email: newUser.email ?? '',
        role: newUser.role ?? 'superadmin',
        status: newUser.status ?? 'active',
      };
      if (newUser.password) {
        userData.password = newUser.password; // Only include password if provided
      }

      const response = await axios.post<User>('http://localhost:5000/api/superadmin/users', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prevUsers => [...prevUsers, response.data]);
      setNewUser({ name: '', email: '', password: '', role: 'superadmin', tasks: [], status: 'active' });
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Error creating user:', axiosError.message);
      setError(axiosError.message || 'Error creating user. Check name, email, password, and role.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
          className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Switch to {viewMode === 'cards' ? 'List' : 'Cards'} View
        </button>
      </div>
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <p className="text-sm text-gray-600">Status: {user.status ?? 'active'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Users List</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Role</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.status ?? 'active'}</td>
                  <td className="p-2">
                    <button className="bg-purple-600 text-white py-1 px-2 rounded-md hover:bg-purple-700 mr-2 transition">Edit</button>
                    <button className="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Superadmin</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={newUser.name ?? ''}
          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value, email: prev.email ?? '', password: prev.password ?? '', role: prev.role ?? 'superadmin', tasks: [], status: prev.status ?? 'active' }))}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email ?? ''}
          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value, name: prev.name ?? '', password: prev.password ?? '', role: prev.role ?? 'superadmin', tasks: [], status: prev.status ?? 'active' }))}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password ?? ''}
          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value, name: prev.name ?? '', email: prev.email ?? '', role: prev.role ?? 'superadmin', tasks: [], status: prev.status ?? 'active' }))}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          required
        />
        <select
          value={newUser.role ?? 'superadmin'}
          onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'superadmin' | 'junior dev' | 'dev' | 'tech lead' | 'user', name: prev.name ?? '', email: prev.email ?? '', password: prev.password ?? '', tasks: [], status: prev.status ?? 'active' }))}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        >
          <option value="superadmin">Superadmin</option>
          <option value="junior dev">Junior Dev</option>
          <option value="dev">Dev</option>
          <option value="tech lead">Tech Lead</option>
          <option value="user">User</option>
        </select>
        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default UsersPage;