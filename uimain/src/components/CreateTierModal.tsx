// src/components/CreateTierModal.tsx
import { useState } from 'react';
import { type ThirdwebContract } from 'thirdweb';
import { TransactionButton } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateTierModal = ({ setIsModalOpen, contract }: CreateTierModalProps) => {
  const [tierName, setTierName] = useState<string>("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md z-50">
      <div className="w-1/2 bg-gray-900 p-6 rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-white">Create a Funding Tier</p>
          <button
            className="text-sm px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label className="text-white">Tier Name:</label>
          <input 
            type="text" 
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <label className="text-white">Tier Cost:</label>
          <input 
            type="number"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <TransactionButton
            transaction={() => prepareContractCall({
              contract: contract,
              method: "function addTier(string _name, uint256 _amount)",
              params: [tierName, tierAmount]
            })}
            onTransactionConfirmed={async () => {
              alert("Tier added successfully!");
              setIsModalOpen(false);
            }}
            onError={(error) => alert(`Error: ${error.message}`)}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};

export default CreateTierModal;