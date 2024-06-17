import './output.css'
import { useEffect, useState, useMemo } from 'react'
import RebelMintInfo from './components/ProjectInfo'
import contractABI from './contract/abi'
import Web3 from 'web3'
import { RMGallery } from './components/Gallery/Gallery'
import { PopUp } from './components/PopUp/Display'
import { currencyStruct, tokenStruct } from './contract/typeInterfacing'
import { useEthersProvider } from './contract/ethers'
import approvedByteCodes from './contract/bytecodes'

interface RebelMintProps {
    contractAddress?: string
}

const findValueByVersionPrefix = (obj: any, version: string) => {
    const prefix = version.split('j')[0]
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && key.startsWith(prefix)) {
            const keyPrefix = key.split('j')[0]
            if (keyPrefix === prefix) {
                return obj[key]
            }
        }
    }
    return null
}

const fetchDataFromUri = async (uri: string) => {
    try {
        const response = await fetch(uri)
        if (!response.ok) {
            throw new Error(
                `Error fetching data from ${uri}: ${response.statusText}`
            )
        }
        return await response.json()
    } catch (error) {
        throw new Error(`Error fetching data from ${uri}: ${error.message}`)
    }
}

const fetchCurrencyDetailsFromEndpoint = async (currencyAddress: string) => {
    try {
        const providerUrl =
            'https://eth-sepolia.g.alchemy.com/v2/eLo2RjcL3Og5FzLml5oXcSnXRJb6ny6A'
        const httpProvider = new Web3.providers.HttpProvider(providerUrl)
        const web3 = new Web3(httpProvider)

        const nameData = await web3.eth.call({
            to: currencyAddress,
            data: web3.utils.sha3('name()').substring(0, 10), // Function signature for name()
        })
        const symbolData = await web3.eth.call({
            to: currencyAddress,
            data: web3.utils.sha3('symbol()').substring(0, 10), // Function signature for symbol()
        })
        const decimalsData = await web3.eth.call({
            to: currencyAddress,
            data: web3.utils.sha3('decimals()').substring(0, 10), // Function signature for decimals()
        })

        const name = web3.utils.hexToUtf8(nameData)
        const symbol = web3.utils.hexToUtf8(symbolData)
        const decimals = web3.utils.hexToNumberString(decimalsData)

        return {
            name,
            symbol,
            decimals,
        }
    } catch (error) {
        throw new Error(
            `Error fetching currency details from ${currencyAddress}: ${error.message}`
        )
    }
}

const fetchAllTokens = async (project: any) => {
    if (project.tokens.length > 0) {
        const tokenUris = project.tokens.map((token: tokenStruct) => token.uri)
        const dataPromises = tokenUris.map(fetchDataFromUri)
        const results = await Promise.all(dataPromises)

        const tokensWithCurrency = await Promise.all(
            results.map(async (token, index) => {
                if (
                    project.tokens[index].currency_address &&
                    project.tokens[index].currency_address !==
                        '0x0000000000000000000000000000000000000000'
                ) {
                    const currency_details =
                        await fetchCurrencyDetailsFromEndpoint(
                            project.tokens[index].currency_address
                        )
                    return { ...token, currency_details }
                } else if (project.tokens[index].currency_address) {
                    const currency_details = {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: '18',
                    }
                    return { ...token, currency_details }
                }
                return token
            })
        )

        return tokensWithCurrency
    }
    return []
}

