import './output.css'
import { useEffect, useState, useMemo } from 'react'
import RebelMintInfo from './components/ProjectInfo'
import contractABI from './contract/abi'
import Web3 from 'web3'
import { RMGallery } from './components/Gallery/Gallery'

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
import { setPageTitle } from './util/setPageTitle'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { NetworkConfig, RMInfo } from './contract/RMInfo'
import { PopUp } from './components/PopUp/PopUp'

interface RebelMintProps {
    contractAddress: string
    providerUrl: string
    explorerUrl: string
    chainID: number
    validConnectedChain: boolean
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

export const RebelMintApp = ({
    contractAddress,
    providerUrl,
    explorerUrl,
    chainID,
    validConnectedChain,
}: RebelMintProps) => {
    const [tokens, setTokens] = useState<
        (tokenStruct | { currency_details: currencyStruct })[]
    >([])
    const provider = useEthersProvider({ chainId: chainID })
    const [contractValidity, setContractValidity] = useState<
        'invalid' | 'unverified' | 'valid'
    >('invalid')
    const [selectionIndex, setSelectionIndex] = useState<number>(-1)
    const validContractAddress =
        contractAddress && contractAddress.startsWith('0x')
            ? contractAddress
            : undefined
    console.log(`validContractAddress: ${validContractAddress}`)
    console.log(`contractValidity: ${contractValidity}`)
    const [loading, setLoading] = useState(true)
    const [contractData, setContractData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (!validContractAddress) {
                console.error('Invalid contract address')
                setContractValidity('invalid')
                return
            }

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
                const data = JSON.parse(result)
                setContractData(data)
                // console.log('Contract data:', data)
                console.log(data)
                if (data && data.collection_name) {
                    setPageTitle(data.collection_name)
                }
            } catch (error: any) {
                console.error('Error fetching bytecode:', error)
                console.error('Error message:', error.message)
                console.error('Error details:', JSON.stringify(error, null, 2))
                setContractValidity('invalid')
            } finally {
                setLoading(false)
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
            setLoading(true)
            if (provider && contractData?.contract_code) {
                const version = contractData.contract_code
                const versionBytecode = findValueByVersionPrefix(
                    approvedByteCodes,
                    version
                )
                if (!versionBytecode) {
                    console.warn(`Version bytecode not found`)
                    setContractValidity('invalid')
                    return
                }
                try {
                    const code = await provider.getCode(
                        contractAddress as `${string}`
                    )
                    if (code === '0x') {
                        console.warn(`Contract ABI not found`)
                        setContractValidity('invalid')
                        return
                    }
                    // console.log(`Contract code: ${code}`)
                    // console.log(`Version bytecode: ${versionBytecode}`)
                    // console.log(`Version: ${version}`)

                    if (versionBytecode === code) {
                        setContractValidity('valid')
                    } else {
                        console.warn(`Bytecode does not match`)
                        setContractValidity('unverified')
                    }
                    setLoading(false)
                } catch (error: any) {
                    console.log(error.message)
                    setContractValidity('invalid')
                } finally {
                    setLoading(false)
                }
            } else {
                console.warn(`Provider or contract data not available`)
                setContractValidity('invalid')
                setLoading(false)
            }
        }

        const fetchAllTokensData = async () => {
            const tokensData = await fetchAllTokens(
                project,
                providerUrl,
                chainID
            )
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

    console.log(`contractValidity: ${contractValidity}`)
    const network = RMInfo.getNetworkByChainId(chainID) as NetworkConfig

    return (
        <div
            id="RM-container"
            className="@container size align-center relative flex h-full w-full flex-col justify-start p-2 pt-12 font-satoshi text-xl text-textcol"
        >
            {!loading && !validConnectedChain && (
                <div className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-red-500 bg-base-850 p-4">
                        <p>{`Please switch your wallet to ${network.displayName}`}</p>
                        <w3m-network-button />
                    </div>
                </div>
            )}
            {loading ? (
                <div className="flex h-full min-h-[50svh] w-full flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="absolute left-1/2 top-1/2 size-10 animate-spin text-textcol" />
                </div>
            ) : (
                <>
                    {(!loading && contractValidity === 'unverified') ||
                        (contractValidity == 'invalid' && (
                            <div className="flex h-full min-h-[50svh] w-full flex-col items-center justify-center gap-4 text-center">
                                <h1 className="flex items-center gap-2 text-red-500">
                                    <AlertTriangle /> Sorry Bub, that ain't a
                                    RebelMint contract.
                                </h1>
                                <p>
                                    For security, this app only works with
                                    RebelMint contracts.
                                </p>
                            </div>
                        ))}

                    {!loading && contractValidity === 'valid' && (
                        <>
                            <div
                                id="RM-header"
                                className="flex h-fit w-full justify-end justify-self-start p-4 py-2"
                            >
                                <w3m-button balance="hide" />
                            </div>
                            <div id="RM-content" className="flex w-full gap-4">
                                <div className="p-4 md:px-12">
                                    <RebelMintInfo
                                        project={project}
                                        explorerUrl={explorerUrl}
                                    />
                                </div>
                                {allTokens &&
                                allTokens[0] &&
                                allTokens[0].currency_details ? (
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
                            <ShowPopUp />
                        </>
                    )}
                </>
            )}
        </div>
    )
}
