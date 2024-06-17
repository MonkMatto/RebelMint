import Web3 from 'web3'

const readContract = async (contractAddress: string, contractABI: any) => {
    try {
        // Initialize Web3 with Etherscan API as provider
        // const apiKey = '1TFUB1CURJAQ3Z6UH9WQFHTF83IBA4YNHX'
        const providerUrl =
            'https://eth-sepolia.g.alchemy.com/v2/eLo2RjcL3Og5FzLml5oXcSnXRJb6ny6A' //`https://api-sepolia.etherscan.io/api?module=proxy&action=eth_call&apikey=${apiKey}`
        const httpProvider = new Web3.providers.HttpProvider(providerUrl)
        const web3 = new Web3(httpProvider)

        // Initialize the contract instance
        const contract = new web3.eth.Contract(contractABI, contractAddress)

        // Call the smart contract function
        const result = await contract.methods
            .getCollectionAndTokenDataJSON()
            .call()
        console.log(result)
        return result
    } catch (error) {
        console.error('Error reading contract data:', error)
        throw error
    }
}

export default readContract
