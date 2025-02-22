import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  id,
  title,
  description,
  goal,
  raised,
  image,
}) => {
  const navigate = useNavigate();
  const progress = (raised / goal) * 100;

  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Raised</p>
          <p className="text-lg font-semibold">{raised} ETH</p>
        </div>
        <button
          onClick={() => navigate(`/campaign/${id}`)}
          className="btn-primary flex items-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default CampaignCard;