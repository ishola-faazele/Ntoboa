// providers.tsx
"use client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config, queryClient } from "./wagmi.config";
import { ContractProvider } from "./ContractContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ContractProvider>{children}</ContractProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}