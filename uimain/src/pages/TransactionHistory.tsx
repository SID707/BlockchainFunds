import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { client } from "../client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { CROWDFUNDING_FACTORY } from "../constants/contracts";

const basescanApiKey = import.meta.env.VITE_TEMPLETE_BASESCAN_API_KEY;

const TransactionHistory = () => {
  const account = useActiveAccount();
  const [fundingHistory, setFundingHistory] = useState<{ to: string; amount: number; timestamp: number; campaignName?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { data: campaigns, isLoading: isLoadingCampaigns } = useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });

  useEffect(() => {
    if (!account?.address || !campaigns) return;

    const fetchAllTransactions = async () => {
      let allTransactions: any[] = [];
      let page = 1;
      let hasMoreData = true;

      while (hasMoreData) {
        const url = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${account?.address}&startblock=0&endblock=99999999&sort=desc&page=${page}&offset=1000&apikey=${basescanApiKey}`;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const data = await response.json();
          if (data.status !== "1") throw new Error(`API Error: ${data.message}`);

          allTransactions = [...allTransactions, ...data.result];
          if (data.result.length < 1000) hasMoreData = false;
          else page++;
        } catch (err: any) {
          setError(err.message);
          hasMoreData = false;
        }
      }

      const campaignMap: Record<string, string> = {};
      campaigns.forEach((campaign: any) => {
        campaignMap[campaign.campaignAddress.toLowerCase()] = campaign.name;
      });

      const userTransactions = allTransactions
        .filter((tx: any) => tx.from.toLowerCase() === account?.address.toLowerCase())
        .map((tx: any) => ({
          to: tx.to,
          amount: Number(tx.value),
          timestamp: Number(tx.timeStamp) * 1000,
          campaignName: campaignMap[tx.to.toLowerCase()] || "Unknown Campaign",
        }));

      setFundingHistory(userTransactions);
      setLoading(false);
    };

    fetchAllTransactions();
  }, [account?.address, campaigns]);

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
        {loading && <p className="p-4">Loading transactions...</p>}
        {error && <p className="p-4 text-red-500">Error: {error}</p>}
        {!loading && !error && fundingHistory.length === 0 ? (
          <p className="p-4">No transactions found.</p>
        ) : (
          fundingHistory.map((tx, index) => 
            tx.amount > 0 && tx.campaignName !== "Unknown Campaign" && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 ${
                  index !== fundingHistory.length - 1 ? 'border-b border-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 text-green-500 p-2 rounded-full">
                    <ArrowUpRight />
                  </div>
                  <div>
                    <p className="font-medium">{tx.campaignName}</p>
                    <p className="text-sm text-gray-400">{tx.to}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{tx.amount} ETH</p>
                  <p className="text-sm text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;