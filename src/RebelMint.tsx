import './output.css'
import { createWeb3Modal } from '@web3modal/wagmi/react'

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import {
    base,
    baseSepolia,
    arbitrum,
    arbitrumSepolia,
    mainnet,
    sepolia,
    polygon,
    polygonAmoy,
    optimism,
    optimismSepolia,
    zora,
    zoraSepolia,
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { RebelMintApp } from './RMApp.tsx'
import { RebelMintTokenManagerApp } from './RMManagerApp.tsx'
import { NetworkConfig, RMInfo } from './contract/RMInfo.ts'
import { useAccount } from 'wagmi'
import { shape } from './contract/custom-networks/shape.ts'
import { shapeSepolia } from './contract/custom-networks/shapeSepolia.ts'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. WalletConnect Cloud project ID
const projectId = '915bfa8adb5da85a137c332d75b35ae4'

// 2. Create wagmiConfig with dynamic chains
const metadata = {
    name: 'RebelMint',
    description: 'RebelMint dApp',
    url: 'https://rebelmint.org', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const createConfig = (chainId?: number) => {
    const allChains = [
        mainnet,
        sepolia,
        base,
        baseSepolia,
        arbitrum,
        arbitrumSepolia,
        polygon,
        polygonAmoy,
        optimism,
        optimismSepolia,
        shape,
        shapeSepolia,
        zora,
        zoraSepolia,
    ] as const

    // Always include all chains in the configuration
    return defaultWagmiConfig({
        chains: allChains as unknown as [typeof mainnet, ...(typeof mainnet)[]],
        projectId,
        metadata,
        // Set the default chain if provided
        ...(chainId ? { defaultChainId: chainId } : {}),
    })
}

interface RebelMintProps {
    contractAddress: string
    chainId: string | number // id from ChainsData.ts
    apiKey: string
    useExistingProvider?: boolean // New prop to control provider detection
}

interface RebelMintManagerProps {
    contractAddress: string
    chainId: string | number // id from ChainsData.ts
    bypassWeb3?: boolean
    apiKey: string
    useExistingProvider?: boolean // New prop to control provider detection
}

const Web3ModalProviderWithChain = ({
    children,
    chainId,
    useExistingProvider = true,
}: {
    children: React.ReactNode
    chainId?: number
    useExistingProvider?: boolean
}) => {
    const [hasExistingProvider, setHasExistingProvider] = useState<
        boolean | null
    >(null)

    useEffect(() => {
        // Only run detection if we want to use existing providers
        if (useExistingProvider) {
            try {
                // Check if Wagmi context is accessible
                // This is a bit of a hack since we can't directly check for context

                // If window has wagmi provider state already
                const hasWagmi = !!(
                    window.localStorage.getItem('wagmi.connected') ||
                    window.localStorage.getItem('wagmi.wallet') ||
                    document.querySelector('[data-wagmi]')
                )

                setHasExistingProvider(hasWagmi)
            } catch (error) {
                setHasExistingProvider(false)
            }
        } else {
            setHasExistingProvider(false)
        }
    }, [useExistingProvider])

    // Still detecting
    if (useExistingProvider && hasExistingProvider === null) {
        return <div>Checking for existing web3 provider...</div>
    }

    // If we found an existing provider, just render children
    if (useExistingProvider && hasExistingProvider) {
        console.log('Using existing WagmiProvider from parent application')
        return <>{children}</>
    }

    // Otherwise create our own provider
    console.log('Creating new WagmiProvider with chainId:', chainId)
    const config = createConfig(chainId)

    // Create modal with the specific config
    createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: true,
        enableOnramp: true,
        themeVariables: {
            '--w3m-accent': '#3481CB',
            '--w3m-border-radius-master': '8px',
        },
    })

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

const RebelMint = ({
    contractAddress,
    chainId,
    apiKey,
    useExistingProvider = true,
}: RebelMintProps) => {
    const network = RMInfo.getNetworkById(chainId as number) as NetworkConfig
    const { url, explorer } = network
    const fullURL = url + apiKey

    // This will run inside the appropriate provider context
    const RebelMintContent = () => {
        // These hooks will work if we're in a WagmiProvider context
        const { isConnected } = useAccount()
        const connectedChain = useAccount().chain

        const connectedChainisValid = connectedChain
            ? connectedChain?.id == chainId
            : false

        console.log(`connectedChain: ${connectedChain}`)
        console.log(connectedChain)
        console.log(
            `Contract Network: ${network?.displayName}, networkId: ${chainId}`
        )
        console.log(
            `Connected Network: ${connectedChain?.name}, networkId: ${connectedChain?.id}`
        )
        console.log(`validConnectedChain: ${connectedChainisValid}`)
        console.log(`isConnected: ${isConnected}`)

        return (
            <RebelMintApp
                contractAddress={contractAddress}
                providerUrl={fullURL}
                explorerUrl={explorer + 'address/' + contractAddress}
                chainID={chainId as number}
                validConnectedChain={
                    isConnected && !connectedChainisValid ? false : true
                }
            />
        )
    }

    // Use our Web3ModalProvider with detection
    return (
        <Web3ModalProviderWithChain
            chainId={chainId as number}
            useExistingProvider={useExistingProvider}
        >
            <RebelMintContent />
        </Web3ModalProviderWithChain>
    )
}

export const RebelMintTokenManager = ({
    contractAddress,
    chainId,
    bypassWeb3,
    apiKey,
    useExistingProvider = true,
}: RebelMintManagerProps) => {
    const network = RMInfo.getNetworkById(chainId as number) as NetworkConfig
    const { url } = network
    const fullURL = url + apiKey

    if (bypassWeb3) {
        return (
            <RebelMintTokenManagerApp
                contractAddress={contractAddress}
                providerUrl={fullURL}
                chainID={chainId as number}
            />
        )
    } else {
        return (
            <Web3ModalProviderWithChain
                chainId={chainId as number}
                useExistingProvider={useExistingProvider}
            >
                <RebelMintTokenManagerApp
                    contractAddress={contractAddress}
                    providerUrl={fullURL}
                    chainID={chainId as number}
                />
            </Web3ModalProviderWithChain>
        )
    }
}

export default RebelMint
