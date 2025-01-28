import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig} from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia, hardhat } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Ntoboa",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, baseSepolia, hardhat],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export { config, queryClient };