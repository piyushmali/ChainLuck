import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import { formatCurrency, formatAddress } from '../utils'
import { Trophy, X } from 'lucide-react'

export default function WinnerModal() {
  const { showWinnerModal, winners, hideWinnerModal } = useAppStore()

  return (
    <AnimatePresence>
      {showWinnerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={hideWinnerModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                🎉 Winners!
              </h2>
              <button
                onClick={hideWinnerModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {winners.map((winner, index) => (
                <motion.div
                  key={winner.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="font-bold text-lg mb-2">
                      Winner #{index + 1}
                    </h3>
                    <p className="text-yellow-400 font-mono text-lg mb-2">
                      {formatCurrency(winner.amount)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatAddress(winner.address)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={hideWinnerModal}
                className="btn-primary px-6 py-2"
              >
                Awesome! 🎊
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 