import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from 'react'
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import contractABI from '../../contract/abi'
import { ControlProps } from '../../contract/typeInterfacing'
import erc20ABI from '../../contract/erc20/erc20ABI'

function removeTrailingZeros(num: number | BigInt | string) {
    // Convert the number to a string
    let str = num.toString()

    // Check if the number contains a decimal point
    if (str.indexOf('.') !== -1) {
        // Remove trailing zeros
        str = str.replace(/\.?0+$/, '')
    }

    return str
}

function divideBigIntByPowerOf10(bigIntValue: BigInt, exponent: number) {
    // Convert BigInt to string
    let strValue = bigIntValue.toString()

    // Calculate the position of the decimal point
    let decimalPosition = strValue.length - exponent

    if (decimalPosition > 0) {
        // Insert decimal point
        return removeTrailingZeros(
            strValue.slice(0, decimalPosition) +
                '.' +
                strValue.slice(decimalPosition)
        )
    } else {
        // Add leading zeros
        return removeTrailingZeros(
            '0.' + '0'.repeat(-decimalPosition) + strValue
        )
    }
}

export const MintButton = ({
    contractAddress,
    selection,
    selectionIndex,
}: ControlProps) => {
    const {
        token_cost,
        max_supply,
        decimals,
        is_token_sale_active,
        current_supply,
        currency_details = {
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: BigInt(18),
        },
        currency_address,
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
        count >= (maxCount ? maxCount : 999999) || !countIsOverAvailable
            ? true
            : false

    // Handle currency conversions and display optimizations
    const costInCurrency = divideBigIntByPowerOf10(
        BigInt(token_cost),
        Number(decimals ? decimals : currency_details.decimals)
    )
    const costToDisplay =
        Number(costInCurrency) < 0.000001 && Number(costInCurrency) != 0
            ? '< 0.000001'
            : costInCurrency

    const handleApproval = async () => {
        await writeContractAsync({
            abi: erc20ABI,
            address: currency_address as `0x${string}`,
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
            address: currency_address as `0x${string}`,
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
                    className="w-full rounded-xl bg-base-50 p-5 text-base-900 duration-100 hover:scale-[102%] hover:bg-base-100"
                    onClick={() => open()}
                >
                    Connect Wallet
                </button>
            </div>
        )
    }

    if (selectionIndex === -1) return null

    if (!is_token_sale_active) {
        return (
            <div id="RM-controls" className="flex w-full justify-center gap-5">
                <button
                    id="RM-mint"
                    disabled={true}
                    className="w-full rounded-xl bg-red-600 p-2 text-base-50 duration-300 ease-in-out"
                >
                    Sale Closed
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
                    className="w-full rounded-xl border-2 border-transparent bg-yellow-200 p-2 font-bold text-bgcol duration-300 ease-in-out"
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
                    className="w-full rounded-xl border-2 border-transparent bg-green-300 p-2 font-bold text-bgcol duration-300 ease-in-out"
                >
                    {actionType === 'approval'
                        ? `Approval Successful! Mint ${count} Token${count > 1 ? 's' : ''}?`
                        : 'Mint Successful!'}
                </button>
            </div>
        )
    }

    let countText
    if (count > maxCount) {
        countText = ' text-red-500'
    } else {
        countText = ' text-base-50'
    }
    const mintButton = (
        <button
            id="RM-mint"
            className="h-fit flex-1 flex-col items-center rounded-xl border-2 border-transparent bg-textcol p-5 text-3xl font-bold text-bgcol duration-300 ease-in-out hover:border-bgcol hover:invert disabled:hover:border-transparent"
            onClick={handleMint}
        >
            {`Mint`}
            <p className="text-xs font-thin">{`${costToDisplay} ${currency_details.symbol}`}</p>
        </button>
    )
    console.log('Approved erc20:' + ERC20Allowance)

    return (
        <div
            id="RM-controls"
            className="flex h-fit w-full items-center justify-center gap-5"
        >
            <div className="flex h-full w-fit flex-nowrap rounded-xl bg-base-700">
                <button
                    id="RM-minus"
                    disabled={minusDisabled}
                    onClick={() => setCount(count - 1)}
                    className="h-full rounded-l-xl p-5 text-base-50 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    -
                </button>

                <input
                    value={count}
                    onChange={(e) => {
                        const value = Number(e.target.value)
                        setCount(value > 0 ? value : 0)
                    }}
                    className={
                        'my-auto h-full w-fit max-w-12 bg-base-700 text-center focus:border-none focus:outline-none' +
                        countText
                    }
                />

                <button
                    id="RM-plus"
                    disabled={plusDisabled}
                    onClick={() => setCount(count + 1)}
                    className="h-full rounded-r-xl p-5 text-base-50 duration-150 ease-in-out hover:invert disabled:invert-[70%]"
                >
                    +
                </button>
            </div>

            {currency_details.symbol === 'ETH' ||
            BigInt(ERC20Allowance) >= BigInt(token_cost * count) ? (
                mintButton
            ) : (
                <button
                    id="RM-mint"
                    className="h-fit flex-1 flex-col items-center rounded-xl border-2 border-transparent bg-textcol p-5 text-3xl font-bold text-bgcol duration-300 ease-in-out hover:border-bgcol hover:invert disabled:hover:border-transparent"
                    onClick={handleApproval}
                >
                    {`Approve`}
                    <p className="text-xs font-thin">{`${costToDisplay} ${currency_details.symbol}`}</p>
                </button>
            )}
        </div>
    )
}
