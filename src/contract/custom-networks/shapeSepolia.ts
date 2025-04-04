import { defineChain } from 'viem'

const sourceId = 11_155_111 // sepolia

export const shapeSepolia = defineChain({
    id: 11011,
    name: 'Shape',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.shape.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Shapescan Sepolia',
            url: 'https://sepolia.shapescan.xyz/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
    },
    sourceId,
})
