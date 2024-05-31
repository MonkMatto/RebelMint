import "../output.css";
import OpenMintButton from "./components/Button";
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { arbitrum, sepolia, base, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import OpenMintInfo from "./components/ProjectInfo";

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
  contractAddress?: string;
}

const OpenMint = ({ contractAddress }: OpenMintProps) => {
  const [project, setProject] = useState({
    title: "Title",
    creator: "Creator",
    desc: "This project is a project that a creator has created",
    imgURL:
      "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  });
  return (
    <Web3ModalProvider>
      <div
        id="OM-container"
        className="w-full h-full text-xl flex flex-col justify-center align-center p-2"
      >
        <div
          id="OM-header"
          className="h-fit w-full flex justify-end justify-self-start"
        >
          <OpenMintButton buttonText="Connect Wallet" />
        </div>
        <OpenMintInfo project={project} />
      </div>
    </Web3ModalProvider>
  );
};

export default OpenMint;
