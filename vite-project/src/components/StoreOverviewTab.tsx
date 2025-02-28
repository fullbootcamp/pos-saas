import React from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import NavItem from './NavbarItem';

interface StoreOverviewTabProps {
  navigate: (path: string) => void;
  themeClass: string;
}

const StoreOverviewTab: React.FC<StoreOverviewTabProps> = ({ navigate, themeClass }) => {
  return (
    <NavItem
      label="Store Overview"
      icon={BuildingStorefrontIcon}
      path="/dashboard/mobile"
      themeClass={themeClass}
      onClick={() => navigate('/dashboard/mobile')}
    />
  );
};

export default StoreOverviewTab;