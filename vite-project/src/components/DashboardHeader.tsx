import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProfileSubmenu from './ProfileSubmenu';
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  initial: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ initial, isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null); // Use useRef to store submenu element.

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800 shadow-md relative">
      <div className="text-lg font-bold">Logo</div>
      <div className="flex items-center space-x-4">
        <motion.button
          className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-medium"
          onClick={() => setIsMenuOpen(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {initial}
        </motion.button>
        {isMenuOpen && (
          <div
            ref={submenuRef} // Attach ref to the submenu div
            className="absolute right-4 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50 submenu"
          >
            <ProfileSubmenu onClose={() => setIsMenuOpen(false)} />
          </div>
        )}
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>
    </div>
  );
};

export default Header;