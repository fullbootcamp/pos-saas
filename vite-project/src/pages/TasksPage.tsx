import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CheckCircleIcon, ExclamationCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface ContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface Task {
  id: number;
  userIds: number[];
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  deadline: string | null;
  notes: string;
  urgent: boolean;
  createdAt: string;
}

interface TaskFormData {
  title: string;
  userIds: number[];
  deadline: Date | null;
  notes: string;
  urgent: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

Modal.setAppElement('#root');

const TasksPage: React.FC = () => {
  const { tasks, setTasks } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    userIds: [],
    deadline: null,
    notes: '',
    urgent: false,
  });

  const [filters, setFilters] = useState({
    date: null as Date | null,
    urgent: null as boolean | null,
    completed: null as boolean | null,
    userId: null as number | null,
  });

  const fetchTasks = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, tasks not fetched');
      setTasks([]); // Clear tasks if no token
      return;
    }

    try {
      const response = await axios.get<Task[]>('/api/superadmin/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      console.log('Tasks fetched:', response.data); // Debug
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        console.error('Unauthorized: Tasks not fetched');
        setTasks([]);
      } else {
        console.error('Error fetching tasks:', axiosError.message);
      }
    }
  }, [setTasks]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, users not fetched');
        setUsers([]);
        return;
      }

      try {
        const response = await axios.get<User[]>('/api/superadmin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        console.log('Users fetched:', response.data); // Debug
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 401) {
          console.error('Unauthorized: Users not fetched');
          setUsers([]);
        } else {
          console.error('Error fetching users:', axiosError.message);
        }
      }
    };

    void fetchUsers();
  }, []);

  const handleUserCheckboxChange = (userId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      userIds: checked
        ? [...prev.userIds, userId]
        : prev.userIds.filter((id) => id !== userId),
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      userIds: checked ? users.map((user) => user.id) : [],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot create task');
      return;
    }

    try {
      const taskData = {
        ...formData,
        deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : null,
      };
      const response = await axios.post<Task>('/api/superadmin/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsModalOpen(false);
      setFormData({ title: '', userIds: [], deadline: null, notes: '', urgent: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        console.error('Unauthorized: Task creation failed');
        setTasks([]);
      } else {
        console.error('Error creating task:', axiosError.message);
      }
    }
  };

  const getUserNames = (userIds: number[]) => {
    return userIds
      .map((id) => users.find((user) => user.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesDate = !filters.date || 
      (new Date(task.createdAt).toDateString() === filters.date.toDateString()) || 
      (task.deadline && new Date(task.deadline).toDateString() === filters.date.toDateString());
    const matchesUrgent = filters.urgent === null || task.urgent === filters.urgent;
    const matchesCompleted = filters.completed === null || 
      (filters.completed && task.status === 'Done') || 
      (!filters.completed && task.status !== 'Done');
    const matchesUser = filters.userId === null || task.userIds.includes(filters.userId);
    return matchesDate && matchesUrgent && matchesCompleted && matchesUser;
  });

  type FilterValue = Date | null | boolean | number | null;
  const handleFilterChange = (key: keyof typeof filters, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center space-x-2">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V5a1 1 0 112 0v4a1 1 0 11-2 0zm0 4a1 1 0 112 0v1a1 1 0 11-2 0v-1z" clipRule="evenodd" />
        </svg>
        Tasks Page
      </h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Task
        </button>
        <button
          onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm2 2v12h8V5H6z" clipRule="evenodd" />
          </svg>
          Switch to {viewMode === 'card' ? 'List' : 'Card'} View
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Filter Tasks</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date:</label>
            <div className="relative">
              <DatePicker
                selected={filters.date}
                onChange={(date: Date | null) => handleFilterChange('date', date)}
                dateFormat="yyyy-MM-dd"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 pr-10"
                placeholderText="Select date"
                isClearable
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Urgent:</label>
            <select
              value={filters.urgent !== null ? filters.urgent.toString() : 'all'}
              onChange={(e) => handleFilterChange('urgent', e.target.value === 'all' ? null : e.target.value === 'true')}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Status:</label>
            <select
              value={filters.completed !== null ? filters.completed.toString() : 'all'}
              onChange={(e) => handleFilterChange('completed', e.target.value === 'all' ? null : e.target.value === 'true')}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
            >
              <option value="all">All</option>
              <option value="true">Completed</option>
              <option value="false">Not Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">User:</label>
            <select
              value={filters.userId !== null ? filters.userId.toString() : 'all'}
              onChange={(e) => handleFilterChange('userId', e.target.value === 'all' ? null : parseInt(e.target.value))}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
            >
              <option value="all">All</option>
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || 'Unnamed'} - {user.role}
                  </option>
                ))
              ) : (
                <option disabled>Loading users...</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {filteredTasks && filteredTasks.length > 0 ? (
        viewMode === 'card' ? (
          <ul className="mt-6 grid grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">Assigned to: {getUserNames(task.userIds)}</p>
                <p className="text-gray-600">
                  Status: <span className={`inline-block px-2 py-1 rounded ${task.status === 'Done' ? 'bg-green-200 text-green-800' : task.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{task.status}</span>
                </p>
                <p className="text-gray-600">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</p>
                <p className="text-gray-600 flex items-center space-x-1">
                  <span>Urgent:</span>
                  {task.urgent ? (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-500">Yes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-green-500">No</span>
                    </>
                  )}
                </p>
                <p className="text-gray-600">Notes: {task.notes || 'None'}</p>
                <p className="text-gray-600">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Title</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Assigned To</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Status</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Deadline</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Urgent</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Notes</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Created</th>
                  <th className="py-2 px-4 text-left text-gray-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-t">
                    <td className="py-2 px-4 text-gray-800">{task.title}</td>
                    <td className="py-2 px-4 text-gray-800">{getUserNames(task.userIds)}</td>
                    <td className="py-2 px-4 text-gray-800">
                      <span className={`inline-block px-2 py-1 rounded ${task.status === 'Done' ? 'bg-green-200 text-green-800' : task.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{task.status}</span>
                    </td>
                    <td className="py-2 px-4 text-gray-800">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</td>
                    <td className="py-2 px-4 text-gray-800 flex items-center space-x-1">
                      <span>Urgent:</span>
                      {task.urgent ? (
                        <>
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-red-500">Yes</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          <span className="text-green-500">No</span>
                        </>
                      )}
                    </td>
                    <td className="py-2 px-4 text-gray-800">{task.notes || 'None'}</td>
                    <td className="py-2 px-4 text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <p className="mt-6 text-gray-500 text-center text-lg">No tasks yet or loading...</p>
      )}

<Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Create New Task Modal"
  className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto max-h-[calc(100vh-140px)] overflow-y-auto"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-purple-700">Create New Task</h2>
    <button
      onClick={() => setIsModalOpen(false)}
      className="text-gray-500 hover:text-gray-700 text-xl"
    >
      ×
    </button>
  </div>
  <form className="space-y-4" onSubmit={handleFormSubmit}>
    <div className="grid grid-cols-2 gap-6"> {/* Increased gap to 6 for better spacing */}
      {/* Left Column */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev: TaskFormData) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
          placeholder="Enter task title"
        />
      </div>
      {/* Right Column */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Deadline:</label>
        <div className="relative mt-1">
          <DatePicker
            selected={formData.deadline}
            onChange={(date: Date | null) =>
              setFormData((prev: TaskFormData) => ({
                ...prev,
                deadline: date,
              }))
            }
            dateFormat="yyyy-MM-dd"
            isClearable
            className="block w-full bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 pr-10 text-gray-900" 
            placeholderText="Select deadline"
          />
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
        </div>
      </div>
      {/* Left Column (Spanning Both) */}
      <div className="col-span-2">
        <label className="block text-gray-700 font-medium mb-2">Assign To:</label>
        <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-md border border-gray-300"> {/* Increased padding to p-3 */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.userIds.length === users.length && users.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="text-gray-800">Select All</span>
          </label>
          {users.length > 0 ? (
            users.map((user) => (
              <label key={user.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.userIds.includes(user.id)}
                  onChange={(e) => handleUserCheckboxChange(user.id, e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-gray-800">{user.name || 'Unnamed'} - {user.role}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500">Loading users...</p>
          )}
        </div>
      </div>
      {/* Right Column (Spanning Both) */}
      <div className="col-span-2">
        <label className="block text-gray-700 font-medium mb-2">Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev: TaskFormData) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          className="mt-1 block w-full bg-gray-50 p-3 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 max-h-48 overflow-y-auto resize-none" 
        />
      </div>
      {/* Full Width for Urgent and Submit */}
      <div className="col-span-2 flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.urgent}
            onChange={(e) =>
              setFormData((prev: TaskFormData) => ({
                ...prev,
                urgent: e.target.checked,
              }))
            }
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <span className="text-gray-700 font-medium">Urgent</span>
        </label>
        <div className="ml-auto">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</Modal>
    </div>
  );
};

export default TasksPage;