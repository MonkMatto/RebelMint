import './output.css'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { Web3ModalProviderProps } from './contract/typeInterfacing.ts'

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { sepolia, base, mainnet, baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RebelMintApp } from './RMApp.tsx'
import chainsData from './contract/ChainsData.ts'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Your WalletConnect Cloud project ID
const projectId = '915bfa8adb5da85a137c332d75b35ae4'

// 2. Create wagmiConfig
const metadata = {
    name: 'OpenMint-Dev',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = [mainnet, sepolia, base, baseSepolia] as const
const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    // ...wagmiOptions, // Optional - Override createConfig parameters
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    themeVariables: {
        '--w3m-accent': '#3481CB',
        '--w3m-border-radius-master': '8px',
    },
})

export function Web3ModalProvider({ children }: Web3ModalProviderProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

interface RebelMintProps {
    contractAddress?: string
    chain: 'base' | 'ethereum' | 'sepolia' | 'baseSepolia'
}

const RebelMint = ({ contractAddress, chain }: RebelMintProps) => {
    const { url } = chainsData[chain] || { url: '', chainID: '' }
    console.log(`Network:` + chainsData[chain])
    return (
        <Web3ModalProvider>
            <RebelMintApp contractAddress={contractAddress} providerUrl={url} />
        </Web3ModalProvider>
    )
}

export default RebelMint
