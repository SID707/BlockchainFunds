import React from 'react';
import { motion } from 'framer-motion';
import CampaignCard from '../components/CampaignCard';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const campaigns = [
    {
      id: '1',
      title: 'Decentralized Education Platform',
      description: 'Building a blockchain-based platform for accessible education worldwide',
      goal: 100,
      raised: 65,
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      title: 'Green Energy Blockchain Initiative',
      description: 'Implementing blockchain solutions for renewable energy tracking',
      goal: 200,
      raised: 120,
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      title: 'DeFi for Social Impact',
      description: 'Creating financial instruments for social good using blockchain',
      goal: 150,
      raised: 89,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to CryptoFund</h1>
          <p className="text-gray-400">Discover and support innovative blockchain projects</p>
        </div>
        <button className="bg-purple-500 text-white px-4 py-2 rounded">Connect Wallet</button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.id}
            {...campaign}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;