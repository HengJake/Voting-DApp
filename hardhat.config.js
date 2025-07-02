require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat : {
      forking : {
        url : "https://kaia-kairos.blockpi.network/v1/rpc/public"
      }
    }
  }
};
