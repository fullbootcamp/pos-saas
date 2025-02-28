import React, { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Help: React.FC<{ onToggle?: (isOpen: boolean) => void }> = ({ onToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isModalOpen;
    setIsModalOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div>
      <button onClick={handleToggle} className="p-2 bg-purple-900 hover:bg-indigo-500 text-white rounded flex items-center">
        <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
        <span>Help</span>
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold">Help Center</h2>
            <p>Contact support or view FAQs here.</p>
            <button onClick={handleToggle} className="mt-2 p-2 bg-red-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;