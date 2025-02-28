import React from 'react';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800" data-testid="main-content">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="mt-4">Welcome to your store dashboard. Add charts or data here.</p>
    </main>
  );
};

export default MainContent;