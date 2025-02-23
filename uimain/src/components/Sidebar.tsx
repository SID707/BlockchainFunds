import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  History, 
  Megaphone, 
  Gift, 
  Blocks
} from 'lucide-react';

const Sidebar = () => {
  return (
    <motion.aside 
      className="w-64 bg-gray-900 p-4 border-r border-gray-800"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-8 px-4">
        <Blocks className="w-8 h-8 text-primary-500" />
        <h1 className="text-xl font-bold text-white">FusionFunds</h1>
      </div>
      
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="w-5 h-5" />
          Campaigns
        </NavLink>
        
        <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <History className="w-5 h-5" />
          Transaction History
        </NavLink>
        
        <NavLink to="/my-campaigns" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Megaphone className="w-5 h-5" />
          My Campaigns
        </NavLink>
        
        <NavLink to="/rewards" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Gift className="w-5 h-5" />
          Rewards
        </NavLink>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;