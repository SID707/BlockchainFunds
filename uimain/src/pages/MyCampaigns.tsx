import React from 'react';
import { motion } from 'framer-motion';
import CampaignCard from '../components/CampaignCard';

const MyCampaigns = () => {
  // Mock data - replace with actual user campaigns
  const userCampaigns = [
    {
      id: '4',
      title: 'Web3 Developer Education',
      description: 'Training the next generation of blockchain developers',
      goal: 80,
      raised: 45,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
    },
    // Add more user campaigns as needed
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
        <p className="text-gray-400">Manage your created campaigns</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            {...campaign}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCampaigns;