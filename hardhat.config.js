require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    kaia: {
      url: process.env.RPC_URL_KAIA_TESTNET,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
