import { useAccount, useWriteContract } from 'wagmi'
import contractABI from '../../contract/abi'
import { EditTokenProps } from '../../contract/typeInterfacing'
import close from './close.svg'
import { useState } from 'react'

export const EditTokenPopUp = ({
    contractAddress,
    selection,
    selectionIndex,
    setSelectionIndex = () => {},
}: EditTokenProps) => {
    const {
        name,
        image,
        description,
        attributes,
        created_by,
        animation_url,
        current_supply,
        max_supply,
        currency_details,
    } = selection
    const { address: userAddress } = useAccount()
    const [count, setCount] = useState(1)
    const countIsOverAvailable =
        count <= Number(max_supply) - Number(current_supply)
    // Handle Buttons
    const maxCount = selection ? Number(max_supply) - Number(current_supply) : 0
    const minusDisabled = count <= 1 ? true : false
    const plusDisabled =
        count >= (maxCount ? maxCount : 999999) || !countIsOverAvailable
            ? true
            : false
    const style = {
        '--image-url': ` url(${image})`,
    } as React.CSSProperties
    const { writeContractAsync, data: hash } = useWriteContract()

    const openInNewTab = () => {
        window.open(
            animation_url ? animation_url : image,
            '_blank',
            'noreferrer'
        )
    }

    const toggleSale = async () => {
        try {
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress as `0x${string}`,
                functionName: 'updateTokenSaleStatus',
                args: [BigInt(selectionIndex), !selection.is_token_sale_active],
            })
            console.log('Transaction sent successfully')
            console.log(hash)
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    const handleOwnerMint = async () => {
        try {
            console.log('Minting', selectionIndex, count, 'to ', userAddress)
            await writeContractAsync({
                abi: contractABI,
                address: contractAddress as `0x${string}`,
                functionName: 'mint',
                args: [
                    userAddress as `0x${string}`,
                    BigInt(selectionIndex),
                    BigInt(count),
                ],
            })
            console.log('Transaction sent successfully')
            console.log(hash)
        } catch (error) {
            console.error('Error sending transaction:', error)
        }
    }

    function AllTraits() {
        if (attributes && attributes[0]) {
            return (
                <div className="mt-auto flex flex-wrap gap-2 justify-self-end overflow-y-auto">
                    {attributes.map((a, index) => (
                        <div key={index} className="flex w-fit bg-card p-1">
                            <p key={index}>{a.trait_type + ': '}</p>
                            <p key={index + attributes.length}>{a.value}</p>
                        </div>
                    ))}
                </div>
            )
        }
    }

    function Display() {
        if (animation_url) {
            return (
                <div
                    className="relative flex aspect-square w-full items-center rounded-lg bg-bgcol"
                    onClick={openInNewTab}
                >
                    <iframe
                        className="h-full max-h-full w-full"
                        src={animation_url}
                        onClick={openInNewTab}
                    ></iframe>
                    <div
                        className="hover:curs group absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center duration-100 hover:backdrop-blur-sm"
                        onClick={openInNewTab}
                    >
                        <p className="hidden p-2 text-neutral-300 duration-100 group-hover:block group-hover:bg-bgcol">
                            Open Live View
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="relative flex aspect-square max-h-full w-full items-center rounded-lg bg-bgcol">
                    <div
                        className="aspect-square max-h-full w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                        onClick={openInNewTab}
                    ></div>
                    <div
                        className="group absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center duration-100 hover:cursor-pointer hover:backdrop-blur-sm"
                        onClick={openInNewTab}
                    >
                        <p className="hidden p-2 duration-100 group-hover:block group-hover:bg-bgcol">
                            Open Live View
                        </p>
                    </div>
                </div>
            )
        }
    }

    return (
        <div
            onClick={() => {
                setSelectionIndex(-1)
            }}
            className="sticky inset-0 z-20 flex h-screen w-full items-center justify-center backdrop-blur-sm"
        >
            <div
                id="OM-popup-window"
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="flex h-[90svh] w-[90vw] flex-col justify-between overflow-y-auto rounded-lg bg-bghover p-5 lg:h-fit"
            >
                <div className="flex flex-col bg-base-800">
                    <img
                        src={close}
                        className="h-fit w-fit self-end rounded-lg border border-base-700 bg-bghover p-2 text-center hover:cursor-pointer hover:bg-red-600"
                        onClick={() => setSelectionIndex(-1)}
                    />

                    <div
                        id="OM-popup-token-card"
                        className="flex h-full w-full flex-col items-center gap-12 lg:flex-row lg:items-start"
                    >
                        <div className="flex h-fit w-full flex-col gap-2">
                            <div className="flex aspect-square w-full items-center justify-center">
                                <Display />
                            </div>
                            <div className="mt-5 box-border h-fit justify-self-end">
                                <button
                                    onClick={toggleSale}
                                    className={
                                        'h-fit w-full rounded-lg bg-textcol p-2 text-bgcol ' +
                                        (selection.is_token_sale_active
                                            ? 'bg-red-200'
                                            : 'bg-green-200')
                                    }
                                >
                                    {selection.is_token_sale_active
                                        ? 'Disable Token Sale'
                                        : 'Enable Token Sale'}
                                </button>
                            </div>
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
                                            className="h-full rounded-l-xl p-5 text-base-50 duration-150 ease-in-out hover:text-base-300 disabled:opacity-50"
                                        >
                                            -
                                        </button>

                                        <input
                                            value={count}
                                            onChange={(e) => {
                                                const value = Number(
                                                    e.target.value
                                                )
                                                setCount(value > 0 ? value : 0)
                                            }}
                                            className={`my-auto h-full w-fit max-w-12 bg-base-700 text-center focus:border-none focus:outline-none ${count > maxCount ? 'text-red-500' : 'text-base-50'}`}
                                        />

                                        <button
                                            id="RM-plus"
                                            disabled={plusDisabled}
                                            onClick={() => setCount(count + 1)}
                                            className="h-full rounded-r-xl p-5 text-base-50 duration-150 ease-in-out hover:text-base-300 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    id="RM-mint"
                                    className="h-fit flex-1 flex-col items-center rounded-xl border-2 border-transparent bg-textcol p-1 text-3xl font-bold text-bgcol duration-300 ease-in-out hover:border-bgcol hover:invert disabled:hover:border-transparent"
                                    onClick={handleOwnerMint}
                                >
                                    {`Owner Mint`}
                                    <p className="text-xs font-thin">{`0 ${currency_details?.symbol}`}</p>
                                </button>
                            </div>
                        </div>
                        <div
                            id="OM-popup-token-info"
                            className="flex h-full w-full flex-col justify-start p-4"
                        >
                            <div className="h-fit w-full flex-col gap-8 rounded-lg bg-base-50 p-6 text-base-950">
                                <h1 className="w-fit text-3xl font-bold">
                                    {name}
                                </h1>
                                {created_by && (
                                    <h1 className="w-fit text-lg font-thin">
                                        {created_by}
                                    </h1>
                                )}
                            </div>
                            <p className="my-4 max-h-[50svh] overflow-y-auto text-wrap rounded-lg border-base-800 bg-base-950 p-6 font-light">
                                {description}
                            </p>
                            <div className="flex h-fit max-h-[20svh] w-full justify-self-end">
                                <AllTraits />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
