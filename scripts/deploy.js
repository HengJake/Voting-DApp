const hre = require("hardhat");

async function main() {
  const VotingDApp = await hre.ethers.getContractFactory("VotingDApp");
  const votingDApp = await VotingDApp.deploy();

  await votingDApp.waitForDeployment();

  console.log("VotingDApp deployed to:", votingDApp.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});