import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200 h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};