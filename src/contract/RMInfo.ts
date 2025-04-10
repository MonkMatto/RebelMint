/**
 * RMInfo - An object for managing blockchain network information
 * Provides typesafe access to network configurations and utility methods
 */
import EthLogo from '../assets/chain-icons/ethereum.svg'
import ArbitrumLogo from '../assets/chain-icons/arbitrum.svg'
import PolygonLogo from '../assets/chain-icons/polygon.svg'
import BaseLogo from '../assets/chain-icons/base.svg'
import OptimismLogo from '../assets/chain-icons/optimism.svg'
import ShapeLogo from '../assets/chain-icons/shape.svg'

// Define the network type structure
interface NetworkConfig {
    address: string
    chainId: number
    chainIdHex: string
    name: string
    displayName: string
    explorer: string
    isTestnet: boolean
    url: string // Added RPC URL
    icon?: string // Optional icon URL
}

// Define the network types
type NetworkType =
    | 'ethereum'
    | 'base'
    | 'optimism'
    | 'shape'
    | 'arbitrum'
    | 'polygon'

// Define the environment types
type Environment = 'testnet' | 'mainnet'

// Define the structure for the networks object
type NetworksStructure = {
    [key in NetworkType]: {
        [env in Environment]: NetworkConfig
    }
}

