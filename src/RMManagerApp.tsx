import './output.css'
import { useEffect, useState, useMemo } from 'react'
import contractABI from './contract/abi'
import Web3 from 'web3'
import { ManagerGallery } from './components/Manager/ManagerGallery'
import { NewTokenPopUp } from './components/Manager/NewToken'
import {
    currencyStruct,
    projectStruct,
    tokenStruct,
} from './contract/typeInterfacing'
import { useEthersProvider } from './contract/ethers'
import approvedByteCodes from './contract/bytecodes'
import findValueByVersionPrefix from './contract/helpers/findValueByVersionPrefix'
import fetchCurrencyDetailsFromEndpoint from './contract/helpers/fetchCurrencyDetailsFromEndpoint'
import fetchDataFromUri from './contract/helpers/fetchDataFromURI'
import { EditTokenPopUp } from './components/Manager/EditToken'
import { useAccount } from 'wagmi'

import arrowright from './assets/arrowright.svg'
import { RMInfo } from './contract/RMInfo'
import { AlertTriangle } from 'lucide-react'

interface RebelMintProps {
    contractAddress?: string
    providerUrl: string
    chainID: number
}

const fetchAllTokens = async (
    project: projectStruct,
    providerUrl: string,
    chainId: number
) => {
    if (project.tokens.length > 0) {
        const tokenUris = project.tokens.map((token: tokenStruct) => token.uri)
        const dataPromises = tokenUris.map((uri) =>
            fetchDataFromUri(uri).catch((err) => {
                console.error(
                    `Failed to fetch token data from URI: ${uri}`,
                    err
                )
                return {
                    name: 'Invalid Token URI',
                    external_url: 'https://docs.rebelmint.org/token-uri-errors',
                    description: `This token's URI is invalid or not reachable.`,
                    image: '/broken_link.svg',
                }
            })
        )
        const results = await Promise.all(dataPromises)

        const tokensWithCurrency = await Promise.all(
            results.map(async (token, index) => {
                if (project.tokens[index].currency_address) {
                    const currency_details =
                        await fetchCurrencyDetailsFromEndpoint(
                            project.tokens[index].currency_address as string,
                            providerUrl,
                            chainId
                        )
                    return { ...token, currency_details }
                }
                return token
            })
        )

        return tokensWithCurrency
    }
    return []
}

