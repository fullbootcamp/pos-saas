import React from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
  label: string;
  icon: React.ElementType;
  path: string;
  themeClass: string;
  onClick: (path: string) => void; // Updated to accept path
}

const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, path, themeClass, onClick }) => {
  return (
    <motion.button
      onClick={() => onClick(path)} // Pass path to onClick
      className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md transition-all duration-300 flex items-center`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-5 w-5 mr-2" />
      <span>{label}</span>
    </motion.button>
  );
};

export default NavItem;