import './output.css'

import { useEffect, useState } from 'react'
import RebelMintInfo from './components/ProjectInfo'

import contractABI from './contract/abi'
import { useReadContract } from 'wagmi'
import { RMGallery } from './components/Gallery/Gallery'
import { PopUp } from './components/PopUp/Display'
import { tokenStruct } from './contract/versioning/typeInterfacing'

interface RebelMintProps {
    contractAddress?: string
}

export const RebelMintApp = ({ contractAddress }: RebelMintProps) => {
    const [tokens, setTokens] = useState(null)
    const [selectionIndex, setSelectionIndex] = useState(-1)
    console.log('selectionIndexIndex is:')
    console.log(selectionIndex)
    const result = useReadContract({
        abi: contractABI,
        address: '0xfbE3687896B583E9E9727a58BD96207f35fD015c',
        functionName: 'getContractData',
    })
    console.log('Contract Data Returned:')
    console.log(result.data)

    const contractData = result.data

    const project = {
        title: 'Title',
        creator: 'Creator',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', //   ? contractData[0]
        //   : "This project is a project that a creator has created",
        mintPrice: 0.15,
        allTokens: contractData ? contractData[1] : [],
        imgURL:
            tokens && tokens[0] && tokens[0].image
                ? tokens[Math.round(Math.random()) * (tokens.length - 1)].image
                : 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

        const fetchAllTokens = async () => {
            if (project.allTokens.length > 0) {
                try {
                    const tokenUris = project.allTokens.map(
                        (token) => token.tokenUri
                    )
                    const dataPromises = tokenUris.map(fetchDataFromURI)
                    const results = await Promise.all(dataPromises)
                    setTokens(results)
                    console.log(results)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }

        fetchAllTokens()
    }, [project.allTokens])

    const selection: { token: tokenStruct } =
        tokens != null && tokens[0] && selectionIndex >= 0
            ? {
                  saleInfo: project.allTokens[selectionIndex],
                  token: tokens[selectionIndex],
              }
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
            className="bg-bgcol font-satoshi align-center text-textcol relative flex h-full w-full flex-col justify-between bg-cover bg-center p-2 text-xl"
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
                    allTokenSaleInfo={project.allTokens}
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
