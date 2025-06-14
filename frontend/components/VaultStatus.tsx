import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface VaultStatusProps {
  provider: any;
  contractAddress: string;
  refreshTrigger?: number;
}

interface RoundInfo {
  roundId: string;
  participantCount: string;
  prizePool: string;
  isActive: boolean;
  prizePoolWei: string;
}

interface ConfigInfo {
  winnersPerDraw: string;
  minParticipants: string;
}

const VaultStatus: React.FC<VaultStatusProps> = ({ 
  provider, 
  contractAddress, 
  refreshTrigger = 0 
}) => {
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);
  const [config, setConfig] = useState<ConfigInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CHAINLUCK_ABI = [
    "function getCurrentRoundInfo() external view returns (uint256 roundId, uint256 participantCount, uint256 prizePool, bool isActive)",
    "function winnersPerDraw() external view returns (uint256)",
    "function minParticipants() external view returns (uint256)"
  ];

  const fetchVaultStatus = async () => {
    if (!provider || !contractAddress) return;

    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(contractAddress, CHAINLUCK_ABI, provider);
      
      // Fetch round info and config in parallel
      const [roundData, winnersPerDraw, minParticipants] = await Promise.all([
        contract.getCurrentRoundInfo(),
        contract.winnersPerDraw(),
        contract.minParticipants()
      ]);

      const [roundId, participantCount, prizePool, isActive] = roundData;

      setRoundInfo({
        roundId: roundId.toString(),
        participantCount: participantCount.toString(),
        prizePool: ethers.formatEther(prizePool),
        isActive,
        prizePoolWei: prizePool.toString()
      });

      setConfig({
        winnersPerDraw: winnersPerDraw.toString(),
        minParticipants: minParticipants.toString()
      });

    } catch (err: any) {
      console.error('Error fetching vault status:', err);
      setError(err.message || 'Failed to fetch vault status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultStatus();
  }, [provider, contractAddress, refreshTrigger]);

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 border-red-200 bg-red-50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Vault Status</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchVaultStatus}
          className="mt-3 btn-secondary text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!roundInfo || !config) {
    return (
      <div className="card p-6">
        <p className="text-gray-500">No vault data available</p>
      </div>
    );
  }

  const prizePerWinner = roundInfo.prizePool && config.winnersPerDraw
    ? (parseFloat(roundInfo.prizePool) / parseInt(config.winnersPerDraw)).toFixed(4)
    : '0';

  const participationProgress = parseInt(roundInfo.participantCount) / parseInt(config.minParticipants);
  const progressPercentage = Math.min(participationProgress * 100, 100);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Vault Status</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          roundInfo.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {roundInfo.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prize Pool */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {parseFloat(roundInfo.prizePool).toFixed(4)} ETH
          </div>
          <div className="text-sm text-gray-600">Total Prize Pool</div>
          <div className="text-xs text-gray-500 mt-1">
            {prizePerWinner} ETH per winner
          </div>
        </div>

        {/* Round Info */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Round ID</span>
            <span className="font-semibold">#{roundInfo.roundId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Participants</span>
            <span className="font-semibold">
              {roundInfo.participantCount} / {config.minParticipants}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Winners</span>
            <span className="font-semibold">{config.winnersPerDraw}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Participation Progress</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {parseInt(config.minParticipants) - parseInt(roundInfo.participantCount)} more participants needed for draw
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>
        <button 
          onClick={fetchVaultStatus}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default VaultStatus; 