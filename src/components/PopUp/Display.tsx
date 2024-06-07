import { RebelMintControls } from './Controls'
import { DisplayProps } from '../../contract/versioning/typeInterfacing'

export const PopUp = ({
    contractAddress,
    selection,
    selectionIndex,
    setSelectionIndex = () => {},
    numTokens,
}: DisplayProps) => {
    const { name, image, description, attributes, animation_url } =
        selection.token
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
                        <div key={index} className="bg-card flex w-fit p-1">
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
                    className="bg-bgcol relative flex aspect-square max-h-full w-full items-center rounded-lg md:w-1/2"
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
                        <p className="group-hover:bg-bgcol hidden p-2 text-neutral-300 duration-100 group-hover:block">
                            Open Live View
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="bg-bgcol relative flex aspect-square max-h-full w-full items-center rounded-lg md:w-1/2">
                    <div
                        className="aspect-square max-h-full w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                        style={style}
                        onClick={openInNewTab}
                    ></div>
                    <div
                        className="group absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center duration-100 hover:cursor-pointer hover:backdrop-blur-sm"
                        onClick={openInNewTab}
                    >
                        <p className="group-hover:bg-bgcol hidden p-2 duration-100 group-hover:block">
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
            <button
                disabled={selectionIndex - 1 < 0}
                className="bg-bgcol hover:bg-bghover disabled:bg-bgcol h-24 w-12 rounded-l-lg disabled:invert-[70%]"
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectionIndex(selectionIndex - 1)
                }}
            >
                {'<'}
            </button>
            <div
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="bg-bghover relative flex h-4/5 w-4/5 flex-col justify-between rounded-lg p-5"
            >
                <p
                    className="hover:bg-cardhover bg-bghover absolute right-0 top-[-5%] z-0 aspect-[4/1] h-fit rounded-t-lg p-2 text-center hover:cursor-pointer"
                    onClick={() => setSelectionIndex(-1)}
                >
                    X
                </p>
                <div
                    id="OM-popup-token-card"
                    className="flex h-3/4 w-full flex-col gap-12 md:flex-row"
                >
                    <Display />
                    <div
                        id="OM-popup-token-info"
                        className="flex h-full flex-col justify-start md:w-1/2"
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
                <div className="mt-5 box-border h-fit justify-self-end">
                    <RebelMintControls
                        selectionIndex={selectionIndex}
                        selection={selection}
                        contractAddress={contractAddress as `0x${string}`}
                    />
                </div>
            </div>
            <button
                disabled={selectionIndex + 1 > numTokens}
                className="bg-bgcol hover:bg-bghover disabled:bg-bgcol h-24 w-12 rounded-r-lg disabled:invert-[70%]"
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectionIndex(selectionIndex + 1)
                }}
            >
                {'>'}
            </button>
        </div>
    )
}
