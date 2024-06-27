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

import arrowright from './assets/arrowright.svg'

interface RebelMintProps {
    contractAddress?: string
    providerUrl: string
}

const fetchAllTokens = async (project: projectStruct, providerUrl: string) => {
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
                            project.tokens[index].currency_address as string,
                            providerUrl
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

export const RebelMintTokenManagerApp = ({
    contractAddress,
    providerUrl,
}: RebelMintProps) => {
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
    const [contractData, setContractData] = useState<any>(null)

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
                console.log(result)
                var fixedResult = result.replace(
                    '"tokens": [}',
                    '"tokens": []}'
                )
                setContractData(JSON.parse(fixedResult))
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
            const tokensData = await fetchAllTokens(project, providerUrl)
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

    if (byteCodeIsValid) {
        console.log(project)
        if (project) {
            return (
                <div
                    id="RM-container"
                    className="@container size align-center relative flex h-full w-full flex-col justify-start gap-5 p-2 font-satoshi text-xl text-textcol"
                >
                    <div
                        id="RM-link-to-collection"
                        className="flex h-fit w-full gap-4"
                    >
                        <div
                            id="RM-header"
                            className="bg-base-50 text-base-950 flex h-fit w-2/3 flex-col justify-start justify-self-start rounded-lg p-10"
                        >
                            <h1 className="mb-4 text-xl font-normal">
                                Managing:
                            </h1>
                            <h1 className="text-3xl font-bold">{`${project.title} `}</h1>

                            <h1 className="text-normal font-thin">{`by ${project.creator}`}</h1>
                        </div>
                        <a
                            href={`/?contract=${contractAddress}`}
                            target="_blank"
                            className="bg-base-950 hover:bg-base-900 text-base-50 border-base-50 flex w-1/3 items-center justify-end rounded-lg border p-10 text-right"
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
}
