import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const POSTab: React.FC<{ navigate: (path: string) => void; themeClass: string }> = ({ navigate, themeClass }) => {
  return (
    <button
      className={`w-full text-left py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-300 flex items-center ${themeClass === 'dark' ? 'hover:bg-blue-700' : ''}`}
      onClick={() => navigate('/pos/mobile')}
    >
      <ShoppingCartIcon className="h-5 w-5 mr-2" />
      <span>Launch POS</span>
    </button>
  );
};

export default POSTab;