require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    monad: {
      url: "https://testnet-rpc.monad.xyz", // Correct official RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143,
      gas: "auto",
      gasPrice: "auto",
      timeout: 60000,
      httpHeaders: {}
    }
  },
  etherscan: {
    // No etherscan verification for Monad testnet yet
    apiKey: {
      monad: "abc" // placeholder
    },
    customChains: [
      {
        network: "monad",
        chainId: 10143,
        urls: {
          apiURL: "https://testnet.monadexplorer.com/api",
          browserURL: "https://testnet.monadexplorer.com"
        }
      }
    ]
  }
}; 