// src/pages/TasksPage.tsx
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
  userId: number[];
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  timeSpent: string;
  deadline: string | null;
  notes: string;
  onTarget: boolean;
}

// Define the TaskFormData interface
interface TaskFormData {
  title: string;
  userIds: number[];
  deadline: Date | null;
  notes: string;
  onTarget: boolean;
}

// Set the app element for react-modal (to avoid accessibility warnings)
Modal.setAppElement('#root');

const TasksPage: React.FC = () => {
  const { tasks, setTasks } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    userIds: [],
    deadline: null,
    notes: '',
    onTarget: false,
  });

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [setTasks]);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Task>('/api/tasks', formData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <h1>Tasks Page</h1>
      <button onClick={() => setIsModalOpen(true)}>Create Task</button>

      {/* Modal for creating a new task */}
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </label>
          <label>
            User IDs:
            <input
              type="text"
              value={formData.userIds.join(',')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userIds: e.target.value
                    .split(',')
                    .map((id) => Number(id.trim())),
                })
              }
            />
          </label>
          <label>
            Deadline:
            <DatePicker
              selected={formData.deadline}
              onChange={(date: Date | null) =>
                setFormData({ ...formData, deadline: date })
              }
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </label>
          <label>
            Notes:
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </label>
          <label>
            On Target:
            <input
              type="checkbox"
              checked={formData.onTarget}
              onChange={(e) =>
                setFormData({ ...formData, onTarget: e.target.checked })
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;