import React from 'react';

interface ProfileSubmenuProps {
  onClose: () => void;
}

const ProfileSubmenu: React.FC<ProfileSubmenuProps> = ({ onClose }) => {
  return (
    <div>
      <button data-testid="profile-settings-button" className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => { console.log('Profile Settings'); onClose(); }}>
        Profile Settings
      </button>
      <button data-testid="billing-button" className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => { console.log('Billing'); onClose(); }}>
        Billing
      </button>
      <button data-testid="sign-out-button" className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" onClick={() => { console.log('Sign Out'); onClose(); }}>
        Sign Out
      </button>
    </div>
  );
};

export default ProfileSubmenu;