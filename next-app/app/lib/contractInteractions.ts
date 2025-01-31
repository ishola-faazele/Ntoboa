import { ethers, BigNumberish } from "ethers";
export const BASE_SEPOLIA_CONTRACT_ADDRESS =
  "0x17e4BF3ecDdf156B239e47e5829d655133ed7C4C";
export const HARDHAT_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import ABI from "@/lib/ABI.json";
export const initializeContract = async (): Promise<
  ethers.Contract | undefined
> => {
  // const provider = new ethers.BrowserProvider(window.ethereum);
  if (typeof window !== "undefined" && window.ethereum) {
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

export const addCharityInteraction = async (
  contractInstance: ethers.Contract,
  name: string,
  description: string,
  target: BigNumberish
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }

  try {
    const tx = await contractInstance.addCharity(name, description, target);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error adding charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};
export const withdrawFromCharityInteraction = async (
  contractInstance: ethers.Contract,
  id: string
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }
  try {
    const tx = await contractInstance.withdraw(id);
    await tx.wait();
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error withdrawing from charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};

export const donateToCharityInteraction = async (
  contractInstance: ethers.Contract,
  id: string,
  amount: BigNumberish
) => {
  if (!contractInstance) {
    throw new Error("Contract instance is required.");
  }
  try {
    const tx = await contractInstance.donate(id, {
      value: ethers.parseEther(String(amount)),
    });
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction:", tx);
    return tx;
  } catch (error) {
    console.error("Error donating to charity:", error);
    throw error; // Re-throw error for the caller to handle
  }
};

export const getBalanceOfCharityInteraction = async (
  contractInstance: ethers.Contract,
  id: string
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
