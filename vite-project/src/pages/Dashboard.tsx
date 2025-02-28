import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import DashboardFooter from '../components/DashboardFooter';
import StoreOverviewTab from '../components/StoreOverviewTab';
import POSTab from '../components/POSTab';
import Help from '../components/Help';
import DarkModeToggle from '../components/DarkModeToggle';

const Dashboard: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode); // Global dark mode
    document.body.style.backgroundColor = isDarkMode ? '#1F2937' : '#F9FAFB'; // Explicitly set body bg
  };

  const footerHeight = 48; // Approximate height
  const helpOffset = 3; // 2-3px overlap

  return (
    <div className={`min-h-screen flex flex-col w-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <DashboardHeader initial="AB" isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </DashboardHeader>
      <div className="flex flex-1 w-full">
        <Sidebar themeClass={isDarkMode ? 'dark' : 'light'}>
          <StoreOverviewTab navigate={() => console.log('Navigating to /dashboard/mobile')} themeClass={isDarkMode ? 'dark' : 'light'} />
          <POSTab navigate={() => console.log('Navigating to /pos/mobile')} themeClass={isDarkMode ? 'dark' : 'light'} />
        </Sidebar>
        <main className="flex-1 p-6 w-full relative">
          <MainContent storeSlug={storeSlug || 'default-store'} isDarkMode={isDarkMode} />
          <div
            className="fixed bottom-0 right-4"
            style={{ bottom: `${footerHeight - helpOffset}px` }} // 2-3px overlap
          >
            <Help />
          </div>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;