export const RebelMintApp = ({ contractAddress }: RebelMintProps) => {
    const [tokens, setTokens] = useState<
        (tokenStruct | { currency_details: currencyStruct })[]
    >([])
    const provider = useEthersProvider()
    const [byteCodeIsValid, setByteCodeIsValid] = useState(true)
    const [selectionIndex, setSelectionIndex] = useState<number>(-1)
    const validContractAddress =
        contractAddress && contractAddress.startsWith('0x')
            ? contractAddress
            : undefined
    const [contractData, setContractData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const providerUrl =
                    'https://eth-sepolia.g.alchemy.com/v2/eLo2RjcL3Og5FzLml5oXcSnXRJb6ny6A'
                const httpProvider = new Web3.providers.HttpProvider(
                    providerUrl
                )
                const web3 = new Web3(httpProvider)
                const contract = new web3.eth.Contract(
                    contractABI,
                    contractAddress
                )
                const result = await contract.methods
                    .getCollectionAndTokenDataJSON()
                    .call()
                setContractData(JSON.parse(result))
            } catch (error) {
                console.error('Error reading contract data:', error)
            }
        }
        fetchData()
    }, [contractAddress])

    const project = useMemo(() => {
        return contractData
            ? {
                  title: contractData.collection_name,
                  creator: contractData.artist_name,
                  desc: contractData.collection_description,
                  tokens: contractData.tokens,
                  currency: null,
              }
            : {
                  title: 'Title',
                  creator: 'Creator',
                  desc: 'Lorem ipsum dolor sit amet...',
                  tokens: [],
                  currency: null,
              }
    }, [contractData])

    useEffect(() => {
        const fetchAndCompareBytecode = async () => {
            if (provider && contractData?.contract_code) {
                const version = contractData.contract_code
                const versionBytecode = findValueByVersionPrefix(
                    approvedByteCodes,
                    version
                )
                try {
                    const code = await provider.getCode(
                        contractAddress as `${string}`
                    )
                    if (versionBytecode === code) {
                        setByteCodeIsValid(true)
                    }
                } catch (error: any) {
                    console.log(error.message)
                }
            }
        }

        const fetchAllTokensData = async () => {
            const tokensData = await fetchAllTokens(project)
            setTokens(tokensData)
        }

        if (contractData) {
            fetchAndCompareBytecode()
            fetchAllTokensData()
        }
    }, [contractData, provider, project, contractAddress])

    const allTokens = useMemo(() => {
        return project.tokens.map((token: tokenStruct, index: number) => {
            return tokens && tokens[index]
                ? { ...token, ...tokens[index] }
                : token
        })
    }, [project.tokens, tokens])

    const selection = useMemo(() => {
        return allTokens[selectionIndex]
            ? allTokens[selectionIndex]
            : {
                  name: '',
                  is_token_sale_active: false,
                  max_supply: 0,
                  token_cost: 0,
                  uri: '',
                  decimals: '18',
              }
    }, [allTokens, selectionIndex])

    const ShowPopUp = useMemo(() => {
        return () => {
            if (selection && selectionIndex >= 0 && contractAddress) {
                return (
                    <PopUp
                        setSelectionIndex={setSelectionIndex}
                        selectionIndex={selectionIndex}
                        contractAddress={contractAddress}
                        selection={selection}
                        numTokens={tokens.length - 1}
                    />
                )
            }
            return null
        }
    }, [selection, selectionIndex, contractAddress, tokens.length])

    if (byteCodeIsValid) {
        return (
            <div
                id="RM-container"
                className="@container size bg-bgcol font-satoshi align-center text-textcol relative flex h-full w-full flex-col justify-start bg-cover bg-center p-2 text-xl"
            >
                <ShowPopUp />
                <div
                    id="RM-header"
                    className="flex h-fit w-full justify-end justify-self-start"
                >
                    <w3m-button balance="hide" />
                </div>
                <RebelMintInfo project={project} />
                {allTokens && allTokens[0] && allTokens[0].currency_details ? (
                    <RMGallery
                        allTokens={allTokens}
                        selectionIndex={selectionIndex}
                        setSelectionIndex={setSelectionIndex}
                        tokens={allTokens as [tokenStruct]}
                    />
                ) : (
                    <></>
                )}
            </div>
        )
    } else {
        return (
            <div
                id="RM-container"
                className="size bg-bgcol font-satoshi align-center text-textcol relative flex h-full w-full flex-col items-center justify-center bg-cover bg-center p-2 text-xl"
            >
                Warning: Contract is not RebelMint Verified
            </div>
        )
    }
}
