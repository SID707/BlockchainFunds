import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import TransactionHistory from '../pages/TransactionHistory';
import MyCampaigns from '../pages/MyCampaigns';
import Rewards from '../pages/Rewards';
import CampaignDetails from '../pages/CampaignDetails';
import Landing from '../pages/Landing';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions/:walletAddress" element={<TransactionHistory />} />
      <Route path="/my-campaigns/:walletAddress" element={<MyCampaigns />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/campaign/:campaignAddress" element={<CampaignDetails />} />
    </Routes>
  );
};

export default AppRoutes;