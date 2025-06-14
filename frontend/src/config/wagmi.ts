import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// Define Monad Testnet with correct official RPC endpoint
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'], // Correct official RPC
      timeout: 10000, // 10 second timeout
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
})

export const config = getDefaultConfig({
  appName: 'ChainLuck',
  projectId: '6eef2b97b9e6d0f3e8f2a6b4c7d8e9f0', // ChainLuck Project ID
  chains: [monadTestnet],
  ssr: false,
  // Add batch configuration for better performance
  batch: {
    multicall: true,
  },
})

// Contract address - Updated with newly deployed contract
export const CHAINLUCK_CONTRACT_ADDRESS = '0x552cDd1D6FCeFDC13b1f1Dc3E9b0Ce7137604809' as const 