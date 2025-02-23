import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getContract } from 'thirdweb';
import { client } from '../client';
import { baseSepolia } from 'thirdweb/chains';
import { MediaRenderer, useReadContract } from 'thirdweb/react';
import { resolveScheme } from 'thirdweb/storage';

interface CampaignCardProps {
  campaignAddress: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaignAddress
}) => {
  const navigate = useNavigate();

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: campaignAddress,
    });

    // Get Campaign Name
    const {data: campaignName} = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: []
    });

    // Get Campaign Description
    const {data: campaignDescription} = useReadContract({
        contract: contract,
        method: "function description() view returns (string)",
        params: []
    });

    // Goal amount of the campaign
    const { data: goal, isLoading: isLoadingGoal } = useReadContract({
        contract: contract,
        method: "function goal() view returns (uint256)",
        params: [],
    });

    // Total funded balance of the campaign
    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: "function getContractBalance() view returns (uint256)",
        params: [],
    });

    // Calulate the total funded balance percentage
    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

    // If balance is greater than or equal to goal, percentage should be 100
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    const { data: imgHash, isPending: imgHashPending } = useReadContract({
            contract,
            method:
              "function getImageIPFSHash() view returns (string)",
            params: [],
          });
    
          console.log(imgHash);
    
          const [imageUrl, setImageUrl] = useState<string | null>(null);
    
          useEffect(() => {
            const resolveImageUrl = async () => {
                if (imgHash && client) {
                    try {
                        const resolvedUrl = await resolveScheme({ client, uri: imgHash }); // ✅ Correct usage
                        setImageUrl(resolvedUrl);
                    } catch (error) {
                        console.error("Error resolving IPFS URL:", error);
                    }
                }
            };
            resolveImageUrl();
        }, [imgHash, client]);

        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(168,85,247,0.6)] hover:shadow-pink-500/70"
          >
            <div className="h-48 mb-4 rounded-lg overflow-hidden">
              {imageUrl ? (
                <MediaRenderer 
                  client={client} 
                  src={imageUrl} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-400">Loading image...</p>
                </div>
              )}
            </div>
        
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{campaignName}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2">{campaignDescription}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(balancePercentage)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${balancePercentage.toString()}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Raised</p>
                  <p className="text-lg font-semibold">{totalGoal} ETH</p>
                </div>
                <button
                  onClick={() => navigate(`/campaign/${campaignAddress}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );
}

export default CampaignCard;