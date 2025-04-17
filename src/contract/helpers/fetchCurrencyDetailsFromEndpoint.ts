import Web3 from 'web3'
import { NetworkConfig, RMInfo } from '../RMInfo'

const fetchCurrencyDetailsFromEndpoint = async (
    currencyAddress: string,
    providerUrl: string,
    chainId: number
) => {
    try {
        console.warn(`fetching currency details from ${currencyAddress}`)
        console.log(`providerUrl: ${providerUrl}`)

        // Check if this is the zero address (representing native token)
        if (currencyAddress === '0x0000000000000000000000000000000000000000') {
            // Get network info from RMInfo
            const network = RMInfo.getNetworkByChainId(chainId) as NetworkConfig
            console.log('Network info:', network)

            // If we have currency info in the network object, use it
            if (network?.currency) {
                return {
                    name: network.currency.name,
                    symbol: network.currency.symbol,
                    decimals: network.currency.decimals.toString(),
                }
            }

            // Otherwise, build a default token based on network type if available
            if (network) {
                let name, symbol

                // Use network displayName for the token name
                name = network.displayName

                // Use first 3 letters of the name for the symbol (uppercase)
                symbol = network.name.substring(0, 3).toUpperCase()

                // Some networks need special handling
                if (network.name.includes('ethereum')) {
                    symbol = 'ETH'
                } else if (network.name.includes('polygon')) {
                    symbol = 'MATIC'
                } else if (network.name.includes('arbitrum')) {
                    symbol = 'ETH' // Arbitrum uses ETH
                } else if (network.name.includes('optimism')) {
                    symbol = 'ETH' // Optimism uses ETH
                } else if (network.name.includes('base')) {
                    symbol = 'ETH' // Base uses ETH
                }

                return {
                    name: name,
                    symbol: symbol,
                    decimals: '18', // Most native tokens use 18 decimals
                }
            }

            // Fallback for unknown networks
            return { name: 'Ethereum', symbol: 'ETH', decimals: '18' }
        }

        // If not the zero address, continue with ERC20 token lookup
        const httpProvider = new Web3.providers.HttpProvider(providerUrl)
        const web3 = new Web3(httpProvider)

        // Get name
        const nameData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('name()'),
        })

        // Get symbol
        const symbolData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('symbol()'),
        })

        // Get decimals
        const decimalsData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('decimals()'),
        })

        // Safe decoding with fallbacks
        let name, symbol, decimals

        try {
            name = web3.eth.abi.decodeParameter('string', nameData) as string
        } catch (error) {
            console.warn(`Error decoding name: ${error}`)
            name = 'Unknown Token'
        }

        try {
            symbol = web3.eth.abi.decodeParameter(
                'string',
                symbolData
            ) as string
        } catch (error) {
            console.warn(`Error decoding symbol: ${error}`)
            symbol = 'TKN'
        }

        try {
            decimals = web3.eth.abi.decodeParameter(
                'uint8',
                decimalsData
            ) as string
        } catch (error) {
            console.warn(`Error decoding decimals: ${error}`)
            decimals = '18'
        }

        return {
            name,
            symbol,
            decimals,
        }
    } catch (error: any) {
        console.error(`Error in fetchCurrencyDetailsFromEndpoint: ${error}`)
        // Return default values instead of throwing
        return {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: '18',
        }
    }
}

export default fetchCurrencyDetailsFromEndpoint
