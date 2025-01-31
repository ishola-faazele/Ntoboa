import { createContext, useContext, useState, useEffect } from "react";
import { ethers, BigNumberish } from "ethers";
import {
  initializeContract,
  addCharityInteraction,
  withdrawFromCharityInteraction,
  donateToCharityInteraction,
  getBalanceOfCharityInteraction,
} from "./contractInteractions";
export interface ContractContextType {
  contract: ethers.Contract | undefined;
  addCharity: (
    name: string,
    description: string,
    target: BigNumberish
  ) => Promise<void>;

  withdrawFromCharity: (id: string) => Promise<void>; // `id` is `bytes` in Solidity
  donateToCharity: (id: string, amount: BigNumberish) => Promise<void>; // `id` is `bytes` in Solidity
  getBalanceOfCharity: (id: string) => Promise<string>; // `id` is `bytes` in Solidity
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined
  );

  useEffect(() => {
    const loadContract = async () => {
      try {
        const contractInstance = await initializeContract();
        setContract(contractInstance);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to initialize contract:", error.message);
        } else {
          console.error("Unknown error occurred:", error);
        }
      }
    };
    loadContract();
  }, []);

  const addCharity = async (
    name: string,
    description: string,
    target: BigNumberish
  ) => {
    if (!contract) throw new Error("Contract is not initialized.");
    // const tx = await contract.addCharity(name, description, target);
    // await tx.wait();
    // console.log("Charity added:", tx);
    return addCharityInteraction(contract, name, description, target);
  };
  const withdrawFromCharity = async (id: string) => {
    if (!contract) throw new Error("Contract is not initialized.");
    return withdrawFromCharityInteraction(contract, id);
  };

  const donateToCharity = async (id: string, amount: BigNumberish) => {
    if (!contract) throw new Error("Contract is not initialized.");
    return donateToCharityInteraction(contract, id, amount);
  };

  const getBalanceOfCharity = async (id: string) => {
    if (!contract) throw new Error("Contract is not initialized.");
    return getBalanceOfCharityInteraction(contract, id);
  };

  const contextValue: ContractContextType = {
    contract,
    addCharity,
    withdrawFromCharity,
    donateToCharity,
    getBalanceOfCharity,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
