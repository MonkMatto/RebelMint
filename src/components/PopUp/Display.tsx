import { RebelMintControls } from './Controls'
import { DisplayProps } from '../../contract/typeInterfacing'
import left from './left.svg'
import right from './right.svg'
import close from './close.svg'

export const PopUp = ({
    contractAddress,
    selection,
    selectionIndex,
    setSelectionIndex = () => {},
    numTokens,
}: DisplayProps) => {
    const { name, image, description, attributes, animation_url } = selection
    const style = {
        '--image-url': ` url(${image})`,
    } as React.CSSProperties

    const openInNewTab = () => {
        window.open(
            animation_url ? animation_url : image,
            '_blank',
            'noreferrer'
        )
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
                    className="relative flex h-full w-full items-center rounded-lg bg-bgcol"
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
                <div className="relative flex h-full w-full items-center rounded-lg bg-bgcol">
                    <div
                        className="aspect-square h-full w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
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
            <button
                disabled={selectionIndex - 1 < 0}
                className="bg-base-800 hover:bg-base-700 disabled:bg-base-400 hidden h-24 w-12 items-center justify-center rounded-l-lg lg:flex"
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
                className="flex h-[75svh] w-4/5 flex-col justify-between overflow-y-auto rounded-lg bg-bghover p-5 lg:h-fit"
            >
                <div className="bg-base-800 flex flex-col">
                    <img
                        src={close}
                        className="border-base-700 h-fit w-fit self-end rounded-lg border bg-bghover p-2 text-center hover:cursor-pointer hover:bg-red-600"
                        onClick={() => setSelectionIndex(-1)}
                    />

                    <div
                        id="OM-popup-token-card"
                        className="flex h-full w-full flex-col items-center gap-12 lg:flex-row lg:items-start"
                    >
                        <div className="flex aspect-square w-full items-center justify-center">
                            <Display />
                        </div>
                        <div
                            id="OM-popup-token-info"
                            className="flex h-full w-full flex-col justify-start p-4"
                        >
                            <h1 className="text-2lg mb-8 w-fit text-center font-bold">
                                {name}
                            </h1>
                            <p className="max-h-96 text-wrap font-light">
                                {description}
                            </p>

                            <AllTraits />
                        </div>
                    </div>
                    <div className="mt-5 box-border h-fit justify-self-end p-4">
                        <RebelMintControls
                            selectionIndex={selectionIndex}
                            selection={selection}
                            contractAddress={contractAddress as `0x${string}`}
                        />
                    </div>
                </div>
            </div>
            <button
                disabled={selectionIndex + 1 > numTokens}
                className="bg-base-800 disabled:bg-base-400 hover:bg-base-700 hidden h-24 w-12 items-center justify-center rounded-r-lg lg:flex"
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
