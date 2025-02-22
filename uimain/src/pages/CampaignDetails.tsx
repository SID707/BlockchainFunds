import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Target, Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();

  // Mock data - replace with actual campaign details
  const campaign = {
    id,
    title: 'Decentralized Education Platform',
    description: 'Building a blockchain-based platform for accessible education worldwide. Our mission is to democratize education through blockchain technology, making quality learning resources available to everyone, everywhere.',
    goal: 100,
    raised: 65,
    backers: 128,
    daysLeft: 15,
    creator: '0x1234...5678',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80',
    fundingHistory: [
      {
        id: '1',
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '5.5 ETH',
        timestamp: '2024-03-15 14:30:45',
      },
      {
        id: '2',
        address: '0x9B3a54D092Ad2C4D6729c4B7E73189C34E12F14A',
        amount: '2.8 ETH',
        timestamp: '2024-03-14 09:15:22',
      },
      {
        id: '3',
        address: '0x1D23456789ABCDEF0123456789ABCDEF01234567',
        amount: '1.2 ETH',
        timestamp: '2024-03-13 16:45:10',
      },
    ],
    fundUsageHistory: [
      {
        id: '1',
        timestamp: '2024-03-16 10:20:15',
        amount: '3.2 ETH',
        recipient: '0x8F3a54D092Ad2C4D6729c4B7E73189C34E12F14B',
        reason: 'Platform development - Smart contract implementation',
      },
      {
        id: '2',
        timestamp: '2024-03-15 15:45:30',
        amount: '2.5 ETH',
        recipient: '0x5E2d35Cc6634C0532925a3b844Bc454e4438f44f',
        reason: 'UI/UX design and frontend development',
      },
      {
        id: '3',
        timestamp: '2024-03-14 12:10:00',
        amount: '1.8 ETH',
        recipient: '0x3A1234567890ABCDEF0123456789ABCDEF012345',
        reason: 'Content creation and educational material development',
      },
    ],
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-[400px] object-cover rounded-xl mb-6"
          />
          
          <div className="card mb-6">
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <p className="text-gray-400 leading-relaxed">{campaign.description}</p>
          </div>

          <div className="space-y-6">
            {/* Funding History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <ArrowDownRight className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding History</h2>
              </div>
              <div className="space-y-4">
                {campaign.fundingHistory.map((fund) => (
                  <div
                    key={fund.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-300">{fund.address}</p>
                        <p className="text-xs text-gray-500">{fund.timestamp}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-500">{fund.amount}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fund Usage History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <ArrowUpRight className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Fund Usage History</h2>
              </div>
              <div className="space-y-4">
                {campaign.fundUsageHistory.map((usage) => (
                  <div
                    key={usage.id}
                    className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-red-500/20 text-red-500">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-300">{usage.recipient}</p>
                          <p className="text-xs text-gray-500">{usage.timestamp}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-500">{usage.amount}</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 pl-14">{usage.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary-500" />
                  <span>Goal</span>
                </div>
                <span className="font-semibold">{campaign.goal} ETH</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary-500" />
                  <span>Raised</span>
                </div>
                <span className="font-semibold">{campaign.raised} ETH</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span>Backers</span>
                </div>
                <span className="font-semibold">{campaign.backers}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span>Days Left</span>
                </div>
                <span className="font-semibold">{campaign.daysLeft}</span>
              </div>
            </div>

            <button className="w-full btn-primary mt-6">
              Back this Project
            </button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Created by</h3>
            <p className="text-gray-400">{campaign.creator}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignDetails;