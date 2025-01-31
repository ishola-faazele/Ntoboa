// components/DonateButton.tsx
"use client"; // Required for client-side interactivity

import { useContract } from "@/lib/ContractContext";
import { DonateModal } from "./DonateModal";

export default function DonateButton({
  address,
}: {
  address: string;
}): JSX.Element {
  const { contract, donateToCharity } = useContract();

  const handleDonate = async (amount: number) => {
    if (contract) {
      try {
        await donateToCharity(address, amount);
        alert("Donation successful!");
      } catch (error) {
        console.error("Failed to donate:", error);
        alert("Failed to donate. Please try again.");
      }
    }
  };

  return (
    <>
      <DonateModal address={address} onDonate={handleDonate} />
    </>
  );
}
