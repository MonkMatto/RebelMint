import { FallbackProvider, JsonRpcProvider } from 'ethers'
import { useMemo } from 'react'
import type { Chain, Client, Transport } from 'viem'
import { type Config, useClient } from 'wagmi'

// This function is used only for failing CORS requests that give us trouble
// Currently, this is only for ETH-Sepolia, please update this if you add more
function addCorsProxy(url: string): string {
    // Only add proxy for endpoints that give us CORS issues
    if (url.includes('rpc.sepolia.org')) {
        return `https://crossorigin.me/${encodeURIComponent(url)}`
    }
    return url
}

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback') {
        const providers = (transport.transports as ReturnType<Transport>[]).map(
            ({ value }) =>
                new JsonRpcProvider(
                    value?.url ? addCorsProxy(value.url) : value?.url,
                    network
                )
        )
        if (providers.length === 1) return providers[0]
        return new FallbackProvider(providers)
    }
    return new JsonRpcProvider(
        transport.url ? addCorsProxy(transport.url) : transport.url,
        network
    )
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
    const client = useClient<Config>({ chainId })
    return useMemo(
        () => (client ? clientToProvider(client) : undefined),
        [client]
    )
}