export const RebelMintTokenManagerApp = ({
    contractAddress,
    providerUrl,
    chainID,
}: RebelMintProps) => {
    const { address } = useAccount()
    const network = RMInfo.getNetworkByChainId(chainID)
    const [tokens, setTokens] = useState<
        (tokenStruct | { currency_details: currencyStruct })[]
    >([])
    console.log('Tokens:', tokens)
    const provider = useEthersProvider({ chainId: chainID })
    const chainName = RMInfo.getNetworkByChainId(chainID)?.name
    const [byteCodeIsValid, setByteCodeIsValid] = useState(true)
    const [selectionIndex, setSelectionIndex] = useState<number>(-1)
    const validContractAddress =
        contractAddress && contractAddress.startsWith('0x')
            ? contractAddress
            : undefined
    const [contractData, setContractData] = useState<any>(null)
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const httpProvider = new Web3.providers.HttpProvider(
                    providerUrl as string
                )
                const web3 = new Web3(httpProvider)
                const contract = new web3.eth.Contract(
                    contractABI,
                    validContractAddress
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
            try {
                const tokensData = await fetchAllTokens(
                    project,
                    providerUrl,
                    chainID
                )
                setTokens(tokensData)
            } catch (error) {
                console.error('Error fetching all tokens data:', error)
            }
        }
        const fetchOwnerAddress = async () => {
            try {
                const response = await fetch(
                    `${network?.url}${import.meta.env.VITE_ALCHEMY_KEY}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            method: 'eth_call',
                            params: [
                                {
                                    to: contractAddress,
                                    data: '0x8da5cb5b', // owner() function selector
                                },
                                'latest',
                            ],
                            id: 1,
                        }),
                    }
                )
                const data = await response.json()
                if (data.result) {
                    const owner = `0x${data.result.slice(26)}`
                    console.log('Owner address:', owner)
                    console.log('User address:', address)
                    setOwnerAddress(owner)
                } else {
                    console.error('Failed to fetch owner address:', data.error)
                }
            } catch (error) {
                console.error('Error fetching owner address:', error)
            }
        }

        if (contractData) {
            fetchAndCompareBytecode()
            fetchAllTokensData()
            fetchOwnerAddress()
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

    const ShowEditTokenPopUp = useMemo(() => {
        return () => {
            if (selection && selectionIndex >= 0 && contractAddress) {
                return (
                    <EditTokenPopUp
                        setSelectionIndex={setSelectionIndex}
                        selectionIndex={selectionIndex}
                        contractAddress={contractAddress}
                        selection={selection}
                    />
                )
            }
            return null
        }
    }, [selection, selectionIndex, contractAddress, tokens.length])

    const ShowNewTokenPopUp = useMemo(() => {
        return () => {
            if (
                selection &&
                selectionIndex == allTokens.length &&
                contractAddress
            ) {
                return (
                    <NewTokenPopUp
                        setSelectionIndex={setSelectionIndex}
                        contractAddress={contractAddress}
                    />
                )
            }
            return null
        }
    }, [selection, selectionIndex, contractAddress, tokens.length])

    if (address && ownerAddress?.toLowerCase() != address?.toLowerCase()) {
        console.log('Owner address compared:', ownerAddress)
        console.log('User address:', address)
        return (
            <div
                id="RM-container"
                className="@container size align-center relative flex h-full w-full flex-col justify-start gap-5 p-2 font-satoshi text-xl text-textcol"
            >
                <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
                    <AlertTriangle color="red" size={100} />
                    <h1 className="text-xl">
                        You are not the owner of this contract
                    </h1>
                </div>
            </div>
        )
    }

    if (address) {
        if (byteCodeIsValid) {
            if (project) {
                return (
                    <div
                        id="RM-container"
                        className="@container size align-center relative flex h-full w-full flex-col justify-start gap-5 p-2 font-satoshi text-xl text-textcol"
                    >
                        <div
                            id="RM-link-to-collection"
                            className="flex h-fit w-full flex-col gap-4 lg:flex-row"
                        >
                            <div
                                id="RM-header"
                                className="flex h-fit w-full flex-col justify-start justify-self-start rounded-lg bg-base-800 p-10 text-base-50 md:w-3/4"
                            >
                                <h1 className="mb-4 text-xl font-normal">
                                    Managing:
                                </h1>
                                <h1 className="text-3xl font-bold">{`${project.title} `}</h1>

                                <h1 className="text-normal font-thin">{`by ${project.creator}`}</h1>
                            </div>
                            <a
                                href={`/${chainName}/${contractAddress}`}
                                target="_blank"
                                className="flex w-full items-center justify-end rounded-lg border border-base-50 bg-base-950 p-10 text-right text-base-50 hover:bg-base-900 md:w-1/4"
                            >
                                View Collection Page
                                <img className="h-full" src={arrowright} />
                            </a>
                        </div>
                        {allTokens ? (
                            <ManagerGallery
                                allTokens={allTokens}
                                selectionIndex={selectionIndex}
                                setSelectionIndex={setSelectionIndex}
                                tokens={allTokens as [tokenStruct]}
                            />
                        ) : (
                            <></>
                        )}
                        <ShowEditTokenPopUp />
                        <ShowNewTokenPopUp />
                    </div>
                )
            } else {
                return (
                    <div
                        id="RM-container"
                        className="@container size align-center relative flex h-full min-h-[100%] w-full flex-col justify-start gap-5 bg-bgcol bg-cover bg-center p-2 font-satoshi text-xl text-textcol"
                    >
                        <h1 className="text-xl">
                            No RebelMint contract at this address
                        </h1>
                        <p className="font-thin">
                            Ensure address and network are correct
                        </p>
                    </div>
                )
            }
        } else {
            return (
                <div
                    id="RM-container"
                    className="size align-center relative flex h-full w-full flex-col items-center justify-center bg-bgcol bg-cover bg-center p-2 font-satoshi text-xl text-textcol"
                >
                    Warning: Contract is not RebelMint Verified
                </div>
            )
        }
    } else {
        return (
            <div className="@container size align-center relative flex h-full w-full flex-col justify-start gap-5 p-2 font-satoshi text-xl text-textcol">
                Please Connect Wallet To Manage Tokens
            </div>
        )
    }
}
