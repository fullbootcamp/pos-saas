import React from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutDashboardProps {
  children?: React.ReactNode;
}

const LayoutDashboard: React.FC<LayoutDashboardProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* No top menubar or header */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left Pane for Store Settings and Navigation */}
        <aside className="bg-gray-800 text-white p-6 flex flex-col space-y-6 border-t-0 min-w-[240px] flex-shrink-0">
          <h3 className="text-xl font-semibold border-gray-600 pb-2 border-b">Store Menu</h3>
          {children}
        </aside>
        {/* Main Content and Profile Area */}
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 p-6 bg-[#DDE6ED] overflow-auto">
            <Outlet /> {/* Renders child routes */}
          </main>
          {/* Right-side Profile Placeholder (to be populated in Dashboard.tsx) */}
          <div className="w-64 p-6 bg-gray-100 flex-shrink-0 hidden md:block">
            {/* Profile content will be added in Dashboard.tsx */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutDashboard;