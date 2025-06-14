# 🍀 ChainLuck - Decentralized Lucky Rewards

![ChainLuck Banner](https://img.shields.io/badge/ChainLuck-Live%20on%20Monad-success?style=for-the-badge&logo=ethereum)

**ChainLuck** is a cutting-edge decentralized lottery platform built on **Monad Testnet**, featuring automatic winner selection and instant ETH payouts.

## 🚀 **Live Deployment**

- **🔗 Contract Address**: `0xCB58A72705FF1a064C6F3Cdb41014927649d8ED9`
- **🌐 Network**: Monad Testnet (Chain ID: 10143)
- **🔍 Explorer**: [View on Monad Explorer](https://testnet.monadexplorer.com/contracts/partial_match/10143/0xCB58A72705FF1a064C6F3Cdb41014927649d8ED9/)
- **✅ Verification**: Verified on Sourcify

## ✨ **Key Features**

### 🎯 **Smart Contract Features**
- **Automated Winner Selection**: Provably fair random selection algorithm
- **Instant Payouts**: Winners receive ETH immediately after draw
- **Configurable Parameters**: Adjustable winners per draw and minimum participants
- **Admin Controls**: Fund management, manual draws, and round resets
- **Event Logging**: Complete transaction history and winner tracking

## 🛠️ **Technology Stack**

| Component | Technology | Version |
|-----------|------------|---------|
| **Blockchain** | Solidity | 0.8.26 |
| **Development** | Hardhat | ^2.19.0 |
| **Web3** | ethers.js | ^6.8.0 |
| **Network** | Monad Testnet | 10143 |

## 📋 **Contract Configuration**

```solidity
Contract: ChainLuckVault
Winners per Draw: 2
Minimum Participants: 5
Constructor Parameters: (2, 5)
```

## 🔧 **Installation & Setup**

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/your-repo/ChainLuck.git
cd ChainLuck
```

### 2️⃣ **Install Dependencies**
```bash
# Navigate to blockchain directory and install dependencies
cd blockchain
npm install
```

### 3️⃣ **Environment Configuration**
```bash
# Create .env file in blockchain directory (if not exists)
cd blockchain
echo 'PRIVATE_KEY=your_private_key_here' > .env
echo 'MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz' >> .env
```

## 🎮 **Usage Guide**

### 👤 **For Users**
1. **Connect Wallet**: Use Web3 compatible wallet and connect to Monad Testnet
2. **Enter Round**: Call the contract's `enter()` function to participate (no cost to enter)
3. **Wait for Draw**: Automatic draw when minimum participants reached
4. **Win Prizes**: Receive instant ETH payouts if selected as winner

### ⚙️ **For Admins** (Contract Owner)
1. **Fund Vault**: Add ETH to the prize pool using `deposit()` function
2. **Manual Draw**: Trigger winner selection manually with `drawWinners()`
3. **Reset Round**: Start new round if needed with `resetRound()`
4. **View Statistics**: Monitor participation and winner history through contract events

## 🧪 **Testing**

### **Run Smart Contract Tests**
```bash
cd blockchain
npm test
```
**Result**: ✅ All 26 tests passing

### **Test Coverage**
- ✅ Contract deployment and initialization
- ✅ User entry functionality
- ✅ Winner selection algorithm
- ✅ Prize distribution
- ✅ Admin functions
- ✅ Error handling and edge cases

## 🔍 **Contract Functions**

### **Public Functions**
```solidity
function enter(address user) external                     // Enter current round
function deposit() external payable                       // Fund prize pool
function getCurrentRoundInfo() external view             // Get round stats
function getRoundParticipants(uint256) external view     // Get participants
function getRoundWinners(uint256) external view          // Get winners
function hasUserEnteredCurrent(address) external view    // Check entry status
```

### **Admin Functions** (Owner Only)
```solidity
function drawWinners() external onlyOwner                // Manual winner draw
function resetRound() external onlyOwner                 // Start new round
function setWinnersPerDraw(uint256) external onlyOwner   // Update config
function setMinParticipants(uint256) external onlyOwner  // Update config
function emergencyWithdraw() external onlyOwner          // Emergency funds
```

## 📊 **Transaction Verification**

### **How to Verify Transactions**
1. **Monad Explorer**: Visit [testnet.monadexplorer.com](https://testnet.monadexplorer.com)
2. **Search Contract**: Enter contract address `0xCB58A72705FF1a064C6F3Cdb41014927649d8ED9`
3. **View Transactions**: Check all contract interactions
4. **Verify Events**: Confirm UserEntered, WinnersDrawn, PrizeDistributed events

### **Expected Transaction Types**
- **🎯 User Entry**: `enter(address)` transactions
- **💰 Vault Funding**: `deposit()` with ETH value
- **🎲 Winner Draws**: `drawWinners()` transactions
- **🔄 Round Resets**: `resetRound()` transactions

## 🔒 **Security Features**

- **✅ ReentrancyGuard**: Protection against reentrancy attacks
- **✅ Ownable**: Admin function access control
- **✅ Input Validation**: Comprehensive parameter checking
- **✅ Safe Math**: Overflow protection with Solidity 0.8+
- **✅ Event Logging**: Complete audit trail

## 📈 **Project Scripts**

```bash
# Smart Contract (run from blockchain directory)
cd blockchain
npm run compile      # Compile Solidity contracts
npm run test         # Run contract test suite
npm run deploy       # Deploy to Monad testnet
npm run verify       # Verify contract on explorer
```

## 📁 **Project Structure**

```
ChainLuck/
├── blockchain/           # All blockchain-related files
│   ├── contracts/       # Solidity smart contracts
│   ├── scripts/         # Deployment scripts
│   ├── test/           # Contract test suite
│   ├── cache/          # Hardhat cache
│   ├── artifacts/      # Compiled contracts
│   ├── sdk/            # Development kit
│   ├── hardhat.config.js
│   ├── package.json
│   ├── .env
│   └── deployment.json
├── README.md
├── .gitignore
└── .git/
```

## 🎯 **Project Status**

| Feature | Status |
|---------|--------|
| Smart Contract | ✅ Deployed & Verified |
| Wallet Integration | ✅ Contract Compatible |
| Real-time Events | ✅ Working |

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Built on Monad Testnet
- Powered by Hardhat development environment
- Uses OpenZeppelin security standards 