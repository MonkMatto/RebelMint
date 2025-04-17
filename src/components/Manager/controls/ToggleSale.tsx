import React, { useState, useEffect } from 'react'
import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from 'wagmi'
import contractABI from '../../../contract/abi'
import { RMInfo } from '../../../contract/RMInfo'
import Toggle from '../../Toggle'

interface SaleToggleProps {
    contractAddress: `0x${string}`
    selectionIndex: number
    isTokenSaleActive: boolean
}

export const ToggleSale = ({
    contractAddress,
    selectionIndex,
    isTokenSaleActive: initialTokenSaleActive,
}: SaleToggleProps) => {
    const { chain } = useAccount()
    const network = RMInfo.getNetworkByChainId(chain?.id as number)
    const [isTokenSaleActive, setIsTokenSaleActive] = useState(
        initialTokenSaleActive
    )

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

    useEffect(() => {
        if (isConfirmed) {
            // Update the toggle state when the transaction is confirmed
            setIsTokenSaleActive((prev) => !prev)
        }
    }, [isConfirmed])

    const toggleSale = async (newStatus: boolean) => {
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress,
                functionName: 'updateTokenSaleStatus',
                args: [BigInt(selectionIndex), newStatus],
            })
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <Toggle
                label="Token Sale Status"
                checked={isTokenSaleActive}
                onChange={(newStatus) => {
                    if (!isWriting && !isConfirming) {
                        toggleSale(newStatus)
                    }
                }}
            />

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
                                rel="noopener noreferrer"
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
