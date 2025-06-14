import React, { useEffect, useState } from 'react';

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winAmount: string;
  roundId: string;
  transactionHash?: string;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  onClose,
  winAmount,
  roundId,
  transactionHash
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowConfetti(false);
    onClose();
  };

  const handleShare = () => {
    const shareText = `🎉 I just won ${winAmount} ETH on ChainLuck! 🍀 #ChainLuck #Web3 #Lucky`;
    if (navigator.share) {
      navigator.share({
        title: 'ChainLuck Winner!',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][
                    Math.floor(Math.random() * 5)
                  ]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-3xl animate-bounce">🎉</div>
                <div className="text-white font-bold text-lg">Congratulations!</div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-pulse">🍀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You're a Winner!
              </h2>
              <p className="text-gray-600">
                Lucky you! You've won the ChainLuck jackpot!
              </p>
            </div>

            {/* Prize Amount */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {winAmount} ETH
              </div>
              <div className="text-sm text-green-700">
                Prize from Round #{roundId}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Round ID</span>
                <span className="font-semibold">#{roundId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Prize Amount</span>
                <span className="font-semibold">{winAmount} ETH</span>
              </div>
              {transactionHash && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Transaction</span>
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-32"
                  >
                    {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full btn-success"
              >
                🎊 Share Your Win
              </button>
              <button
                onClick={handleClose}
                className="w-full btn-secondary"
              >
                Continue Playing
              </button>
            </div>

            {/* Fun Messages */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800 font-medium mb-1">
                🚀 Pro Tip
              </div>
              <div className="text-sm text-blue-700">
                Keep using dApps to enter more rounds and win again!
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                Powered by ChainLuck
              </div>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>🔒 Decentralized</span>
                <span>⚡ Instant</span>
                <span>🎯 Fair</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal; 