import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionHistory = () => {
  // Mock data - replace with actual transactions
  const transactions = [
    {
      id: '1',
      type: 'sent',
      amount: '0.5 ETH',
      to: '0x1234...5678',
      date: '2024-03-10',
      status: 'completed',
    },
    {
      id: '2',
      type: 'received',
      amount: '1.2 ETH',
      from: '0x8765...4321',
      date: '2024-03-09',
      status: 'completed',
    },
    // Add more transactions as needed
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-gray-400">Track your contributions and rewards</p>
      </motion.div>

      <div className="card">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 ${
              index !== transactions.length - 1 ? 'border-b border-gray-800' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                tx.type === 'sent' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
              }`}>
                {tx.type === 'sent' ? <ArrowUpRight /> : <ArrowDownRight />}
              </div>
              <div>
                <p className="font-medium">{tx.type === 'sent' ? 'Sent to' : 'Received from'}</p>
                <p className="text-sm text-gray-400">
                  {tx.type === 'sent' ? tx.to : tx.from}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{tx.amount}</p>
              <p className="text-sm text-gray-400">{tx.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;