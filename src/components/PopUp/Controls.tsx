import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from 'react'
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import contractABI from '../../contract/abi'
import { ControlProps } from '../../contract/versioning/typeInterfacing'
import erc20ABI from '../../contract/erc20Tools/erc20ABI'

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
    const maxCount = selection ? Number(max_supply) - Number(current_supply) : 0
    const { writeContractAsync, data: hash } = useWriteContract()
    const [isApproved, setIsApproved] = useState(false)
    const [ERC20Allowance, setERC20Allowance] = useState(BigInt(-1))
    const [actionType, setActionType] = useState<string | null>(null)
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
            confirmations: 1,
        })
    const { open } = useWeb3Modal()
    const { address } = useAccount()
    const userAddress = address as `0x${string}`

    const [count, setCount] = useState(1)
    const countIsOverAvailable =
        count <= Number(max_supply) - Number(current_supply)
    // Handle Buttons
    const minusDisabled = count <= 1 ? true : false
    const plusDisabled =
        count >= (maxCount ? maxCount : 999999) && !countIsOverAvailable
            ? true
            : false

    // Handle currency conversions and display optimizations
    const costInCurrency =
        BigInt(token_cost * count) /
        BigInt(10) ** BigInt(currency_details.decimals)
    const costToDisplay =
        costInCurrency < 0.000001 ? '< 0.000001' : costInCurrency

    const handleApproval = async () => {
        await writeContractAsync({
            abi: erc20ABI,
            address: selection.currency_address as `0x${string}`,
            functionName: 'approve',
            args: [
                contractAddress as `0x${string}`,
                BigInt(token_cost * count),
            ],
        })
        console.log('Successfully Approved ERC20 Amount')
        setIsApproved(true)
        setActionType('approval')
    }

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
                value:
                    currency_details.symbol == 'ETH'
                        ? BigInt(token_cost * count)
                        : BigInt(0),
            })
            console.log('Transaction sent successfully')
            console.log(hash)
            setActionType('mint')
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    useEffect(() => {
        if (isApproved) {
            setIsApproved(false)
        }
    }, [isApproved])

    // Check ERC20 allowance
    if (userAddress && currency_details.symbol !== 'ETH') {
        console.log('should run erc20 allowance check')
        const { data: allowance } = useReadContract({
            address: selection.currency_address as `0x${string}`,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [userAddress, contractAddress],
        })
        console.log(allowance ? allowance : '')
        if (ERC20Allowance < 0 && allowance) {
            setERC20Allowance(allowance ? allowance : BigInt(0))
        }
    }

    if (!userAddress) {
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    className="bg-bgcol hover:bg-bghover w-fit rounded-xl border-[1px] border-white p-5 duration-100 hover:scale-[102%]"
                    onClick={() => open()}
                >
                    Connect Wallet To Mint
                </button>
            </div>
        )
    }

    if (selectionIndex === -1) return null

    const commonButtonProps =
        'bg-textcol text-bgcol rounded-xl p-5 duration-150 ease-in-out hover:invert border-2 border-bgcol disabled:invert-[70%]'

    if (!is_token_sale_active) {
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    id="RM-minus"
                    disabled={true}
                    className={commonButtonProps}
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
                    className={commonButtonProps}
                >
                    +
                </button>
            </div>
        )
    }

    if (isConfirming) {
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    id="RM-mint"
                    disabled
                    className="text-bgcol w-60 rounded-xl border-2 border-transparent bg-yellow-200 p-5 font-bold duration-300 ease-in-out"
                >
                    Confirming...
                </button>
            </div>
        )
    }

    if (isConfirmed) {
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    id="RM-mint"
                    disabled={actionType != 'approval'}
                    onClick={() => {
                        if (actionType == 'approval') {
                            handleMint()
                        }
                    }}
                    className="text-bgcol w-60 rounded-xl border-2 border-transparent bg-green-300 p-5 font-bold duration-300 ease-in-out"
                >
                    {actionType === 'approval'
                        ? `Approval Successful! Mint ${count} Token${count > 1 ? 's' : ''}?`
                        : 'Mint Successful!'}
                </button>
            </div>
        )
    }

    const mintButtonText = `Mint ${count} for ${costToDisplay} ${currency_details.symbol}`
    const approveButtonText = `Allow ${costToDisplay} ${currency_details.symbol}`
    const mintButton = (
        <button
            id="RM-mint"
            className="bg-textcol text-bgcol hover:border-bgcol w-60 rounded-xl border-2 border-transparent p-5 font-bold duration-300 ease-in-out hover:invert disabled:hover:border-transparent"
            onClick={handleMint}
        >
            {mintButtonText}
        </button>
    )
    console.log('Approved erc20:' + ERC20Allowance)
    return (
        <div id="RM-controls" className="flex w-full justify-center gap-5">
            <button
                id="RM-minus"
                disabled={minusDisabled}
                onClick={() => setCount(count - 1)}
                className={commonButtonProps}
            >
                -
            </button>
            {currency_details.symbol === 'ETH' ||
            BigInt(ERC20Allowance) >= BigInt(token_cost * count) ? (
                mintButton
            ) : (
                <button
                    id="RM-mint"
                    className="bg-textcol text-bgcol hover:border-bgcol w-60 rounded-xl border-2 border-transparent p-5 font-bold duration-300 ease-in-out hover:invert disabled:hover:border-transparent"
                    onClick={handleApproval}
                >
                    {approveButtonText}
                </button>
            )}
            <button
                id="RM-plus"
                disabled={plusDisabled}
                onClick={() => setCount(count + 1)}
                className={commonButtonProps}
            >
                +
            </button>
        </div>
    )
}
