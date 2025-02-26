import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define the context type
interface ContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

// Define the Task interface
interface Task {
  id: number;
  userId: number[]; // Array for multiple users
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  timeSpent: string;
  deadline: string | null;
  notes: string;
  urgent: boolean; // Swapped from onTarget
}

// Define the TaskFormData interface
interface TaskFormData {
  title: string;
  userIds: number[]; // Array for checkbox selections
  deadline: Date | null;
  notes: string;
  urgent: boolean; // Swapped from onTarget
}

// Define the User interface for fetched users
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Set the app element for react-modal
Modal.setAppElement('#root');

const TasksPage: React.FC = () => {
  const { tasks, setTasks } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]); // State for fetched users
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    userIds: [],
    deadline: null,
    notes: '',
    urgent: false,
  });

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('/api/superadmin/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [setTasks]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/api/superadmin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Handle checkbox changes
  const handleUserCheckboxChange = (userId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      userIds: checked
        ? [...prev.userIds, userId]
        : prev.userIds.filter((id) => id !== userId),
    }));
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      userIds: checked ? users.map((user) => user.id) : [],
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Task>('/api/superadmin/tasks', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsModalOpen(false);
      setFormData({ title: '', userIds: [], deadline: null, notes: '', urgent: false }); // Reset form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Tasks Page</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Create New Task
      </button>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create New Task Modal"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">Create New Task</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <label className="block">
            <span className="text-gray-700 font-medium">Title:</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev: TaskFormData) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </label>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Assign To:</label>
            <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 p-2 rounded-md">
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

          <label className="block">
            <span className="text-gray-700 font-medium">Deadline:</span>
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Notes:</span>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev: TaskFormData) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 h-24"
            />
          </label>
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
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full"
          >
            Submit
          </button>
        </form>
      </Modal>

      {/* Task list */}
      {tasks && tasks.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-600">Status: {task.status}</p>
              <p className="text-gray-600">Deadline: {task.deadline || 'None'}</p>
              <p className={`text-gray-600 ${task.urgent ? 'text-purple-700 font-medium' : ''}`}>
                Urgent: {task.urgent ? 'Yes' : 'No'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-gray-500 text-center">No tasks yet or loading...</p>
      )}
    </div>
  );
};

export default TasksPage;