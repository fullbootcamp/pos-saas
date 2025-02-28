import React from 'react';

interface MainContentProps {
  storeSlug?: string;
  isDarkMode?: boolean; // Add isDarkMode prop
}

const MainContent: React.FC<MainContentProps> = ({ storeSlug, isDarkMode }) => {
  return (
    <main
      className={`flex-1 p-6 border-l ${isDarkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}
      data-testid="main-content"
    >
      <h1 className="text-2xl font-bold">Dashboard Overview for {storeSlug || 'Default Store'}</h1>
      <p className="mt-4">Welcome to your store dashboard. Add charts or data here.</p>
    </main>
  );
};

export default MainContent;