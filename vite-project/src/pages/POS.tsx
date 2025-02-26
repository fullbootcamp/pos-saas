// File: src/pages/POS.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const POS: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {slug} Point of Sale
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <button
          className="bg-purple-600 text-white py-8 px-12 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 text-2xl font-semibold"
        >
          New Sale
        </button>
        <button
          className="bg-purple-600 text-white py-8 px-12 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 text-2xl font-semibold"
        >
          Items
        </button>
        <button
          className="bg-purple-600 text-white py-8 px-12 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 text-2xl font-semibold"
        >
          Payments
        </button>
      </div>
    </div>
  );
};

export default POS;