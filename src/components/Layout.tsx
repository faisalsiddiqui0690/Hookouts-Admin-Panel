import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { themeService } from '../services/themeService';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize theme on app load
  useEffect(() => {
    themeService.initTheme();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="wrapper" style={{ display: 'flex', width: '100%' }}>
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={toggleSidebar} 
      />
      <div 
        className="content-wrapper" 
        style={{
          flex: 1,
          transition: 'margin-left 0.3s ease-in-out',
          marginLeft: 0,
          minHeight: '100vh'
        }}
      >
        <Header />
        <main className="main-content p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
