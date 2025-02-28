import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import NavItem from './NavbarItem';

interface POSTabProps {
  navigate: (path: string) => void;
  themeClass: string;
}

const POSTab: React.FC<POSTabProps> = ({ navigate, themeClass }) => {
  return (
    <NavItem
      label="POS"
      icon={ArrowRightIcon}
      path="/pos/mobile"
      themeClass={themeClass}
      onClick={() => navigate('/pos/mobile')}
    />
  );
};

export default POSTab;