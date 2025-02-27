import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DasboardHeader';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#DDE6ED] dark:bg-[#2D3748] text-gray-800 dark:text-gray-200">
      {/* Header */}
      <DashboardHeader initial={undefined} isDarkMode={false} toggleDarkMode={() => {}} />
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left Pane (Sidebar) */}
        <aside className="bg-gray-800 text-white p-6 w-72 flex-shrink-0 flex flex-col space-y-6 overflow-y-auto">
          <h3 className="text-xl font-semibold border-gray-600 pb-2 border-b">Store Menu</h3>
          {children}
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 p-6 overflow-auto">
            <Outlet /> {/* Dynamic content based on route */}
          </main>
          {/* Help Button (Bottom Right) */}
          <div className="p-6 flex justify-end">
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded">
              Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;