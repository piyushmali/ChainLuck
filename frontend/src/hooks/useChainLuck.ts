import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CHAINLUCK_CONTRACT_ADDRESS } from '../config/wagmi'
import { CHAINLUCK_ABI } from '../config/contract'

export function useChainLuck() {
  const { address } = useAccount()

  const contractConfig = {
    address: CHAINLUCK_CONTRACT_ADDRESS,
    abi: CHAINLUCK_ABI,
  }

  // Read Functions
  const { data: roundInfo, isLoading: roundInfoLoading, refetch: refetchRoundInfo, error: roundInfoError } = useReadContract({
    ...contractConfig,
    functionName: 'getCurrentRoundInfo',
  })

  const { data: vaultBalance, isLoading: vaultBalanceLoading, refetch: refetchVaultBalance, error: vaultBalanceError } = useReadContract({
    ...contractConfig,
    functionName: 'vaultBalance',
  })

  const { data: hasEntered, isLoading: hasEnteredLoading, refetch: refetchHasEntered, error: hasEnteredError } = useReadContract({
    ...contractConfig,
    functionName: 'hasUserEnteredCurrent',
    args: address ? [address] : undefined,
  })

  const { data: ownerData, isLoading: isOwnerLoading } = useReadContract({
    ...contractConfig,
    functionName: 'owner',
  })

  const { data: winnersPerDraw } = useReadContract({
    ...contractConfig,
    functionName: 'winnersPerDraw',
  })

  const { data: minParticipants } = useReadContract({
    ...contractConfig,
    functionName: 'minParticipants',
  })

  // Write Functions
  const { 
    data: enterHash, 
    writeContract: enterLottery, 
    isPending: enterPending 
  } = useWriteContract()

  const { 
    data: depositHash, 
    writeContract: depositToVault, 
    isPending: depositPending 
  } = useWriteContract()

  const { 
    data: drawHash, 
    writeContract: drawWinners, 
    isPending: drawPending 
  } = useWriteContract()

  // Transaction receipts
  const { isLoading: enterConfirming, isSuccess: enterSuccess } = useWaitForTransactionReceipt({
    hash: enterHash,
  })

  const { isLoading: depositConfirming, isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  })

  const { isLoading: drawConfirming, isSuccess: drawSuccess } = useWaitForTransactionReceipt({
    hash: drawHash,
  })

  // Helper functions
  const enter = async () => {
    if (!address) return
    
    enterLottery({
      address: CHAINLUCK_CONTRACT_ADDRESS,
      abi: CHAINLUCK_ABI,
      functionName: 'enter',
      args: [address],
    })
  }

  const deposit = async (amount: string) => {
    depositToVault({
      address: CHAINLUCK_CONTRACT_ADDRESS,
      abi: CHAINLUCK_ABI,
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  const draw = async () => {
    drawWinners({
      address: CHAINLUCK_CONTRACT_ADDRESS,
      abi: CHAINLUCK_ABI,
      functionName: 'drawWinners',
    })
  }

  const refetchAll = () => {
    refetchRoundInfo()
    refetchVaultBalance()
    refetchHasEntered()
  }

  // Parsed data
  const parsedRoundInfo = roundInfo ? {
    roundId: Number(roundInfo[0]),
    participantCount: Number(roundInfo[1]),
    prizePool: formatEther(roundInfo[2]),
    isActive: roundInfo[3],
  } : null

  const parsedVaultBalance = vaultBalance ? formatEther(vaultBalance) : '0'
  const isOwner = ownerData === address

  // Check for any errors
  const hasErrors = !!(roundInfoError || vaultBalanceError || hasEnteredError)

  return {
    // State
    roundInfo: parsedRoundInfo,
    vaultBalance: parsedVaultBalance,
    hasEntered: hasEntered || false,
    isOwner,
    winnersPerDraw: winnersPerDraw ? Number(winnersPerDraw) : 0,
    minParticipants: minParticipants ? Number(minParticipants) : 0,
    
    // Loading states
    isLoading: roundInfoLoading || vaultBalanceLoading || hasEnteredLoading,
    isOwnerLoading,
    hasErrors,
    
    // Errors
    errors: {
      roundInfo: roundInfoError,
      vaultBalance: vaultBalanceError,
      hasEntered: hasEnteredError,
    },
    
    // Actions
    enter,
    deposit,
    draw,
    refetchAll,
    
    // Transaction states
    enterPending: enterPending || enterConfirming,
    enterSuccess,
    depositPending: depositPending || depositConfirming,
    depositSuccess,
    drawPending: drawPending || drawConfirming,
    drawSuccess,
  }
} 