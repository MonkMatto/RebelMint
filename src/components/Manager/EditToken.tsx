import { useWriteContract } from 'wagmi'
import contractABI from '../../contract/abi'
import { EditTokenProps } from '../../contract/typeInterfacing'

export const EditTokenPopUp = ({
    contractAddress,
    selection,
    selectionIndex,
    setSelectionIndex = () => {},
}: EditTokenProps) => {
    const { name, image, description, attributes, animation_url } = selection
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
            className="absolute z-20 flex h-full w-full items-center justify-center backdrop-blur-sm"
        >
            <div
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="relative flex h-4/5 w-4/5 flex-col justify-between rounded-lg bg-bghover p-5"
            >
                <p
                    className="absolute right-0 top-[-5%] z-0 h-fit rounded-t-lg bg-bghover p-2 text-center hover:cursor-pointer hover:bg-cardhover"
                    onClick={() => setSelectionIndex(-1)}
                >
                    X
                </p>
                <div
                    id="OM-popup-token-card"
                    className="@md:flex-col flex h-3/4 w-full flex-row flex-nowrap gap-12"
                >
                    <Display />
                    <div
                        id="OM-popup-token-info"
                        className="flex h-full flex-col justify-start"
                    >
                        <h1 className="mb-8 text-center text-2xl font-bold">
                            {name}
                        </h1>
                        <p className="max-h-96 overflow-y-auto text-wrap font-light">
                            {description}
                        </p>

                        <AllTraits />
                    </div>
                </div>
                <div className="mt-5 box-border flex h-fit items-center justify-center justify-self-end">
                    <button
                        onClick={toggleSale}
                        className="h-fit w-fit rounded-lg bg-textcol p-5 text-bgcol"
                    >
                        {selection.is_token_sale_active
                            ? 'Disable Token Sale'
                            : 'Enable Token Sale'}
                    </button>
                </div>
            </div>
        </div>
    )
}
