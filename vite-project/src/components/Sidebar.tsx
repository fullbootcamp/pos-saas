import React from 'react';
import SidebarTitle from './SidebarTitle';

interface SidebarProps {
  themeClass: string;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ themeClass, children }) => {
  return (
    <aside className={`p-6 w-72 flex-shrink-0 flex flex-col space-y-6 overflow-y-auto ${themeClass === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'}`}>
      <SidebarTitle themeClass={themeClass} />
      <nav className="space-y-3">{children}</nav>
    </aside>
  );
};

export default Sidebar;