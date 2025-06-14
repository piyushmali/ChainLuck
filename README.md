# 🍀 ChainLuck - Decentralized Lucky Cashback Rewards

**"Turn everyday dApp interactions into lucky cashback rewards — decentralized, automatic, and funded by protocols, not users."**

ChainLuck empowers any Web3 project to boost engagement by plugging in a luck-based cashback engine. Instead of spending on ads, protocols fund a vault, and when users take meaningful actions, they're entered into jackpot rounds to win real crypto rewards.

## 🎯 Project Vision

ChainLuck offers value to three key audiences:

| Audience | Value Delivered |
|----------|----------------|
| **Users** | Win ETH/token rewards by simply using your favorite dApps |
| **Builders** | Retain users and increase daily active wallets without airdrops |
| **Protocols** | Replace costly marketing campaigns with high-retention incentives |

## 🏗️ Architecture

### Core Components

1. **🛠️ Smart Contract** (`contracts/ChainLuckVault.sol`)
   - Decentralized vault engine for managing jackpot rounds
   - Accepts funding from project treasuries
   - Tracks participants and randomly selects winners
   - Distributes prizes equally among winners

2. **🎨 Frontend** (Next.js + Tailwind)
   - `pages/index.tsx` - User interface for jackpot participation
   - `pages/admin.tsx` - Admin dashboard for vault management
   - `components/VaultStatus.tsx` - Real-time vault statistics
   - `components/WinnerModal.tsx` - Celebration modal for winners

3. **🧪 Test Suite** (Hardhat + Mocha)
   - Comprehensive smart contract testing
   - Winner selection fairness verification
   - Prize distribution validation

4. **🧰 JavaScript SDK** (`sdk/sdk.js`)
   - Easy integration wrapper for dApps
   - Event listeners for real-time updates
   - Helper functions for common operations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChainLuck
   ```

2. **Install dependencies**
   ```bash
   # Install smart contract dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp frontend/.env.example frontend/.env.local
   
   # Add your private key for deployment (optional)
   echo "PRIVATE_KEY=your_private_key_here" > .env
   ```

### Development Workflow

#### 1. Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npx hardhat node
# In another terminal:
npm run deploy
```

#### 2. Frontend Development

```bash
# Start frontend development server
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the user interface.
Visit `http://localhost:3000/admin` to access the admin dashboard.

#### 3. Deploy to Monad Testnet

```bash
# Set your private key in .env file
# Get Monad testnet ETH from faucet

# Deploy contract
npx hardhat run scripts/deploy.js --network monad

# Update frontend/.env.local with deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>
```

## 📋 Smart Contract API

### Core Functions

| Function | Description | Access |
|----------|-------------|--------|
| `deposit()` | Add ETH to current round's prize pool | Public |
| `enter(address user)` | Enter user into current jackpot round | Public |
| `drawWinners()` | Manually trigger winner selection | Owner |
| `setWinnersPerDraw(uint256)` | Configure winners per round | Owner |
| `setMinParticipants(uint256)` | Set minimum participants for auto-draw | Owner |
| `resetRound()` | Start new round | Owner |

### View Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getCurrentRoundInfo()` | `(roundId, participants, prizePool, isActive)` | Current round statistics |
| `hasUserEnteredCurrent(address)` | `bool` | Check if user entered current round |
| `getRoundParticipants(uint256)` | `address[]` | Get participants for specific round |
| `getRoundWinners(uint256)` | `address[]` | Get winners for specific round |

### Events

```solidity
event UserEntered(address indexed user, uint256 roundId);
event WinnersDrawn(uint256 roundId, address[] winners, uint256 prizePerWinner);
event PrizeDistributed(address indexed winner, uint256 amount, uint256 roundId);
event RoundReset(uint256 oldRoundId, uint256 newRoundId);
```

## 🔌 SDK Integration

### Basic Usage

```javascript
const { enterUser, getJackpotInfo } = require('./sdk/sdk.js');

// Enter user into jackpot after dApp action
async function onUserSwap(userAddress) {
  const result = await enterUser(provider, vaultAddress, userAddress);
  if (result.success) {
    console.log('User entered jackpot!', result.transactionHash);
  }
}

// Display current jackpot info
const jackpotInfo = await getJackpotInfo(provider, vaultAddress);
console.log(`Current prize: ${jackpotInfo.currentPrize} ETH`);
```

