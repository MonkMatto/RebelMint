import './output.css'

import { useEffect, useState } from 'react'
import RebelMintInfo from './components/ProjectInfo'
import { useToken } from 'wagmi'
import contractABI from './contract/abi'
import { useReadContract } from 'wagmi'
import { RMGallery } from './components/Gallery/Gallery'
import { PopUp } from './components/PopUp/Display'
import {
    saleInfoStruct,
    tokenStruct,
} from './contract/versioning/typeInterfacing'

interface RebelMintProps {
    contractAddress?: string
}

export const RebelMintApp = ({ contractAddress }: RebelMintProps) => {
    const [tokens, setTokens] = useState(null)
    const [selectionIndex, setSelectionIndex] = useState(-1)
    const result = useReadContract({
        abi: contractABI,
        address: contractAddress,
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
        const fetchDataFromURI = async (uri: tokenStruct) => {
            const response = await fetch(uri)
            if (!response.ok) {
                throw new Error(
                    `Error fetching data from ${uri}: ${response.statusText}`
                )
            }
            return response.json()
        }

        const fetchCurrencyDetails = async (currencyAddress) => {
            return { symbol: 'ETH' }
        }

        const fetchAllTokens = async () => {
            if (project.tokens.length > 0) {
                try {
                    const tokenUris = project.tokens.map((token) => token.uri)
                    const dataPromises = tokenUris.map(fetchDataFromURI)
                    const results = await Promise.all(dataPromises)
                    // setTokens(results)
                    const tokensWithCurrency = await Promise.all(
                        results.map(async (token, index) => {
                            if (project.tokens[index].currency_address) {
                                const currency_details =
                                    await fetchCurrencyDetails(
                                        project.tokens[index].currency_address
                                    )
                                return { ...token, currency_details }
                            } else {
                                return token
                            }
                        })
                    )

                    setTokens(tokensWithCurrency)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }

        fetchAllTokens()
        console.log(tokens)
    }, [project.tokens.length])

    // Create a central source of token information:
    // Sale Info, URI Info, Currency Info are all included here
    const allTokens = project.tokens.map((token, index) => {
        return tokens && tokens[index] ? { ...token, ...tokens[index] } : token
    })
    console.log('Final tokens array with all info:')
    console.log(allTokens)

    const selection: { token: tokenStruct } =
        tokens != null && tokens[0] && selectionIndex >= 0
            ? allTokens[selectionIndex]
            : {
                  saleInfo: {
                      isTokenSaleActive: false,
                      maxSupply: 0,
                      tokenCost: 0,
                      tokenUri: '',
                  },
                  token: {
                      name: 'unknown',
                  },
              }

    const ShowPopUp = () => {
        if (selection && selectionIndex >= 0) {
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
            className="bg-bgcol font-satoshi align-center text-textcol relative flex h-full w-full flex-col justify-start bg-cover bg-center p-2 text-xl"
        >
            <ShowPopUp />
            <div
                id="RM-header"
                className="flex h-fit w-full justify-end justify-self-start"
            >
                <w3m-button balance="hide" />
            </div>
            <RebelMintInfo project={project} />
            {tokens && tokens[0] ? (
                <RMGallery
                    allTokens={allTokens}
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    tokens={tokens}
                />
            ) : (
                <></>
            )}
        </div>
    )
}
