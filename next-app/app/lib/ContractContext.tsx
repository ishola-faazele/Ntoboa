import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { initializeContract } from "./contractInteractions";
export interface ContractContextType {
  contract: ethers.Contract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);

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

  return (
    <ContractContext.Provider value={{ contract }}>
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
