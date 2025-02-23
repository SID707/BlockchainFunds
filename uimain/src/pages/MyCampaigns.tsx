import React from 'react';
import { motion } from 'framer-motion';
import CampaignCard from '../components/CampaignCard';
import { Plus } from 'lucide-react'; // Add this import

const MyCampaigns = () => {
  const userCampaigns = [
    {
      id: '4',
      title: 'Web3 Developer Education',
      description: 'Training the next generation of blockchain developers',
      goal: 80,
      raised: 45,
      status: 'ongoing',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
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
          <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
          <p className="text-gray-400">Manage your created campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-full"
          onClick={() => console.log('Create campaign clicked')}
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </motion.button>
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