import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Award } from 'lucide-react';

const Rewards = () => {
  const rewards = [
    {
      id: '1',
      title: 'Early Supporter',
      description: 'Contributed to 5+ campaigns in their early stages',
      icon: Star,
      progress: 80,
    },
    {
      id: '2',
      title: 'Impact Maker',
      description: 'Total contributions exceed 10 ETH',
      icon: Award,
      progress: 60,
    },
    {
      id: '3',
      title: 'Community Champion',
      description: 'Successfully completed 3 campaigns',
      icon: Gift,
      progress: 40,
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Rewards</h1>
        <p className="text-gray-400">Track your achievements and earned rewards</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary-500/20 text-primary-500">
                <reward.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{reward.title}</h3>
            </div>
            
            <p className="text-gray-400 mb-4">{reward.description}</p>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{reward.progress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${reward.progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;