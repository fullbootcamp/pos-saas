import React, { useState } from 'react';

interface HelpProps {
  onToggle?: (isOpen: boolean) => void;
}

const Help: React.FC<HelpProps> = ({ onToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isModalOpen;
    setIsModalOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div>
      <button onClick={handleToggle} className="p-2 bg-blue-500 text-white rounded">
        Help
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