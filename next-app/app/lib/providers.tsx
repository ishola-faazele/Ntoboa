"use client";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client"; // Adjust path as needed
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
          <ApolloProvider client={client}>
            <ContractProvider>{children}</ContractProvider>
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
