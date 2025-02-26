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
  userId: number[];  // Array for multiple users
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  timeSpent: string;
  deadline: string | null;
  notes: string;
  urgent: boolean;  // Swapped from onTarget
}

// Define the TaskFormData interface
interface TaskFormData {
  title: string;
  userIds: number[];  // Array for checkbox selections
  deadline: Date | null;
  notes: string;
  urgent: boolean;  // Swapped from onTarget
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
  const [users, setUsers] = useState<User[]>([]);  // State for fetched users
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
        // Adjust to your actual tasks endpoint once implemented
        const response = await axios.get<Task[]>('/api/superadmin/tasks');  // Placeholder until GET is added
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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },  // Add your token logic
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },  // Add your token logic
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsModalOpen(false);
      setFormData({ title: '', userIds: [], deadline: null, notes: '', urgent: false });  // Reset form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  console.log('Tasks:', tasks);
console.log('Users:', users);

  return (
    <div>
      <h1>Tasks Page</h1>
      <button onClick={() => setIsModalOpen(true)}>Create Task</button>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Create New Task Modal"
>
  <h2>Create New Task</h2>
  <form onSubmit={handleFormSubmit}>
    <label>
      Title:
      <input
        type="text"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev: TaskFormData) => ({
            ...prev,
            title: e.target.value,
          }))
        }
      />
    </label>

    <label>Assign To:</label>
    <div>
      <label>
        <input
          type="checkbox"
          checked={formData.userIds.length === users.length && users.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        Select All
      </label>
    </div>
    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {users.map((user) => (
        <div key={user.id}>
          <label>
            <input
              type="checkbox"
              checked={formData.userIds.includes(user.id)}
              onChange={(e) => handleUserCheckboxChange(user.id, e.target.checked)}
            />
            {user.name || 'Unnamed'} - {user.role}
          </label>
        </div>
      ))}
    </div>

    <label>
      Deadline:
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
      />
    </label>
    <label>
      Notes:
      <textarea
        value={formData.notes}
        onChange={(e) =>
          setFormData((prev: TaskFormData) => ({
            ...prev,
            notes: e.target.value,
          }))
        }
      />
    </label>
    <label>
      Urgent:
      <input
        type="checkbox"
        checked={formData.urgent}
        onChange={(e) =>
          setFormData((prev: TaskFormData) => ({
            ...prev,
            urgent: e.target.checked,
          }))
        }
      />
    </label>
    <button type="submit">Submit</button>
  </form>
</Modal>

      {/* Display the list of tasks */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Deadline: {task.deadline}</p>
            <p>Urgent: {task.urgent ? 'Yes' : 'No'}</p>  {/* Added for visibility */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;