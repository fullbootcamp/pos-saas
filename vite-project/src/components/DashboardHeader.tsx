import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProfileSubmenu from './ProfileSubmenu';
import DarkModeToggle from './DarkModeToggle';

interface DashboardHeaderProps {
  initial: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  children?: React.ReactElement<DarkModeToggleProps>;
}

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ initial, isDarkMode, toggleDarkMode, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isDarkMode]);

  const renderChildren = () => {
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, { isDarkMode, onToggle: toggleDarkMode });
    }
    return <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />;
  };

  return (
    <div className={`p-4 flex justify-between items-center shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="text-lg font-bold">Logo</div> {/* Black on white, white on dark */}
      <div className="flex items-center space-x-4">
        <motion.button
          className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'} flex items-center justify-center text-lg font-medium`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {initial}
        </motion.button>
        {isMenuOpen && (
          <div
            ref={submenuRef}
            className="absolute right-4 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 submenu"
          >
            <ProfileSubmenu onClose={() => setIsMenuOpen(false)} />
          </div>
        )}
        {renderChildren()}
      </div>
    </div>
  );
};

export default DashboardHeader;