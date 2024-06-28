import { RMTokenCard } from '../Gallery/TokenCard'
import '../../output.css'
import { galleryProps, tokenStruct } from '../../contract/typeInterfacing'

export const ManagerGallery = ({
    allTokens,
    setSelectionIndex = () => {},
    selectionIndex,
}: galleryProps) => {
    console.log('RMGallery rendered, allTokens length:', allTokens.length)
    return (
        <div className="@sm:grid-cols-1 @md:grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @7xl:grid-cols-5 grid h-fit w-full justify-items-center gap-3 align-middle duration-200">
            {allTokens[0] &&
                allTokens[0].currency_details &&
                allTokens.map((a: tokenStruct, index: number) => {
                    if (index < allTokens.length) {
                        return (
                            <RMTokenCard
                                key={index}
                                token={a}
                                tokenIndex={index}
                                setSelectionIndex={setSelectionIndex}
                                selectionIndex={selectionIndex}
                            />
                        )
                    } else {
                    }
                })}

            <div
                className="box-border flex h-full w-full flex-col justify-start rounded-lg border-2 border-bgcol bg-card p-2 align-middle duration-200 hover:bg-cardhover"
                onClick={() => {
                    console.log('New token button clicked')
                    setSelectionIndex(allTokens.length)
                }}
            >
                <div className="flex aspect-square w-full items-center justify-center rounded-md bg-cardhover">
                    <span className="text-6xl">+</span>
                </div>
                <div className="flex w-full flex-col">
                    <div className="mb-4 mt-3">
                        <p className="truncate text-lg">Create New Token</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
