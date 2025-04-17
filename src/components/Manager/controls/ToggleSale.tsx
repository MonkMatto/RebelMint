// SaleToggle.tsx
import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from 'wagmi'
import contractABI from '../../../contract/abi'
import { RMInfo } from '../../../contract/RMInfo'

interface SaleToggleProps {
    contractAddress: `0x${string}`
    selectionIndex: number
    isTokenSaleActive: boolean
}

export const ToggleSale = ({
    contractAddress,
    selectionIndex,
    isTokenSaleActive,
}: SaleToggleProps) => {
    const { chain } = useAccount()
    const network = RMInfo.getNetworkByChainId(chain?.id as number)
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

    const toggleSale = async () => {
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress,
                functionName: 'updateTokenSaleStatus',
                args: [BigInt(selectionIndex), !isTokenSaleActive],
            })
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={toggleSale}
                disabled={isWriting || isConfirming}
                className={
                    'h-fit w-full rounded-lg border border-base-400 bg-base-800 p-2 text-base-200 hover:bg-base-700 ' +
                    (isWriting || isConfirming
                        ? ' cursor-not-allowed opacity-50'
                        : '')
                }
            >
                {isWriting || isConfirming
                    ? 'Processing...'
                    : isTokenSaleActive
                      ? 'Disable Token Sale'
                      : 'Enable Token Sale'}
            </button>

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
                        <p className="text-green-500">Transaction confirmed!</p>
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
