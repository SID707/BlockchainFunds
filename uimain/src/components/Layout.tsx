import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex min-h-screen">
      {!isLandingPage && <Sidebar />}
      <motion.main 
        className={`flex-1 ${!isLandingPage ? 'p-8' : 'p-0'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;