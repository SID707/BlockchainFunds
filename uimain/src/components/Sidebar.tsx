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
import { ConnectButton, lightTheme, useActiveAccount } from 'thirdweb/react';
import { client } from '../client';

const Sidebar = () => {
  const account = useActiveAccount();
  return (
    <motion.aside
      className="fixed top-0 left-0 h-screen w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col justify-between overflow-y-auto"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="flex items-center gap-3 mb-8 px-4">
          <Blocks className="w-8 h-8 text-primary-500" />
          <h1 className="text-xl font-bold text-white">CryptoFund</h1>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
            Campaigns
          </NavLink>

          <NavLink to={`/transactions/:${account?.address}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <History className="w-5 h-5" />
            Transaction History
          </NavLink>

          <NavLink to={`/my-campaigns/:${account?.address}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Megaphone className="w-5 h-5" />
            My Campaigns
          </NavLink>

          <NavLink to="/rewards" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Gift className="w-5 h-5" />
            Rewards
          </NavLink>
        </nav>
      </div>

      <ConnectButton
        client={client}
        theme={lightTheme()}
        detailsButton={{
          style: {
            maxHeight: "50px",
          },
        }}
      /> 
    </motion.aside>
  );
};

export default Sidebar;