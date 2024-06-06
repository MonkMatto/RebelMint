import { useEffect, useState } from 'react'
import icon from '../assets/ether.webp'
import { useReadContract } from 'wagmi'
import contractABI from '../contract/abi'
interface saleInfoProps {
    isTokenSaleActive: boolean
    maxSupply: string | number
    tokenCost: string | number
    tokenUri: string
}
interface tokenProps {
    name: string
    created_by: string
    description: string
    external_url: string
    attributes: []
    image: string
}
interface cardProps {
    token: tokenProps
    saleInfo: saleInfoProps
    tokenIndex: number
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}
export const TokenCard = ({
    token,
    saleInfo,
    tokenIndex,
    setSelectionIndex = () => {},
    selectionIndex,
}: cardProps) => {
    const result = useReadContract({
        abi: contractABI,
        address: '0xfbE3687896B583E9E9727a58BD96207f35fD015c',
        functionName: 'totalSupply',
        args: [tokenIndex],
    })
    const availableSupply = result.data ? result.data.toString() : '0'
    console.log('availableSupply:')
    console.log(availableSupply)
    if (token) {
        const { name, created_by, image } = token
        const creator = created_by ? created_by : '...'
        const { maxSupply, tokenCost } = saleInfo
        const costToDisplay =
            Number(tokenCost) / 1000000000000000000 < 0.000001
                ? '< 0.000001'
                : Number(tokenCost) / 1000000000000000000
        const supplyIndicator = availableSupply + ' / ' + maxSupply.toString()
        const tokenCostInEth = Number(tokenCost) / 1000000000
        const style = {
            '--image-url': ` url(${image})`,
        } as React.CSSProperties
        if (tokenIndex == selectionIndex) {
            // Show that this token IS selected
            return (
                <div
                    className="border-textcol bg-card hover:bg-cardhover box-border flex h-full w-full max-w-52 scale-105 flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-xl">{name}</p>
                            <p className="truncate text-sm">{creator}</p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() + ' ETH'}
                                </p>
                            </div>
                            <p className="text-sm">{supplyIndicator}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (tokenIndex != selectionIndex || selectionIndex == null) {
            //Show that this token IS NOT selected
            return (
                <div
                    className="border-bgcol bg-card hover:bg-cardhover box-border flex h-full w-full max-w-52 flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <div
                        className="aspect-square w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                    />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-xl">{name}</p>
                            <p className="truncate text-sm">{creator}</p>
                        </div>
                        <div className="flex flex-wrap justify-between align-middle">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <p className="text-sm">
                                    {costToDisplay.toString() + ' ETH'}
                                </p>
                            </div>
                            <p className="text-sm">{supplyIndicator}</p>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return <></>
    }
}