import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from 'react'
import {
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import contractABI from '../../contract/abi'
import { ControlProps } from '../../contract/versioning/typeInterfacing'

export const RebelMintControls = ({
    contractAddress,
    selection,
    selectionIndex,
}: ControlProps) => {
    const {
        token_cost,
        max_supply,
        is_token_sale_active,
        name,
        current_supply,
    } = selection ? selection : null
    const maxCount = selection ? Number(max_supply) - Number(current_supply) : 0
    const { writeContractAsync, data: hash } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })
    const { open } = useWeb3Modal()
    const { address } = useAccount()
    const userAddress = address as `0x${string}`
    const [count, setCount] = useState(1)
    const minusDisabled = count <= 1 ? true : false
    const plusDisabled = count >= (maxCount ? maxCount : 999999) ? true : false
    const valueInEth = Number(token_cost) / 1000000000000000000
    const costToDisplay =
        Number(token_cost) / 1000000000000000000 < 0.000001
            ? '< 0.000001'
            : Number(token_cost) / 1000000000000000000

    console.log('isTokenSaleActive')
    console.log(is_token_sale_active)

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
                value: BigInt(token_cost * count),
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
            <div id="RM-controls" className="flex w-full justify-center gap-5">
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
    } else if (selectionIndex < 0) {
        // Nothing Selected
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    className="bg-textcol text-bgcol w-60 rounded-xl p-5 duration-300 ease-in-out hover:invert disabled:invert-[70%]"
                    disabled
                >
                    Mint
                </button>
            </div>
        )
    } else if (!is_token_sale_active) {
        // Token Sold Out
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    id="RM-minus"
                    disabled={true}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    -
                </button>
                <button
                    id="RM-mint"
                    disabled={true}
                    className="bg-textcol text-bgcol w-60 rounded-xl p-5 duration-300 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    Not For Sale
                </button>
                <button
                    id="RM-plus"
                    disabled={true}
                    className="bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    +
                </button>
            </div>
        )
    } else {
        // Good to mint!
        if (isConfirming) {
            return (
                <div
                    id="RM-controls"
                    className="flex w-full justify-center gap-5"
                >
                    <button
                        id="RM-mint"
                        disabled
                        className="text-bgcol w-60 rounded-xl border-2 border-transparent bg-yellow-200 p-5 font-bold duration-300 ease-in-out"
                    >
                        Confirming...
                    </button>
                </div>
            )
        } else if (isConfirmed) {
            return (
                <div
                    id="RM-controls"
                    className="flex w-full justify-center gap-5"
                >
                    <button
                        id="RM-mint"
                        disabled
                        className="text-bgcol w-60 rounded-xl border-2 border-transparent bg-green-300 p-5 font-bold duration-300 ease-in-out"
                    >
                        Mint Successful!
                    </button>
                </div>
            )
        } else {
            return (
                <div
                    id="RM-controls"
                    className="flex w-full justify-center gap-5"
                >
                    <button
                        id="RM-minus"
                        disabled={minusDisabled}
                        onClick={() => setCount(count - 1)}
                        className="bg-textcol text-bgcol hover:border-bgcol rounded-xl border-2 border-transparent p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%] disabled:hover:border-transparent"
                    >
                        -
                    </button>

                    <button
                        id="RM-mint"
                        className="bg-textcol text-bgcol hover:border-bgcol w-60 rounded-xl border-2 border-transparent p-5 font-bold duration-300 ease-in-out hover:invert disabled:hover:border-transparent"
                        onClick={handleMint}
                    >
                        {'Mint ' + (count ? count : '1')}
                        <p>{costToDisplay + ' ' + 'ETH'}</p>
                    </button>

                    <button
                        id="RM-plus"
                        disabled={plusDisabled}
                        onClick={() => setCount(count + 1)}
                        className="bg-textcol text-bgcol hover:border-bgcol rounded-xl border-2 border-transparent p-5 duration-150 ease-in-out hover:invert disabled:invert-[70%] disabled:hover:border-transparent"
                    >
                        +
                    </button>
                </div>
            )
        }
    }
}
