import './output.css'

import { useEffect, useState } from 'react'
import OpenMintInfo from './components/ProjectInfo'
import OpenMintControls from './components/Controls'

import contractABI from './contract/abi'
import { useReadContract } from 'wagmi'
import { OMGallery } from './components/Gallery'

interface OpenMintProps {
    contractAddress?: string
}

export const OpenMintApp = ({ contractAddress }: OpenMintProps) => {
    const [tokens, setTokens] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectionIndex, setSelectionIndex] = useState(null)
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
        const fetchDataFromURI = async (uri) => {
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
                    setError(error.message)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchAllTokens()
    }, [project.allTokens])

    const selection =
        tokens != null && tokens[0] && selectionIndex
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

    const style = {
        '--image-url': `linear-gradient(
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.3)
      ), url(${project.imgURL})`,
    } as React.CSSProperties

    return (
        <div
            id="OM-container"
            // style={style}
            className="bg-bgcol align-center text-textcol flex h-full w-full flex-col justify-between bg-cover bg-center p-2 text-xl"
        >
            <div
                id="OM-header"
                className="flex h-fit w-full justify-end justify-self-start"
            >
                <w3m-button balance="hide" />
            </div>
            <OpenMintInfo project={project} />
            {tokens && tokens[0] ? (
                <OMGallery
                    project={project}
                    selectionIndex={selectionIndex}
                    setSelectionIndex={setSelectionIndex}
                    tokens={tokens as []}
                />
            ) : (
                <></>
            )}
            <OpenMintControls
                cost={project.mintPrice}
                selectionIndex={selectionIndex}
                selection={selection}
                contractAddress={contractAddress as `0x${string}`}
            />
        </div>
    )
}
