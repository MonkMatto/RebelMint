import './output.css'
import { useEffect, useState, useMemo } from 'react'
import RebelMintInfo from './components/ProjectInfo'
import contractABI from './contract/abi'
import Web3 from 'web3'
import { RMGallery } from './components/Gallery/Gallery'
import { PopUp } from './components/PopUp/Display'
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

interface RebelMintProps {
    contractAddress: string
    providerUrl: string
    explorerUrl: string
    chainID: number
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

export const RebelMintApp = ({
    contractAddress,
    providerUrl,
    explorerUrl,
    chainID,
}: RebelMintProps) => {
    const [tokens, setTokens] = useState<
        (tokenStruct | { currency_details: currencyStruct })[]
    >([])
    const provider = useEthersProvider({ chainId: chainID })
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
                setContractData(JSON.parse(result))
            } catch (error: any) {
                console.error('Error fetching bytecode:', error)
                console.error('Error message:', error.message)
                console.error('Error details:', JSON.stringify(error, null, 2))
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
                    } else {
                        setByteCodeIsValid(false)
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
                className="@container size align-center relative flex h-full w-full flex-col justify-start p-2 pt-12 font-satoshi text-xl text-textcol"
            >
                <div
                    id="RM-header"
                    className="absolute right-0 top-0 m-5 flex h-fit w-full justify-end justify-self-start md:mr-14"
                >
                    <w3m-button balance="hide" />
                </div>
                <div className="p-4 md:px-12">
                    <RebelMintInfo
                        project={project}
                        explorerUrl={explorerUrl}
                    />
                </div>
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
                <ShowPopUp />
            </div>
        )
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