// Define the RMInfo object
export const RMInfo = {
    networks: {
        // Ethereum network configuration
        ethereum: {
            mainnet: {
                address: '0x9763141Aa64d07741b0263d8cFb273119adB839a',
                chainId: 1,
                chainIdHex: '0x1',
                name: 'ethereum',
                displayName: 'Ethereum',
                explorer: 'https://etherscan.io/',
                isTestnet: false,
                url: 'https://eth-mainnet.g.alchemy.com/v2/',
                icon: EthLogo,
            },
            testnet: {
                address: '0xBb657C226D81F967F5C9133a1663d47E9B73981B',
                chainId: 11155111,
                chainIdHex: '0xaa36a7',
                name: 'ethereum-sepolia',
                displayName: 'Ethereum Sepolia',
                explorer: 'https://sepolia.etherscan.io/',
                isTestnet: true,
                url: 'https://eth-sepolia.g.alchemy.com/v2/',
                icon: EthLogo,
            },
        },

        // Base network configuration
        base: {
            mainnet: {
                address: '0x69Cc263973b1b22F7d81C5Be880A27CAd4c4E0De',
                chainId: 8453,
                chainIdHex: '0x2105',
                name: 'base',
                displayName: 'Base',
                explorer: 'https://basescan.org/',
                isTestnet: false,
                url: 'https://base-mainnet.g.alchemy.com/v2/',
                icon: BaseLogo,
            },
            testnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 84532,
                chainIdHex: '0x14a34',
                name: 'base-sepolia',
                displayName: 'Base Sepolia',
                explorer: 'https://sepolia.basescan.org/',
                isTestnet: true,
                url: 'https://base-sepolia.g.alchemy.com/v2/',
                icon: BaseLogo,
            },
        },

        // Optimism network configuration
        optimism: {
            mainnet: {
                address: '0x42F6728AD23128F26248BF15F89526914b0B03aF',
                chainId: 10,
                chainIdHex: '0xa',
                name: 'optimism',
                displayName: 'Optimism',
                explorer: 'https://optimistic.etherscan.io/',
                isTestnet: false,
                url: 'https://opt-mainnet.g.alchemy.com/v2/',
                icon: OptimismLogo,
            },
            testnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 11155420,
                chainIdHex: '0xaa37dc',
                name: 'optimism-sepolia',
                displayName: 'Optimism Sepolia',
                explorer: 'https://sepolia-optimism.etherscan.io/',
                isTestnet: true,
                url: 'https://opt-sepolia.g.alchemy.com/v2/',
                icon: OptimismLogo,
            },
        },

        // Shape network configuration
        shape: {
            mainnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 360,
                chainIdHex: '0x168',
                name: 'shape',
                displayName: 'Shape',
                explorer: 'https://shapescan.xyz/',
                isTestnet: false,
                url: 'https://shape-mainnet.g.alchemy.com/v2/',
                icon: ShapeLogo,
            },
            testnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 11011,
                chainIdHex: '0x2b03',
                name: 'shape-sepolia',
                displayName: 'Shape Sepolia',
                explorer: 'https://explorer-sepolia.shape.network/',
                isTestnet: true,
                url: 'https://shape-sepolia.g.alchemy.com/v2/',
                icon: ShapeLogo,
            },
        },

        // Arbitrum network configuration
        arbitrum: {
            mainnet: {
                address: '0x4dCe572b6d6d058D74C5bd158a177b507867ca86',
                chainId: 42161,
                chainIdHex: '0xa4b1',
                name: 'arbitrum',
                displayName: 'Arbitrum',
                explorer: 'https://arbiscan.io/',
                isTestnet: false,
                url: 'https://arb-mainnet.g.alchemy.com/v2/',
                icon: ArbitrumLogo,
            },
            testnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 421614,
                chainIdHex: '0x66eee',
                name: 'arbitrum-sepolia',
                displayName: 'Arbitrum Sepolia',
                explorer: 'https://sepolia.arbiscan.io/',
                isTestnet: true,
                url: 'https://arb-sepolia.g.alchemy.com/v2/',
                icon: ArbitrumLogo,
            },
        },

        // Polygon network configuration
        polygon: {
            mainnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 137,
                chainIdHex: '0x89',
                name: 'polygon',
                displayName: 'Polygon',
                explorer: 'https://polygonscan.com/',
                isTestnet: false,
                url: 'https://polygon-mainnet.g.alchemy.com/v2/',
                icon: PolygonLogo,
            },
            testnet: {
                address: '0xA97A9C1cd3e6d0bB82c571c466AaDa2578dF731C',
                chainId: 80002,
                chainIdHex: '0x13882',
                name: 'polygon-amoy',
                displayName: 'Polygon Amoy',
                explorer: 'https://amoy.polygonscan.com/',
                isTestnet: true,
                url: 'https://polygon-amoy.g.alchemy.com/v2/',
                icon: PolygonLogo,
            },
        },
    } as NetworksStructure,

    /**
     * Get all available networks as a flat array
     * @returns Array of network configurations with type and environment
     */
    getAllNetworks(): Array<
        NetworkConfig & { type: NetworkType; environment: Environment }
    > {
        const networks: Array<
            NetworkConfig & { type: NetworkType; environment: Environment }
        > = []

        Object.keys(this.networks).forEach((networkType) => {
            Object.keys(this.networks[networkType as NetworkType]).forEach(
                (environment) => {
                    networks.push({
                        type: networkType as NetworkType,
                        environment: environment as Environment,
                        ...this.networks[networkType as NetworkType][
                            environment as Environment
                        ],
                    })
                }
            )
        })

        return networks
    },

    /**
     * Get all mainnet networks
     * @returns Array of mainnet network configurations
     */
    getMainnets(): Array<
        NetworkConfig & { type: NetworkType; environment: 'mainnet' }
    > {
        return this.getAllNetworks().filter(
            (network) => !network.isTestnet
        ) as Array<
            NetworkConfig & { type: NetworkType; environment: 'mainnet' }
        >
    },

    /**
     * Get all testnet networks
     * @returns Array of testnet network configurations
     */
    getTestnets(): Array<
        NetworkConfig & { type: NetworkType; environment: 'testnet' }
    > {
        return this.getAllNetworks().filter(
            (network) => network.isTestnet
        ) as Array<
            NetworkConfig & { type: NetworkType; environment: 'testnet' }
        >
    },

    /**
     * Find a network by chain ID
     * @param chainId The chain ID to search for
     * @returns The network configuration or undefined if not found
     */
    getNetworkByChainId(
        chainId: number
    ):
        | (NetworkConfig & { type: NetworkType; environment: Environment })
        | undefined {
        return this.getAllNetworks().find(
            (network) => network.chainId === chainId
        )
    },

    /**
     * Generate explorer URL for a specific address
     * @param network The network or chain ID
     * @param address The address to generate a URL for
     * @returns The explorer URL for the address
     */
    getExplorerAddressUrl(
        network:
            | number
            | (NetworkConfig & { type: NetworkType; environment: Environment }),
        address: string
    ): string | null {
        const networkConfig =
            typeof network === 'number'
                ? this.getNetworkByChainId(network)
                : network

        if (!networkConfig) return null

        return `${networkConfig.explorer}address/${address}`
    },

    /**
     * Generate explorer URL for a specific transaction
     * @param network The network or chain ID
     * @param txHash The transaction hash to generate a URL for
     * @returns The explorer URL for the transaction
     */
    getExplorerTxUrl(
        network:
            | number
            | (NetworkConfig & { type: NetworkType; environment: Environment }),
        txHash: string
    ): string | null {
        const networkConfig =
            typeof network === 'number'
                ? this.getNetworkByChainId(network)
                : network

        if (!networkConfig) return null

        return `${networkConfig.explorer}tx/${txHash}`
    },

    /**
     * Get network switching params for wallet connection
     * @param networkType The type of network
     * @param environment The environment (mainnet or testnet)
     * @returns Parameters for switching to the specified network
     */
    getNetworkSwitchParams(
        networkType: NetworkType,
        environment: Environment = 'mainnet'
    ): {
        chainId: string
        chainName: string
        rpcUrls: string[]
        blockExplorerUrls: string[]
        nativeCurrency: {
            name: string
            symbol: string
            decimals: number
        }
    } | null {
        const network = this.networks[networkType]?.[environment]

        if (!network) return null

        return {
            chainId: network.chainIdHex,
            chainName: network.displayName,
            rpcUrls: [network.url], // Now using the integrated URL
            blockExplorerUrls: [network.explorer],
            nativeCurrency: {
                name:
                    networkType.charAt(0).toUpperCase() + networkType.slice(1),
                symbol: networkType.substring(0, 3).toUpperCase(),
                decimals: 18,
            },
        }
    },

    /**
     * Get a specific network configuration
     * @param networkType The type of network
     * @param environment The environment (mainnet or testnet)
     * @returns The network configuration
     */
    getNetwork(
        networkType: NetworkType,
        environment: Environment = 'mainnet'
    ): NetworkConfig | null {
        return this.networks[networkType]?.[environment] || null
    },

    /**
     * Find a network by its name
     * @param name The name of the network to search for
     * @returns The network configuration or undefined if not found
     */
    getNetworkByName(
        name: string
    ):
        | (NetworkConfig & { type: NetworkType; environment: Environment })
        | undefined {
        return this.getAllNetworks().find((network) => network.name === name)
    },

    /**
     * Get a network configuration by its ID
     * @param id The ID of the network to search for
     * @returns The network configuration or undefined if not found
     */
    getNetworkById(
        id: number
    ):
        | (NetworkConfig & { type: NetworkType; environment: Environment })
        | undefined {
        return this.getAllNetworks().find((network) => network.chainId == id)
    },

    /**
     * Validate if a chain name exists
     * @param name The name of the chain to validate
     * @returns True if the chain name exists, otherwise false
     */
    validateChainByName(name: string): boolean {
        return this.getAllNetworks().some((network) => network.name === name)
    },

    /**
     * Validate if a chain ID exists
     * @param chainId The chain ID to validate
     * @returns True if the chain ID exists, otherwise false
     */
    validateChainById(chainId: number): boolean {
        return this.getAllNetworks().some(
            (network) => network.chainId === chainId
        )
    },

    /**
     * Get all chain names
     * @returns Array of all chain name values
     */
    getAllChainNames(): string[] {
        return this.getAllNetworks().map((network) => network.name)
    },
}

// Export types for external use
export type { NetworkConfig, NetworkType, Environment }
