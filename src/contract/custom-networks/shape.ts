import { defineChain } from 'viem'

const sourceId = 1 // mainnet

export const shape = defineChain({
    id: 360,
    name: 'Shape',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.shape.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Shapescan',
            url: 'https://shapescan.xyz/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
    },
    sourceId,
})
