import React from 'react';

interface SidebarTitleProps {
  themeClass: string;
}

const SidebarTitle: React.FC<SidebarTitleProps> = ({ themeClass }) => {
  return (
    <h3 className={`text-xl font-semibold ${themeClass === 'dark' ? 'border-gray-600' : 'border-gray-600'} pb-2 border-b`} data-testid="sidebar-title">
      Store Menu
    </h3>
  );
};

export default SidebarTitle;