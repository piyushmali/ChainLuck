import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VaultStatus from '../components/VaultStatus';
import WinnerModal from '../components/WinnerModal';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CHAINLUCK_ABI = [
  "function enter(address user) external",
  "function hasUserEnteredCurrent(address user) external view returns (bool)",
  "function getCurrentRoundInfo() external view returns (uint256 roundId, uint256 participantCount, uint256 prizePool, bool isActive)",
  "event UserEntered(address indexed user, uint256 roundId)",
  "event WinnersDrawn(uint256 roundId, address[] winners, uint256 prizePerWinner)",
  "event PrizeDistributed(address indexed winner, uint256 amount, uint256 roundId)"
];

interface WinnerData {
  winAmount: string;
  roundId: string;
  transactionHash: string;
}

export default function Home() {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [error, setError] = useState<string>('');

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await web3Provider.send('eth_requestAccounts', []);
        const userSigner = await web3Provider.getSigner();
        
        setProvider(web3Provider);
        setSigner(userSigner);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Check if user has already entered current round
        await checkUserEntryStatus(web3Provider, accounts[0]);
        
        // Listen for winner events
        await setupEventListeners(web3Provider, accounts[0]);
      } else {
        setError('Please install MetaMask or another Web3 wallet');
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  // Check if user has entered current round
  const checkUserEntryStatus = async (web3Provider: any, userAccount: string) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINLUCK_ABI, web3Provider);
      const entered = await contract.hasUserEnteredCurrent(userAccount);
      setHasEntered(entered);
    } catch (err) {
      console.error('Error checking entry status:', err);
    }
  };

  // Setup event listeners for wins
  const setupEventListeners = async (web3Provider: any, userAccount: string) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINLUCK_ABI, web3Provider);
      
      // Listen for user wins
      const winFilter = contract.filters.PrizeDistributed(userAccount);
      contract.on(winFilter, (winner, amount, roundId, event) => {
        setWinnerData({
          winAmount: ethers.formatEther(amount),
          roundId: roundId.toString(),
          transactionHash: event.transactionHash
        });
        setShowWinnerModal(true);
      });

      // Listen for user entries
      const entryFilter = contract.filters.UserEntered(userAccount);
      contract.on(entryFilter, () => {
        setHasEntered(true);
        setRefreshTrigger(prev => prev + 1);
      });

      // Listen for winner draws to refresh UI
      const drawFilter = contract.filters.WinnersDrawn();
      contract.on(drawFilter, () => {
        setRefreshTrigger(prev => prev + 1);
        // Reset entry status for new round
        setTimeout(() => {
          checkUserEntryStatus(web3Provider, userAccount);
        }, 2000);
      });

    } catch (err) {
      console.error('Error setting up event listeners:', err);
    }
  };

  // Enter jackpot
  const enterJackpot = async () => {
    if (!signer || !account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsEntering(true);
      setError('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINLUCK_ABI, signer);
      const tx = await contract.enter(account);
      
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      
      setHasEntered(true);
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err: any) {
      console.error('Error entering jackpot:', err);
      if (err.message.includes('Already entered this round')) {
        setError('You have already entered this round');
        setHasEntered(true);
      } else {
        setError(err.message || 'Failed to enter jackpot');
      }
    } finally {
      setIsEntering(false);
    }
  };

  // Simulate dApp action (for demo purposes)
  const simulateAction = async (actionType: string) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    // Show action simulation
    const actions = {
      swap: '🔄 Swapping tokens...',
      mint: '🎨 Minting NFT...',
      vote: '🗳️ Voting on proposal...',
      stake: '💰 Staking tokens...'
    };

    setError(`${actions[actionType as keyof typeof actions]} Action completed! Now entering jackpot...`);
    
    // Wait a moment for effect, then enter jackpot
    setTimeout(() => {
      setError('');
      enterJackpot();
    }, 2000);
  };

  useEffect(() => {
    // Auto-connect if previously connected
    if (typeof window !== 'undefined' && (window as any).ethereum && localStorage.getItem('chainluck_connected')) {
      connectWallet();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🍀</div>
              <h1 className="text-2xl font-bold gradient-text">ChainLuck</h1>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Beta
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn-primary"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Turn Every 
            <span className="gradient-text"> dApp Action </span>
            Into Lucky Rewards
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ChainLuck automatically enters you into cashback jackpots when you use your favorite dApps. 
            No extra cost, just pure luck! 🎯
          </p>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="btn-primary text-lg px-8 py-4"
            >
              🚀 Get Started
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-lg text-green-600 font-semibold">
                ✅ Wallet Connected - Ready to Win!
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Vault Status */}
          <div>
            <VaultStatus 
              provider={provider}
              contractAddress={CONTRACT_ADDRESS}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Action Panel */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Simulate dApp Actions</h2>
            <p className="text-gray-600 mb-6">
              In a real integration, these actions would be triggered automatically when you use dApps. 
              For this demo, click any action to simulate entering the jackpot!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => simulateAction('swap')}
                disabled={!isConnected || isEntering}
                className="btn-primary h-20 flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-2xl">🔄</div>
                <div className="text-sm">Token Swap</div>
              </button>
              
              <button
                onClick={() => simulateAction('mint')}
                disabled={!isConnected || isEntering}
                className="btn-primary h-20 flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-2xl">🎨</div>
                <div className="text-sm">Mint NFT</div>
              </button>
              
              <button
                onClick={() => simulateAction('vote')}
                disabled={!isConnected || isEntering}
                className="btn-primary h-20 flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-2xl">🗳️</div>
                <div className="text-sm">DAO Vote</div>
              </button>
              
              <button
                onClick={() => simulateAction('stake')}
                disabled={!isConnected || isEntering}
                className="btn-primary h-20 flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-2xl">💰</div>
                <div className="text-sm">Stake Tokens</div>
              </button>
            </div>

            {/* Direct Entry */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Direct Entry</h3>
              <button
                onClick={enterJackpot}
                disabled={!isConnected || hasEntered || isEntering}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  hasEntered 
                    ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                    : isEntering
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'btn-success'
                }`}
              >
                {isEntering ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="spinner w-4 h-4"></div>
                    <span>Entering...</span>
                  </div>
                ) : hasEntered ? (
                  '✅ Already Entered This Round'
                ) : (
                  '🍀 Enter Jackpot Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="card p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">How ChainLuck Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Use dApps</h3>
              <p className="text-gray-600">
                Perform normal actions like swapping, staking, or voting in your favorite dApps
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-semibold mb-2">Auto-Entry</h3>
              <p className="text-gray-600">
                ChainLuck automatically enters you into the current jackpot round - no extra steps!
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Win Rewards</h3>
              <p className="text-gray-600">
                When the round completes, lucky winners receive ETH rewards directly to their wallet
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {showWinnerModal && winnerData && (
        <WinnerModal
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          winAmount={winnerData.winAmount}
          roundId={winnerData.roundId}
          transactionHash={winnerData.transactionHash}
        />
      )}
    </div>
  );
} 