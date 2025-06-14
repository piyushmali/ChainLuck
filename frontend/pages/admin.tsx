import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VaultStatus from '../components/VaultStatus';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const ADMIN_ABI = [
  "function owner() external view returns (address)",
  "function deposit() external payable",
  "function drawWinners() external",
  "function resetRound() external",
  "function setWinnersPerDraw(uint256 _winnersPerDraw) external",
  "function setMinParticipants(uint256 _minParticipants) external",
  "function emergencyWithdraw() external",
  "function getCurrentRoundInfo() external view returns (uint256 roundId, uint256 participantCount, uint256 prizePool, bool isActive)",
  "function winnersPerDraw() external view returns (uint256)",
  "function minParticipants() external view returns (uint256)",
  "function getRoundParticipants(uint256 roundId) external view returns (address[] memory)",
  "function getRoundWinners(uint256 roundId) external view returns (address[] memory)",
  "event Deposited(address indexed depositor, uint256 amount, uint256 roundId)",
  "event WinnersDrawn(uint256 roundId, address[] winners, uint256 prizePerWinner)",
  "event RoundReset(uint256 oldRoundId, uint256 newRoundId)",
  "event ConfigUpdated(uint256 winnersPerDraw, uint256 minParticipants)"
];

export default function Admin() {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [fundAmount, setFundAmount] = useState('');
  const [newWinnersPerDraw, setNewWinnersPerDraw] = useState('');
  const [newMinParticipants, setNewMinParticipants] = useState('');

  // Data states
  const [participants, setParticipants] = useState<string[]>([]);
  const [recentWinners, setRecentWinners] = useState<string[]>([]);
  const [currentRoundId, setCurrentRoundId] = useState('1');

  // Connect wallet and check ownership
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
        
        // Check if user is owner
        await checkOwnership(web3Provider, accounts[0]);
        
        // Load admin data
        await loadAdminData(web3Provider);
      } else {
        setError('Please install MetaMask or another Web3 wallet');
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const checkOwnership = async (web3Provider: any, userAccount: string) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, web3Provider);
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === userAccount.toLowerCase());
    } catch (err) {
      console.error('Error checking ownership:', err);
    }
  };

  const loadAdminData = async (web3Provider: any) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, web3Provider);
      
      // Get current round info
      const [roundId, participantCount, prizePool, isActive] = await contract.getCurrentRoundInfo();
      setCurrentRoundId(roundId.toString());
      
      // Get current participants
      const currentParticipants = await contract.getRoundParticipants(roundId);
      setParticipants(currentParticipants);
      
      // Get winners from previous round if available
      if (roundId > 1) {
        try {
          const previousWinners = await contract.getRoundWinners(roundId - 1n);
          setRecentWinners(previousWinners);
        } catch (err) {
          console.log('No previous winners available');
        }
      }
      
      // Get current config
      const [winnersPerDraw, minParticipants] = await Promise.all([
        contract.winnersPerDraw(),
        contract.minParticipants()
      ]);
      
      setNewWinnersPerDraw(winnersPerDraw.toString());
      setNewMinParticipants(minParticipants.toString());
      
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  // Fund vault
  const fundVault = async () => {
    if (!signer || !fundAmount) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, signer);
      const tx = await contract.deposit({
        value: ethers.parseEther(fundAmount)
      });
      
      await tx.wait();
      setSuccess(`Successfully funded vault with ${fundAmount} ETH`);
      setFundAmount('');
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err: any) {
      console.error('Error funding vault:', err);
      setError(err.message || 'Failed to fund vault');
    } finally {
      setLoading(false);
    }
  };

  // Draw winners manually
  const drawWinners = async () => {
    if (!signer) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, signer);
      const tx = await contract.drawWinners();
      
      await tx.wait();
      setSuccess('Winners drawn successfully!');
      setRefreshTrigger(prev => prev + 1);
      
      // Reload data after draw
      setTimeout(() => {
        loadAdminData(provider);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error drawing winners:', err);
      setError(err.message || 'Failed to draw winners');
    } finally {
      setLoading(false);
    }
  };

  // Reset round
  const resetRound = async () => {
    if (!signer) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, signer);
      const tx = await contract.resetRound();
      
      await tx.wait();
      setSuccess('Round reset successfully!');
      setRefreshTrigger(prev => prev + 1);
      
      // Reload data after reset
      setTimeout(() => {
        loadAdminData(provider);
      }, 1000);
      
    } catch (err: any) {
      console.error('Error resetting round:', err);
      setError(err.message || 'Failed to reset round');
    } finally {
      setLoading(false);
    }
  };

  // Update configuration
  const updateConfig = async () => {
    if (!signer || !newWinnersPerDraw || !newMinParticipants) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, signer);
      
      // Update both parameters
      const tx1 = await contract.setWinnersPerDraw(newWinnersPerDraw);
      await tx1.wait();
      
      const tx2 = await contract.setMinParticipants(newMinParticipants);
      await tx2.wait();
      
      setSuccess('Configuration updated successfully!');
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err: any) {
      console.error('Error updating config:', err);
      setError(err.message || 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  // Emergency withdraw
  const emergencyWithdraw = async () => {
    if (!signer || !confirm('Are you sure you want to withdraw all funds? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ADMIN_ABI, signer);
      const tx = await contract.emergencyWithdraw();
      
      await tx.wait();
      setSuccess('Emergency withdrawal completed!');
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err: any) {
      console.error('Error in emergency withdrawal:', err);
      setError(err.message || 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && provider) {
      loadAdminData(provider);
    }
  }, [isConnected, provider, refreshTrigger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔧</div>
              <h1 className="text-2xl font-bold gradient-text">ChainLuck Admin</h1>
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Admin Only
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isOwner ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isOwner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isOwner ? 'Owner' : 'Not Owner'}
                  </span>
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
        {/* Access Control */}
        {!isConnected ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-8">Please connect your wallet to access the admin dashboard.</p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : !isOwner ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Only the contract owner can access this admin dashboard.</p>
            <p className="text-sm text-gray-500">Connected as: {account}</p>
          </div>
        ) : (
          <>
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800">{success}</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Vault Status */}
              <VaultStatus 
                provider={provider}
                contractAddress={CONTRACT_ADDRESS}
                refreshTrigger={refreshTrigger}
              />

              {/* Quick Actions */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Quick Actions</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={drawWinners}
                    disabled={loading}
                    className="w-full btn-success"
                  >
                    🎲 Draw Winners
                  </button>
                  
                  <button
                    onClick={resetRound}
                    disabled={loading}
                    className="w-full btn-warning"
                  >
                    🔄 Reset Round
                  </button>
                  
                  <button
                    onClick={emergencyWithdraw}
                    disabled={loading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg"
                  >
                    ⚠️ Emergency Withdraw
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Fund Vault */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">💰 Fund Vault</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.1"
                    />
                  </div>
                  <button
                    onClick={fundVault}
                    disabled={loading || !fundAmount}
                    className="w-full btn-primary"
                  >
                    Fund Vault
                  </button>
                </div>
              </div>

              {/* Configuration */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">⚙️ Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Winners Per Draw
                    </label>
                    <input
                      type="number"
                      value={newWinnersPerDraw}
                      onChange={(e) => setNewWinnersPerDraw(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Participants
                    </label>
                    <input
                      type="number"
                      value={newMinParticipants}
                      onChange={(e) => setNewMinParticipants(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={updateConfig}
                    disabled={loading}
                    className="w-full btn-primary"
                  >
                    Update Config
                  </button>
                </div>
              </div>
            </div>

            {/* Participants and Winners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Participants */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">👥 Current Participants</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Round #{currentRoundId} • {participants.length} participants
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="font-mono text-sm">
                          {participant.slice(0, 8)}...{participant.slice(-8)}
                        </span>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No participants yet
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Winners */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">🏆 Recent Winners</h3>
                <div className="text-sm text-gray-600 mb-4">
                  From Round #{parseInt(currentRoundId) - 1}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentWinners.length > 0 ? (
                    recentWinners.map((winner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                      >
                        <span className="font-mono text-sm">
                          {winner.slice(0, 8)}...{winner.slice(-8)}
                        </span>
                        <span className="text-xs text-green-600">🏆 Winner</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No recent winners
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
} 