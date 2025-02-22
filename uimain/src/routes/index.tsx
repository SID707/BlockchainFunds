import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import TransactionHistory from '../pages/TransactionHistory';
import MyCampaigns from '../pages/MyCampaigns';
import Rewards from '../pages/Rewards';
import CampaignDetails from '../pages/CampaignDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionHistory />} />
      <Route path="/my-campaigns" element={<MyCampaigns />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
    </Routes>
  );
};

export default AppRoutes;