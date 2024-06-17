import Web3 from 'web3'

const fetchCurrencyDetailsFromEndpoint = async (
    currencyAddress: string,
    providerUrl: string
) => {
    try {
        console.log(providerUrl)
        // const providerUrl =
        //     'https://eth-sepolia.g.alchemy.com/v2/eLo2RjcL3Og5FzLml5oXcSnXRJb6ny6A'
        const httpProvider = new Web3.providers.HttpProvider(providerUrl)
        const web3 = new Web3(httpProvider)

        const nameData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('name()'),
        })
        const symbolData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('symbol()'),
        })
        const decimalsData = await web3.eth.call({
            to: currencyAddress,
            data: web3.eth.abi.encodeFunctionSignature('decimals()'),
        })
        const name = web3.utils.hexToUtf8(nameData)
        const symbol = web3.utils.hexToUtf8(symbolData)
        const decimals = web3.utils.hexToNumberString(decimalsData)

        return {
            name,
            symbol,
            decimals,
        }
    } catch (error: any) {
        throw new Error(
            `Error fetching currency details from ${currencyAddress}: ${error.message}`
        )
    }
}

export default fetchCurrencyDetailsFromEndpoint