### Advanced SDK Usage

```javascript
const { ChainLuckSDK } = require('./sdk/sdk.js');

const sdk = new ChainLuckSDK(contractAddress, provider);

// Listen for user wins
sdk.onUserWon(userAddress, (winData) => {
  showWinnerModal(winData.amount, winData.roundId);
});

// Listen for round completions
sdk.onWinnersDrawn((drawData) => {
  console.log(`Round ${drawData.roundId} completed!`);
  console.log(`Winners: ${drawData.winners.join(', ')}`);
});
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/chainluck.test.js

# Run tests with coverage
npx hardhat coverage
```

### Test Coverage

- ✅ Contract deployment and initialization
- ✅ Vault deposits and accumulation
- ✅ User entry and duplicate prevention
- ✅ Winner selection fairness
- ✅ Prize distribution accuracy
- ✅ Round management and resets
- ✅ Owner-only function access
- ✅ Emergency withdrawal
- ✅ Configuration updates

## 🌐 Frontend Features

### User Interface (`/`)

- **Wallet Connection**: MetaMask integration
- **Action Simulation**: Demo buttons for common dApp actions
- **Real-time Status**: Live vault balance and participant count
- **Winner Celebration**: Animated modal with confetti
- **Responsive Design**: Mobile-friendly interface

### Admin Dashboard (`/admin`)

- **Vault Management**: Fund vault, draw winners, reset rounds
- **Participant Tracking**: View current round participants
- **Winner History**: See recent winners
- **Configuration**: Update winners per draw and minimum participants
- **Emergency Controls**: Emergency withdrawal function

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds and glass morphism
- **Responsive Layout**: Mobile-first design
- **Real-time Updates**: Live data refresh and event listening
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and ARIA labels

## 🔒 Security Features

- **Reentrancy Protection**: OpenZeppelin ReentrancyGuard
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive parameter checking
- **Emergency Features**: Emergency withdrawal for owner
- **Event Logging**: Comprehensive event emission

## 📊 Configuration

### Default Parameters

- **Winners Per Draw**: 2
- **Minimum Participants**: 5 (for auto-draw)
- **Network**: Monad Testnet (Chain ID: 41454)

### Customization

All parameters are configurable by the contract owner:

```bash
# Update via admin interface or directly via contract
await contract.setWinnersPerDraw(3);
await contract.setMinParticipants(10);
```

## 🌍 Deployment

### Local Development

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network
npm run deploy

# Start frontend
cd frontend && npm run dev
```

### Monad Testnet

```bash
# Deploy to Monad testnet
npx hardhat run scripts/deploy.js --network monad

# Verify deployment
npx hardhat verify --network monad <contract_address> <constructor_args>
```

### Production Deployment

```bash
# Build frontend for production
cd frontend && npm run build

# Deploy frontend to Vercel/Netlify
# Update environment variables with production contract address
```

## 📈 Integration Examples

### For dApp Developers

```javascript
// Example: Uniswap integration
async function afterSwap(userAddress, amount) {
  // Execute swap logic...
  
  // Enter user into ChainLuck
  await enterUser(provider, CHAINLUCK_ADDRESS, userAddress);
  
  showToast("Swap completed! You've been entered into ChainLuck jackpot! 🍀");
}
```

### For Protocol Teams

```javascript
// Example: Protocol vault funding
async function fundChainLuckVault(amount) {
  const sdk = new ChainLuckSDK(VAULT_ADDRESS, provider);
  const result = await sdk.fundVault(amount, signer);
  
  if (result.success) {
    console.log(`Funded vault with ${amount} ETH`);
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Monad Testnet](https://testnet1.monad.xyz)
- [Documentation](docs/)
- [Discord Community](#)
- [Twitter](#)

## 🆘 Support

- Create an issue for bugs or feature requests
- Join our Discord for community support
- Check the documentation for integration guides

---

**Built with ❤️ for the Web3 community**

*ChainLuck - Making DeFi more rewarding, one transaction at a time! 🍀* 