import { DisplayProps } from '../../contract/typeInterfacing'
import left from './left.svg'
import right from './right.svg'
import close from './close.svg'
import { Display } from './Display'
import { PopUpInfo } from './PopUpInfo'
import { OwnerMintControls } from '../Manager/controls/OwnerMint'
import { ToggleSale } from '../Manager/controls/ToggleSale'

export interface ManagerDisplayProps extends DisplayProps {
    isOwner?: boolean
}

export const ManagerPopUp = ({
    contractAddress,
    selection,
    selectionIndex,
    setSelectionIndex = () => {},
    numTokens,
    isOwner = false,
}: ManagerDisplayProps) => {
    if (selectionIndex === -1) return null

    const {
        max_supply,
        current_supply,
        is_token_sale_active,
        currency_details = {
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: BigInt(18),
        },
    } = selection

    return (
        <div
            onClick={() => {
                setSelectionIndex(-1)
            }}
            className="sticky inset-0 z-20 flex h-screen w-full items-center justify-center backdrop-blur-sm"
        >
            <button
                disabled={selectionIndex - 1 < 0}
                className="hidden h-24 w-12 items-center justify-center rounded-l-lg bg-base-800 hover:bg-base-700 disabled:bg-base-400 lg:flex"
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectionIndex(selectionIndex - 1)
                }}
            >
                <img src={left} />
            </button>
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
                        <div className="flex h-fit w-full flex-col">
                            <div className="flex aspect-square w-full items-center justify-center">
                                <Display
                                    image={selection.image}
                                    animation_url={selection.animation_url}
                                />
                            </div>
                            {isOwner && (
                                <div className="mt-5 box-border flex h-fit flex-col gap-4">
                                    <ToggleSale
                                        contractAddress={
                                            contractAddress as `0x${string}`
                                        }
                                        selectionIndex={selectionIndex}
                                        isTokenSaleActive={is_token_sale_active}
                                    />
                                    <OwnerMintControls
                                        contractAddress={
                                            contractAddress as `0x${string}`
                                        }
                                        selectionIndex={selectionIndex}
                                        maxSupply={Number(max_supply)}
                                        currentSupply={Number(current_supply)}
                                        currencySymbol={currency_details.symbol}
                                    />
                                </div>
                            )}
                        </div>
                        <PopUpInfo selection={selection} />
                    </div>
                </div>
            </div>
            <button
                disabled={selectionIndex + 1 > numTokens}
                className="hidden h-24 w-12 items-center justify-center rounded-r-lg bg-base-800 hover:bg-base-700 disabled:bg-base-400 lg:flex"
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectionIndex(selectionIndex + 1)
                }}
            >
                <img src={right} />
            </button>
        </div>
    )
}
