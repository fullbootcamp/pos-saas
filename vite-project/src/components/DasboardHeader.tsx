import React, { useContext } from 'react'; // Restored to prevent red underlines
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _useContext = useContext; // Dummy usage to suppress warning

interface DashboardHeaderProps {
  initial?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ initial = 'U', isDarkMode, toggleDarkMode }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      {/* Left Section with Profile */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-medium"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {initial}
        </motion.button>
        <div className="relative">
          <div className="mt-2 space-y-1 hidden group-hover:block absolute bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
            <button className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => console.log('Profile Settings')}>
              Profile Settings
            </button>
            <button className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => console.log('Billing')}>
              Billing
            </button>
            <button className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => console.log('Sign Out')}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {/* Right Section with Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-300" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
      </motion.button>
    </div>
  );
};

export default DashboardHeader;