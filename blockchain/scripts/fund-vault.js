const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Funding ChainLuckVault...");

  // Get deployment info
  const deploymentInfo = require('../deployment.json');
  const contractAddress = deploymentInfo.contractAddress;
  
  console.log(`📍 Contract Address: ${contractAddress}`);

  // Get the contract
  const ChainLuckVault = await ethers.getContractFactory("ChainLuckVault");
  const chainLuckVault = ChainLuckVault.attach(contractAddress);

  // Fund with 0.1 ETH
  const fundAmount = ethers.parseEther("0.1");
  
  console.log(`💵 Funding with ${ethers.formatEther(fundAmount)} ETH...`);
  
  const tx = await chainLuckVault.deposit({ value: fundAmount });
  await tx.wait();
  
  console.log(`✅ Vault funded successfully!`);
  console.log(`🧾 Transaction Hash: ${tx.hash}`);
  
  // Check vault balance
  const vaultBalance = await chainLuckVault.vaultBalance();
  console.log(`💰 Current Vault Balance: ${ethers.formatEther(vaultBalance)} ETH`);
  
  // Get round info
  const roundInfo = await chainLuckVault.getCurrentRoundInfo();
  console.log(`\n📊 Round Information:`);
  console.log(`   Round ID: ${roundInfo[0]}`);
  console.log(`   Participants: ${roundInfo[1]}`);
  console.log(`   Prize Pool: ${ethers.formatEther(roundInfo[2])} ETH`);
  console.log(`   Is Active: ${roundInfo[3]}`);
  
  console.log(`\n🎉 Vault funding completed!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Funding failed:", error);
    process.exit(1);
  }); 