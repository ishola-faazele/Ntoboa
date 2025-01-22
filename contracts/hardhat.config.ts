import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.WALLET_PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
};

export default config;
