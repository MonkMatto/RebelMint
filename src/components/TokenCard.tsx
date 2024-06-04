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
        const { maxSupply, tokenCost } = saleInfo
        const supplyIndicator = availableSupply + ' / ' + maxSupply.toString()
        const tokenCostInEth = Number(tokenCost) / 1000000000
        if (tokenIndex == selectionIndex) {
            // Show that this token IS selected
            return (
                <div
                    className="border-textcol bg-card hover:bg-cardhover box-border flex h-fit w-1/4 max-w-52 flex-1 scale-105 flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <img src={image} className="object-contain" />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-xl">{name}</p>
                            <p className="truncate text-sm">{created_by}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex h-5 flex-row justify-start align-middle">
                                <img
                                    className="aspect-auto h-1/2 invert"
                                    src={icon}
                                />
                                <p className="text-sm">
                                    {tokenCostInEth.toString()}
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
                    className="border-bgcol bg-card hover:bg-cardhover box-border flex h-fit w-1/4 max-w-52 flex-1 flex-col justify-between rounded-lg border-2 p-2 align-middle duration-200"
                    onClick={() => setSelectionIndex(tokenIndex)}
                >
                    <img src={image} className="object-contain" />
                    <div className="flex w-full flex-col">
                        <div className="mb-4 mt-3">
                            <p className="truncate text-xl">{name}</p>
                            <p className="truncate text-sm">{created_by}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex h-5 align-middle">
                                <img
                                    className="aspect-auto h-1/2 invert"
                                    src={icon}
                                />
                                <p className="text-sm">
                                    {tokenCostInEth.toString()}
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
