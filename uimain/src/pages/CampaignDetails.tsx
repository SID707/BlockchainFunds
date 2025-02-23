import React, { ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Target, Wallet, ArrowUpRight, ArrowDownRight, Pencil } from 'lucide-react';
import { File, Check, X } from 'lucide-react';
import { useState } from 'react';
import { MediaRenderer, TransactionButton, useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '../client';
import { baseSepolia } from 'thirdweb/chains';
import { resolveScheme, upload } from 'thirdweb/storage';

const CampaignDetails = () => {

  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  console.log(campaignAddress);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fundingHistory, setFundingHistory] = useState<{ backer: string; amount: number; timestamp: number }[]>([]);


  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress as string,
  });

  // Name of the campaign
  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Description of the campaign
  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: []
  });

  // Campaign deadline
  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });
  // Convert deadline to a date
  const deadlineDate = new Date(parseInt(deadline?.toString() as string) * 1000);
  // Check if deadline has passed
  const hasDeadlinePassed = deadlineDate < new Date();

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

  // // Get tiers for the campaign
  // const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
  //   contract: contract,
  //   method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
  //   params: [],
  // });

  // Get owner of the campaign
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Get status of the campaign
  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: []
  });

  //getbackers - returns all the backers addresses of the campaign
  const { data: backers, isPending: isBackersLoading } = useReadContract({
    contract: contract,
    method: "function getBackers() view returns (address[])",
    params: [],
  });

  console.log(backers);

  //gets the factory address
  const { data: factory } = useReadContract({
    contract,
    method: "function factory() view returns (address)",
    params: [],
  });




  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const { mutate: sendTransaction } = useSendTransaction();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0] as File);
    }
  };

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

      return uris;  // Ensure this is a valid IPFS URI
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      throw new Error("Failed to upload to IPFS");
    }
  };

  const handleWithdraw = async () => {

    if (!withdrawAmount || !recipient || !withdrawReason || !documentFile) {
      alert("All fields including document upload are required");
      return;
    }

    try {

      const ipfsUri = await uploadToThirdwebIPFS(documentFile);

      if (!ipfsUri) {
        throw new Error("IPFS upload failed, URI is empty.");
      }

      if (BigInt(withdrawAmount) <= 0) {
        alert("Withdrawal amount must be greater than 0");
        return;
      }

      console.log("IPFS URI for deployment:", ipfsUri);

      const transaction = prepareContractCall({
        contract,
        method: "function withdraw(uint256 _amount, address _recipient, string _reason, string _documentIPFSHash)",
        params: [BigInt(withdrawAmount), recipient, withdrawReason, ipfsUri],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          alert("Withdrawal successful!");
          setIsWithdrawModalOpen(false);
        },
        onError: (error) => alert(`Error: ${error.message}`),
      });
    } catch (error) {
      console.error("IPFS Upload or Transaction Error: ", error);
    } finally {
      setIsWithdrawModalOpen(false);
    }
  };

  // const onClick = () => {
  //     const transaction = prepareContractCall({
  //     contract,
  //     method:
  //         "function withdraw(uint256 _amount, address _recipient, string _reason)",
  //     params: [_amount, _recipient, _reason],
  //     });
  //     sendTransaction(transaction);
  // };



  const [amount, setAmount] = useState<string>("");

  async function fetchBaseSepoliaTransactions() {
    const basescanApiKey = import.meta.env.VITE_TEMPLETE_BASESCAN_API_KEY; // BaseScan API Key

    // const url = `https://api.basescan.org/api?module=logs&action=getLogs&address=${walletAddress}&fromBlock=1844947&toBlock=1845947&page=1&offset=1000&apikey=${basescanApiKey}`;
    const url = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${campaignAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${basescanApiKey}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "1") {
        throw new Error(`API Error: ${data.message}`);
      }

      // ✅ Transform API response to match fundingHistory structure
      const transformedData = data.result.map((tx: any) => ({
        backer: tx.from,
        amount: Number(tx.value), // Convert Wei to ETH
        timestamp: Number(tx.timeStamp) * 1000, // Convert to milliseconds for JS Date
      }));

      setFundingHistory(transformedData);

      console.log(data.result); // Transactions
    } catch (error) {
      console.error("Error fetching transactions:");
    }
  }



  useEffect(() => {
    // if (!backers || backers.length === 0) {
    //     console.log("No backers found");
    //     return;
    // }
    // console.log("Backers:", backers);

    // const fetchFundingHistory = async () => {
    //     // try {
    //     //     const history: { backer: string; amount: number; timestamp: number }[] = [];

    //     //     await Promise.all(
    //     //         backers.map(async (backer) => {
    //     //             console.log(`Fetching contributions for ${backer}`);

    //     //             //Fetch backer's contribution history
    //     //             // const { data: contributions } = useReadContract({
    //     //             //     contract: contract,
    //     //             //     method: "function getBackerContributionHistory(address) view returns (uint256[], uint256[])",
    //     //             //     params: [backer],
    //     //             // });

    //     //             // const contributions = fetchBaseSepoliaTransactions(backer);

    //     //             console.log("Contributions:", contributions);

    //     //             // if (contributions) {
    //     //             //     const [amounts, timestamps] = contributions;
    //     //             //     amounts.forEach((amount: bigint, index: number) => {
    //     //             //         history.push({
    //     //             //             backer,
    //     //             //             amount: Number(amount), // Convert BigInt to number
    //     //             //             timestamp: Number(timestamps[index]), // Convert BigInt to number
    //     //             //         });
    //     //             //     });
    //     //             // }
    //     //         })
    //     //     );

    //     //     // Sort by timestamp (newest first)
    //     //     history.sort((a, b) => b.timestamp - a.timestamp);
    //     //     console.log("Final Funding History:", history);
    //     //     setFundingHistory(history);
    //     // } catch (error) {
    //     //     console.error("Error fetching funding history:", error);
    //     // }/


    // };

    // fetchFundingHistory();

    // fetchBaseSepoliaTransactions();
    const interval = setInterval(fetchBaseSepoliaTransactions, 2000);
    return () => clearInterval(interval);
  }, [backers]);


  const { data: fundUsage, isPending: usagePending } = useReadContract({
    contract,
    method:
      "function getFundUsageHistory() view returns ((uint256 index, address recipient, uint256 amount, string reason, string documentIPFSHash, uint256 timestamp, bool approved)[])",
    params: [],
  });

  console.log(fundUsage);

  const { data: category, isPending: categoryPending } = useReadContract({
    contract,
    method: "function category() view returns (string)",
    params: [],
  });

  console.log(category);

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

  console.log("Resolved Image URL:", imageUrl);
  console.log("Category:", category);

  // const [withdrawalIndex, setwithdrawalIndex] = useState<bigint>(BigInt(0));
  // const [approve, setApprove] = useState<boolean>(false);

  const Vote = (withdrawalIndex: bigint, approve: boolean) => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function voteForWithdrawal(uint256 _withdrawalIndex, bool _approve)",
      params: [withdrawalIndex, approve],
    });
    sendTransaction(transaction);
  };

  const { data: backerTokens, isPending: backerTokensPending } = useReadContract({
    contract,
    method:
      "function getBackersWithTokens() view returns (address[], uint256[])",
    params: [],
  });

  console.log(backerTokens);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          {imageUrl ? (
            <MediaRenderer
              client={client}
              src={imageUrl}
              className="w-full mb-8 max-w-2xl h-80 object-cover rounded-md shadow-md"
            />
          ) : (
            <p className="text-gray-400">Loading image...</p>
          )}

          <div className="card mb-6">
            <h1 className="text-3xl font-bold mb-4">{name}</h1>
            <p className="text-gray-400 leading-relaxed">{description}</p>
          </div>

          <div className="space-y-6">
            {/* Funding History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <ArrowDownRight className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-purple-300">Funding History</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {fundingHistory.length === 0 ? (
                  <p className="text-gray-400">No contributions yet.</p>
                ) : (
                  <div className="space-y-4">
                    {fundingHistory.map((entry, index) =>
                      entry.amount > 0 && (
                        <div
                          key={index}
                          className="p-4 bg-gray-700 rounded-lg border border-purple-600 hover:bg-gray-600/70 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
                              <ArrowDownRight className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-purple-400">
                                <span className="text-gray-400">Wallet: </span>
                                {entry.backer}
                              </p>
                              <p className="text-sm text-purple-300">
                                <span className="text-gray-400">Amount: </span>
                                {entry.amount} ETH
                              </p>
                              <p className="text-xs text-gray-400">
                                <span className="text-gray-500">Time: </span>
                                {new Date(entry.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Fund Usage History Section */}
            {/* // Replace the existing fund usage section with this code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <ArrowUpRight className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Fund Usage</h2>
              </div>
              <div className="space-y-4">
                {usagePending ? (
                  <p className="text-gray-400">Loading...</p>
                ) : fundUsage && fundUsage.length > 0 ? (
                  <ul className="space-y-4">
                    {[...fundUsage]
                      .slice()
                      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                      .map((entry, index) => (
                        <li
                          key={index}
                          className="p-4 bg-gray-800 rounded-xl shadow-md border border-purple-600"
                        >
                          <p className="text-purple-300 text-sm">
                            {new Date(Number(entry.timestamp) * 1000).toLocaleString()}
                          </p>
                          <p className="text-lg font-medium">Amount: {entry.amount.toString()} ETH</p>
                          <p className="text-sm text-gray-400">
                            Recipient:{" "}
                            <span className="text-purple-300 break-all">{entry.recipient}</span>
                          </p>
                          <p className="text-sm text-gray-400">Reason: {entry.reason}</p>
                          <div className="mt-4">
                            <MediaRenderer client={client} src={entry.documentIPFSHash} />
                          </div>
                          <div className="mt-4">
                            {!entry.approved ? (
                              <div className="flex gap-2">
                                <button
                                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
                                  onClick={() => Vote(entry.index, true)}
                                >
                                  Vote For
                                </button>
                                <button
                                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
                                  onClick={() => Vote(entry.index, false)}
                                >
                                  Vote Against
                                </button>
                              </div>
                            ) : (
                              <span className="text-green-500 font-semibold">
                                Fund Approved by Funders
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No fund usage history available</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="card">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(balancePercentage)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-600"
                  style={{ width: `${balancePercentage?.toString()}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary-500" />
                  <span>Goal</span>
                </div>
                <span className="font-semibold">{totalGoal} ETH</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary-500" />
                  <span>Raised</span>
                </div>
                <span className="font-semibold">{totalBalance} ETH</span>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span>Backers</span>
                </div>
                <span className="font-semibold">{campaign.backers}</span>
              </div> */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span>Days Left</span>
                </div>
                {!isLoadingDeadline && (
                  <p className="font-semibold">{deadlineDate.toDateString()}</p>
                )}
              </div>
            </div>

            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function fundCustomAmount(uint256 tokensToRedeem) payable",
                  params: [BigInt(0)],
                  value: BigInt(amount),
                })
              }
              onError={(error: { message: any; }) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={() => alert("Funded successfully!")}
              className="w-full btn-primary mt-6"
            >
              Fund
            </TransactionButton>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Created by</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 1
                ? 'bg-green-500/20 text-green-500'
                : 'bg-blue-500/20 text-blue-500'
                }`}>
                {status === 0 ? " Active" :
                  status === 1 ? " Successful" :
                    status === 2 ? " Failed" : "Unknown"}
              </span>
            </div>

            <p className="text-gray-400 mb-4">{owner}</p>

            <div className="grid grid-cols-2 gap-4">
              {owner === account?.address && (<button
                className="btn-primary flex items-center justify-center gap-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="w-4 h-4" />
                {isEditing ? "Done" : "Edit"}
              </button>)}

              {owner === account?.address && status === 1 && (<button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => setIsWithdrawModalOpen(true)}
              >
                <Wallet className="w-4 h-4" />
                Withdraw
              </button>)}

              {isWithdrawModalOpen && (
                <>
                  {/* Background Overlay with Blur Effect */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
                    onClick={() => setIsWithdrawModalOpen(false)} // Click outside to close
                  ></div>

                  {/* Modal Container */}
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="w-1/2 bg-gray-900 p-6 rounded-md shadow-lg">
                      <h2 className="text-lg font-semibold text-white mb-4">
                        Withdraw Funds
                      </h2>

                      <label className="text-white">Amount:</label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-purple-500 rounded-md mb-4"
                      />

                      <label className="text-white">Recipient Wallet:</label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-purple-500 rounded-md mb-4"
                      />

                      <label className="text-white">Reason:</label>
                      <input
                        type="text"
                        value={withdrawReason}
                        onChange={(e) => setWithdrawReason(e.target.value)}
                        placeholder="Enter reason"
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-purple-500 rounded-md mb-4"
                      />

                      <label className="text-white">Upload Document:</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-purple-500 rounded-md mb-4"
                      />

                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                          onClick={() => setIsWithdrawModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                          onClick={handleWithdraw}
                        >
                          Confirm Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignDetails;