import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CampaignCard from '../components/CampaignCard';
import { Plus } from 'lucide-react'; // Add this import
import { getContract } from 'thirdweb';
import { ThirdwebProvider, useActiveAccount, useReadContract } from 'thirdweb/react';
import { client } from '../client';
import { baseSepolia } from 'thirdweb/chains';
import { CROWDFUNDING_FACTORY } from '../constants/contracts';
import { upload } from 'thirdweb/storage';
import { deployPublishedContract } from 'thirdweb/deploys';

const MyCampaigns = () => {
  const account = useActiveAccount();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: CROWDFUNDING_FACTORY,
    });

    const { data: myCampaigns, isLoading: isLoadingMyCampaigns, refetch } = useReadContract({
        contract: contract,
        method: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
        params: [account?.address as string]
    });

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
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {!isLoadingMyCampaigns && (
                    myCampaigns && myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign) => (
                          <CampaignCard
                          key={campaign.campaignAddress}
                          campaignAddress={campaign.campaignAddress}
                        />
                        ))
                    ) : (
                        <p>No campaigns</p>
                    )
                )}

{isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    refetch={refetch}
                />
            )}
      </div>
    </div>
  );
};

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

const CreateCampaignModal = ({ setIsModalOpen, refetch }: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState(1);
  const [campaignDeadline, setCampaignDeadline] = useState(1);
  const [campaignCategory, setCampaignCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const uploadToThirdwebIPFS = async (file: File) => {
      try {
          const uris = await upload({
              client, // Ensure you have the Thirdweb client initialized
              files: [file],
          });

          console.log("Uploaded IPFS URI:", uris);
  
          if (!uris || uris.length === 0) {
              throw new Error("Failed to get a valid IPFS URI");
          }
  
          console.log("Uploaded IPFS URI:", uris); 
          return uris;  // Ensure this is a valid IPFS URI
      } catch (error) {
          console.error("IPFS Upload Error:", error);
          throw new Error("Failed to upload to IPFS");
      }
  };
  
  const handleDeployContract = async () => {
      if (!imageFile) {
          alert("Please upload an image.");
          return;
      }
  
      setIsDeploying(true);
      try {
          const ipfsUri = await uploadToThirdwebIPFS(imageFile);
  
          if (!ipfsUri) {
              throw new Error("IPFS upload failed, URI is empty.");
          }
  
          console.log("IPFS URI for deployment:", ipfsUri);
  
          const contractAddress = await deployPublishedContract({
              client: client,
              chain: baseSepolia,
              account: account!,
              contractId: "Crowdfunding",
              contractParams: {
                  _name: campaignName,
                  _description: campaignDescription,
                  _category: campaignCategory,
                  _imageIPFSHash: ipfsUri,  // Make sure the key matches the contract
                  _goal: campaignGoal,
                  _durationInDays: campaignDeadline,
              },
              publisher: "0x33BfB778CeA000188db66fBEE71E71dCDA65B2eA",
              version: "1.0.16",
          });
  
          alert("Campaign created successfully!");
      } catch (error) {
          console.error("Deployment error:", error);
      } finally {
          setIsDeploying(false);
          setIsModalOpen(false);
          refetch();
      }
  };
  

  return (
      <ThirdwebProvider>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
          <div className="w-1/2 bg-gray-800 p-6 rounded-md">
              <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-white">Create a Campaign</p>
                  <button className="text-sm px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
              <div className="flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg">
                  <label className="text-white">Campaign Name:</label>
                  <input type="text" placeholder="Campaign Name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md" />

                  <label className="text-white">Campaign Description:</label>
                  <textarea placeholder="Campaign Description" value={campaignDescription} onChange={(e) => setCampaignDescription(e.target.value)} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md" ></textarea>

                  <label className="text-white">Campaign Goal:</label>
                  <input type="number" placeholder="Goal" value={campaignGoal} onChange={(e) => setCampaignGoal(Number(e.target.value))} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md" />

                  <label className="text-white">{`Campaign Length (Days)`}</label>
                  <input type="number" placeholder="Duration (Days)" value={campaignDeadline} onChange={(e) => setCampaignDeadline(Number(e.target.value))} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md" />

                  <label className="text-white">Campaign Category:</label>
                  <input type="text" placeholder="Category" value={campaignCategory} onChange={(e) => setCampaignCategory(e.target.value)} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md" />

                  <label className="text-white">Campaign Thumbnail:</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mb-4" />
                  <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md" onClick={handleDeployContract}>{isDeploying ? "Creating..." : "Create Campaign"}</button>
              </div>
          </div>
      </div>
      </ThirdwebProvider>
  );
};


export default MyCampaigns;