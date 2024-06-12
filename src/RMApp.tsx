import './output.css'

import { useEffect, useState } from 'react'

import RebelMintInfo from './components/ProjectInfo'
import contractABI from './contract/abi'
import { useReadContract } from 'wagmi'
import { RMGallery } from './components/Gallery/Gallery'
import { PopUp } from './components/PopUp/Display'
import {
    currencyStruct,
    tokenStruct,
} from './contract/versioning/typeInterfacing'
import { useEthersProvider } from './contract/ethers'
import { ethers } from 'ethers'

interface RebelMintProps {
    contractAddress?: string
}

const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
]

export const RebelMintApp = ({ contractAddress }: RebelMintProps) => {
    // const provider = await web3Modal.connect()
    const [tokens, setTokens] = useState<
        (tokenStruct | { currency_details: currencyStruct })[]
    >([])

    const provider = useEthersProvider()

    const [selectionIndex, setSelectionIndex] = useState<number>(-1)
    const validContractAddress =
        contractAddress && contractAddress.startsWith('0x')
            ? contractAddress
            : undefined
    const result = useReadContract({
        abi: contractABI,
        address: validContractAddress as `0x${string}` | undefined,
        functionName: 'getCollectionAndTokenDataJSON',
    })

    const contractData = result && result.data ? JSON.parse(result.data) : {}
    console.log('Contract Data Returned and Parsed:')
    console.log(contractData)

    const project = {
        title: contractData ? contractData.collection_name : 'Title',
        creator: contractData ? contractData.artist_name : 'Creator',
        desc: contractData
            ? contractData.collection_description
            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', //   ? contractData[0]
        //   : "This project is a project that a creator has created",
        tokens: contractData && contractData.tokens ? contractData.tokens : [],
        currency: null,
    }

    // We have each token URI and need to fetch info like Token image, creator,

    useEffect(() => {
        const fetchDataFromURI = async (uri: string) => {
            const response = await fetch(uri)
            if (!response.ok) {
                throw new Error(
                    `Error fetching data from ${uri}: ${response.statusText}`
                )
            }
            return response.json()
        }

        const fetchCurrencyDetails = async (currencyAddress: string) => {
            const contract = new ethers.Contract(
                currencyAddress,
                ERC20_ABI,
                provider
            )
            const name = await contract.name()
            const symbol = await contract.symbol()
            const decimals = await contract.decimals()
            return {
                name: name,
                symbol: symbol,
                decimals: decimals,
            }
            // return { symbol: 'ETH', address: currencyAddress }
        }

        const fetchAllTokens = async () => {
            if (project.tokens.length > 0) {
                try {
                    const tokenUris = project.tokens.map(
                        (token: tokenStruct) => token.uri
                    )
                    const dataPromises = tokenUris.map(fetchDataFromURI)
                    const results = await Promise.all(dataPromises)
                    // setTokens(results)
                    const tokensWithCurrency: (
                        | tokenStruct
                        | { currency_details: currencyStruct }
                    )[] = await Promise.all(
                        results.map(async (token, index) => {
                            try {
                                if (
                                    project.tokens[index].currency_address &&
                                    project.tokens[index].currency_address !=
                                        '0x0000000000000000000000000000000000000000'
                                ) {
                                    const currency_details =
                                        await fetchCurrencyDetails(
                                            project.tokens[index]
                                                .currency_address
                                        )
                                    console.log(currency_details)
                                    return { ...token, currency_details }
                                } else if (
                                    project.tokens[index].currency_address
                                ) {
                                    const currency_details = {
                                        name: 'Ethereum',
                                        symbol: 'ETH',
                                        decimals: BigInt(18),
                                    }
                                    return { ...token, currency_details }
                                }
                            } catch (error: any) {
                                throw new Error(
                                    `Error fetching currency details for token at index ${index}: ${error.message}`
                                )
                            }
                        })
                    )

                    setTokens(tokensWithCurrency)
                } catch (error: any) {
                    console.log(error.message)
                }
            }
        }

        fetchAllTokens()
        console.log(tokens)
    }, [project.tokens.length])

    // Create a central source of token information:
    // Sale Info, URI Info, Currency Info are all included here
    const allTokens = project.tokens.map(
        (token: tokenStruct, index: number) => {
            return tokens && tokens[index]
                ? { ...token, ...tokens[index] }
                : token
        }
    )
    console.log('Final tokens array with all info:')
    console.log(allTokens)

    const selection: tokenStruct =
        tokens != null && tokens[0] && selectionIndex >= 0
            ? allTokens[selectionIndex]
            : {
                  name: '',
                  is_token_sale_active: false,
                  max_supply: 0,
                  token_cost: 0,
                  uri: '',
                  decimals: '18',
              }

    const ShowPopUp = () => {
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
    }
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
}
