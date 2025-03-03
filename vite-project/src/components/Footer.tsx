// File: src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-900 text-white p-6 w-screen">
      <div className="w-full mx-auto text-center px-4">
        <p>© 2025 POS SaaS. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/help" className="hover:underline text-white">Help</a>
          <a href="/resources" className="hover:underline text-white">Resources</a>
          <a href="/terms" className="hover:underline text-white">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;