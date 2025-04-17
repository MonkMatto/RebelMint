// OwnerMintControls.tsx
import { useState } from 'react'
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi'
import contractABI from '../../../contract/abi'
import { RMInfo } from '../../../contract/RMInfo'

interface OwnerMintControlsProps {
    contractAddress: `0x${string}`
    selectionIndex: number
    maxSupply: number
    currentSupply: number
    currencySymbol?: string
}

export const OwnerMintControls = ({
    contractAddress,
    selectionIndex,
    maxSupply,
    currentSupply,
    currencySymbol,
}: OwnerMintControlsProps) => {
    const { address: userAddress, chain } = useAccount()

    const network = RMInfo.getNetworkByChainId(chain?.id as number)
    const [count, setCount] = useState(1)

    const {
        writeContractAsync,
        data: hash,
        isPending: isWriting,
        error: writeError,
    } = useWriteContract()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash,
    })

    const maxCount = maxSupply - currentSupply
    const countIsOverAvailable = count <= maxCount
    const minusDisabled = count <= 1 || isWriting || isConfirming
    const plusDisabled =
        count >= (maxCount ? maxCount : 999999) ||
        !countIsOverAvailable ||
        isWriting ||
        isConfirming

    const handleOwnerMint = async () => {
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress,
                functionName: 'ownerMint',
                args: [
                    userAddress as `0x${string}`,
                    BigInt(selectionIndex),
                    BigInt(count),
                ],
            })
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div
                id="owner-mint"
                className="flex flex-nowrap items-center gap-2"
            >
                <div
                    id="owner-mint-controls"
                    className="flex h-fit w-fit items-center justify-center gap-5"
                >
                    <div className="flex h-full w-fit flex-nowrap rounded-xl bg-base-700">
                        <button
                            id="RM-minus"
                            disabled={minusDisabled}
                            onClick={() => setCount(count - 1)}
                            className="h-full rounded-l-xl p-5 text-base-50 duration-150 ease-in-out hover:text-base-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            -
                        </button>

                        <input
                            value={count}
                            disabled={isWriting || isConfirming}
                            onChange={(e) => {
                                const value = Number(e.target.value)
                                setCount(value > 0 ? value : 0)
                            }}
                            className={`my-auto h-full w-fit max-w-12 bg-base-700 text-center focus:border-none focus:outline-none disabled:opacity-50 ${
                                count > maxCount
                                    ? 'text-red-500'
                                    : 'text-base-50'
                            }`}
                        />

                        <button
                            id="RM-plus"
                            disabled={plusDisabled}
                            onClick={() => setCount(count + 1)}
                            className="h-full rounded-r-xl p-5 text-base-50 duration-150 ease-in-out hover:text-base-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    id="RM-mint"
                    disabled={isWriting || isConfirming}
                    className="h-fit flex-1 flex-col items-center rounded-xl border-2 border-transparent bg-textcol p-1 text-3xl font-bold text-base-800 duration-300 ease-in-out hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent"
                    onClick={handleOwnerMint}
                >
                    {isWriting || isConfirming ? 'Processing...' : 'Owner Mint'}
                    <p className="text-xs font-thin">{`0 ${currencySymbol}`}</p>
                </button>
            </div>

            {(isWriting ||
                isConfirming ||
                isConfirmed ||
                writeError ||
                receiptError) && (
                <div className="min-h-6 text-sm">
                    {isWriting && (
                        <p className="text-yellow-500">
                            Waiting for wallet confirmation...
                        </p>
                    )}
                    {isConfirming && (
                        <div>
                            <p className="text-yellow-500">
                                Transaction submitted: {hash}
                            </p>
                            <a
                                target="_blank"
                                href={`${network?.explorer}/tx/${hash}`}
                            >
                                View on explorer
                            </a>
                        </div>
                    )}
                    {isConfirmed && (
                        <p className="text-green-500">
                            Mint successful! Transaction confirmed.
                        </p>
                    )}
                    {writeError && (
                        <p className="text-red-500">
                            Error: {writeError.message}
                        </p>
                    )}
                    {receiptError && (
                        <p className="text-red-500">
                            Error: {receiptError.message}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
