import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
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
interface ControlProps {
    maxCount?: number
    cost?: number
    contractAddress?: `0x${string}`
    selection?: {
        saleInfo: saleInfoProps
        token: tokenProps
    }
    selectionIndex: number
}

const OpenMintControls = ({
    maxCount,
    contractAddress,
    selection,
    selectionIndex,
}: ControlProps) => {
    const { tokenCost, maxSupply, isTokenSaleActive } = selection
        ? selection.saleInfo
        : null
    const { name } = selection ? selection.token : null
    const { writeContractAsync, writeContract, data: hash } = useWriteContract()
    const { open } = useWeb3Modal()
    const { address } = useAccount()
    const userAddress = address as `0x${string}`
    const [count, setCount] = useState(1)
    const minusDisabled = count <= 1 ? true : false
    const plusDisabled = count >= (maxCount ? maxCount : 999999) ? true : false
    const costToDisplay =
        Number(tokenCost) / 1000000000000000000 < 0.000001
            ? '< 0.000001'
            : Number(tokenCost) / 1000000000000000000

    console.log('isTokenSaleActive')
    console.log(isTokenSaleActive)

    const handleMint = async () => {
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress as `0x${string}`,
                functionName: 'mint',
                args: [
                    userAddress as `0x${string}`,
                    BigInt(selectionIndex),
                    BigInt(count),
                ],
                value: tokenCost,
            })
            console.log('Transaction sent successfully')
            console.log(hash)
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    if (!userAddress) {
        // Not signed in
        return (
            <div
                id="OM-controls"
                className="mb-5 flex w-full justify-center gap-5"
            >
                <button
                    className="bg-bgcol hover:bg-bghover w-fit rounded-xl border-[1px] border-white p-5 duration-100 hover:scale-[102%]"
                    onClick={() => {
                        open()
                    }}
                >
                    Connect Wallet To Mint
                </button>
            </div>
        )
    } else if (selectionIndex == undefined) {
        // Nothing Selected
        return (
            <div
                id="OM-controls"
                className="mb-5 flex w-full justify-center gap-5"
            >
                <button
                    className="bg-textcol text-bgcol w-60 rounded-xl p-5 duration-300 ease-in-out hover:invert disabled:invert-[70%]"
                    disabled
                >
                    Mint
                </button>
            </div>
        )
    } else if (!isTokenSaleActive) {
        // Token Sold Out
        return (
            <div
                id="OM-controls"
                className="mb-5 flex w-full justify-center gap-5"
            >
                <button
                    id="OM-minus"
                    disabled={true}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    -
                </button>
                <button
                    id="OM-mint"
                    disabled={true}
                    className="bg-textcol text-bgcol w-60 rounded-xl p-5 duration-300 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    Not For Sale
                </button>
                <button
                    id="OM-plus"
                    disabled={true}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    +
                </button>
            </div>
        )
    } else {
        // Good to mint!
        return (
            <div
                id="OM-controls"
                className="mb-5 flex w-full justify-center gap-5"
            >
                <button
                    id="OM-minus"
                    disabled={minusDisabled}
                    onClick={() => setCount(count - 1)}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    -
                </button>
                <button
                    id="OM-mint"
                    className="bg-textcol text-bgcol w-60 rounded-xl p-5 duration-300 ease-in-out hover:invert"
                    onClick={handleMint}
                >
                    {'Mint ' +
                        (count ? count : '1') +
                        ' ' +
                        name +
                        (count ? (count > 1 ? 's' : '') : '')}
                    <p>{costToDisplay + ' ' + 'ETH'}</p>
                </button>
                <button
                    id="OM-plus"
                    disabled={plusDisabled}
                    onClick={() => setCount(count + 1)}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[50%]"
                >
                    +
                </button>
            </div>
        )
    }
}

export default OpenMintControls
