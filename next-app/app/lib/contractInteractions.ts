import { ethers, BigNumberish } from "ethers";
export const BASE_SEPOLIA_CONTRACT_ADDRESS =
  "0xF5DAea00afc8368BA69572347259dc3225FC9537";
export const HARDHAT_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import ABI from "@/lib/ABI.json";
import { ContractContextType } from "./ContractContext";
export const initializeContract = async (): Promise<
  ethers.Contract | undefined
> => {
  // const provider = new ethers.BrowserProvider(window.ethereum);
  if (typeof window !== "undefined" && window.ethereum) {
    // const rpcProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      BASE_SEPOLIA_CONTRACT_ADDRESS,
      ABI,
      signer
    );
    console.log(contractInstance);
    return contractInstance;
  }
  throw new Error("MetaMask is not available.");
};

export const addCharity = async (
  contractInstance: ContractContextType,
  name: string,
  description: string,
  target: BigNumberish
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }

  try {
    const tx = await contractInstance.addCharity(name, description, target);
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error adding charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};
export const withdrawFromCharity = async (
  contractInstance: ethers.Contract,
  id: number
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }
  try {
    const tx = await contractInstance.withdraw(id);
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error withdrawing from charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};

export const donateToCharity = async (
  contractInstance: ethers.Contract,
  id: number,
  amount: BigNumberish
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }
  try {
    const tx = await contractInstance.donate(id, { value: amount });
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error donating to charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};

export const getBalanceOfCharity = async (
  contractInstance: ethers.Contract,
  id: number
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }
  try {
    const balance = await contractInstance.getBalanceOf(id);
    return balance;
  } catch (error) {
    console.error("Error getting balance of charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};
