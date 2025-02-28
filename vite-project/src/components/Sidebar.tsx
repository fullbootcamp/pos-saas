import React from 'react';
import SidebarTitle from './SidebarTitle';

interface SidebarProps {
  themeClass: string;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ themeClass, children }) => {
  return (
    <aside className="bg-gray-800 text-white p-6 w-72 flex-shrink-0 flex flex-col space-y-6 overflow-y-auto" data-testid="sidebar">
      <SidebarTitle themeClass={themeClass} />
      <nav className="space-y-3">{children}</nav>
    </aside>
  );
};

export default Sidebar;