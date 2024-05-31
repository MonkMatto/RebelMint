import "../output.css";
import OpenMintButton from "./components/Button";
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { arbitrum, sepolia, base, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Your WalletConnect Cloud project ID
const projectId = "915bfa8adb5da85a137c332d75b35ae4";

// 2. Create wagmiConfig
const metadata = {
  name: "OpenMint-Dev",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, sepolia, base, arbitrum] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

interface OpenMintProps {
  contractAddress: string;
}

const OpenMint = ({ contractAddress }: OpenMintProps) => {
  return (
    <Web3ModalProvider>
      <div
        id="OpenMint-Container"
        className="w-full h-full text-xl flex justify-center align-center"
      >
        <OpenMintButton buttonText="Connect Wallet" />
      </div>
    </Web3ModalProvider>
  );
};

export default OpenMint;
