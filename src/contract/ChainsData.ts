const chainsData = {
    sepolia: {
        url: `https://eth-sepolia.g.alchemy.com/v2/`,
        explorerBaseUrl: 'https://sepolia.etherscan.io/address/',
        chainID: 11155111,
    },
    ethereum: {
        url: `https://base-mainnet.g.alchemy.com/v2/`,
        explorerBaseUrl: 'https://etherscan.io/address/',
        chainID: 1,
    },
    baseSepolia: {
        url: `https://base-sepolia.g.alchemy.com/v2/`,
        explorerBaseUrl: 'https://sepolia.basescan.org/address/',

        chainID: 84532,
    },
    base: {
        url: `https://base-mainnet.g.alchemy.com/v2/`,
        explorerBaseUrl: 'https://basescan.org/address/',

        chainID: 8453,
    },
}

export default chainsData
