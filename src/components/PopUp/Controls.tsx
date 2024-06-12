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
        current_supply,
        currency_details = {
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: BigInt(18),
        },
    } = selection

    const saleActive = String(is_token_sale_active) == 'true' ? true : false

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
    const countIsOverAvailable =
        count <= Number(max_supply) - Number(current_supply)
    const minusDisabled = count <= 1 ? true : false
    const plusDisabled =
        count >= (maxCount ? maxCount : 999999) && !countIsOverAvailable
            ? true
            : false

    //For Contract v0, ETH token cost is wei, as costToSend
    // While erc20 token cost is in total units, as costToDisplay
    const costInCurrency =
        BigInt(token_cost * count) /
        BigInt(10) ** BigInt(currency_details.decimals)
    const costToDisplay =
        costInCurrency < 0.000001 ? '< 0.000001' : costInCurrency

    console.log('isTokenSaleActive')
    console.log(is_token_sale_active)

    const handleMint = async () => {
        if (currency_details.symbol == 'ETH') {
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
                    value:
                        currency_details.symbol == 'ETH'
                            ? BigInt(token_cost * count)
                            : BigInt(0),
                })
                console.log('Transaction sent successfully')
                console.log(hash)
            } catch (error) {
                console.error('Error sending transaction:', error)
            }
        } else {
            try {
                // Check ERC-20 spending allowance

                // If not enough allowance, allow ERC-20 token spending

                // Mint if allowed
                await writeContractAsync({
                    abi: contractABI,
                    address: contractAddress as `0x${string}`,
                    functionName: 'mint',
                    args: [
                        userAddress as `0x${string}`,
                        BigInt(selectionIndex),
                        BigInt(count),
                    ],
                    value: BigInt(0),
                })
                console.log('Transaction sent successfully')
                console.log(hash)
            } catch (error) {
                console.error('Error sending transaction:', error)
            }
        }
    }

    useEffect(() => {
        // Log the key variables whenever the component renders
        console.log('selection:', selection)
        console.log('is_token_sale_active:', is_token_sale_active)
        console.log('selectionIndex:', selectionIndex)
    }, [selection, is_token_sale_active, selectionIndex])

    if (userAddress) {
        // User wallet is connected
        if (selectionIndex > -1) {
            // Token selected
            console.log('is_token_sale_active:' + Boolean(is_token_sale_active))
            if (!saleActive) {
                // Token Sale Closed
                return (
                    <div
                        id="RM-controls"
                        className="flex w-full justify-center gap-5"
                    >
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
                            className="text-bgcol w-60 rounded-xl bg-red-200 p-5 duration-300 ease-in-out"
                        >
                            Sale Closed
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
                                {(currency_details.symbol === 'ETH'
                                    ? 'Mint '
                                    : `Allow ${currency_details.symbol} for `) +
                                    (count ? count : '1')}
                                <p>
                                    {costToDisplay +
                                        ' ' +
                                        currency_details.symbol}
                                </p>
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
    } else if (!userAddress) {
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
    }
}
