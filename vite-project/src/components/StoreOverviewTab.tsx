import React from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const StoreOverviewTab: React.FC<{ navigate: (path: string) => void; themeClass: string }> = ({ navigate, themeClass }) => {
  return (
    <button
      className={`w-full text-left py-2 px-4 ${themeClass === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} rounded-md transition-all duration-300 flex items-center`}
      onClick={() => navigate('/dashboard/mobile')}
    >
      <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
      <span>Store Overview</span>
    </button>
  );
};

export default StoreOverviewTab;