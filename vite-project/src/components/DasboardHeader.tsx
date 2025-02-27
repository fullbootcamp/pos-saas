import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  initial?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ initial = 'U', isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={headerRef} className="header bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      {/* Left Section (Logo Placeholder) */}
      <div className="text-lg font-bold">Logo</div>
      {/* Right Section with Profile and Toggle */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="group w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-medium"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {initial}
        </motion.button>
        {isMenuOpen && (
          <div className="absolute right-4 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
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
        )}
        <motion.button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-300" /> : <MoonIcon className="h-6 w-6 text-gray-700" />}
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardHeader;