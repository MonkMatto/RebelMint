import { RMTokenCard } from './TokenCard'
import '../../output.css'
import { galleryProps, tokenStruct } from '../../contract/typeInterfacing'

export const RMGallery = ({
    allTokens,
    setSelectionIndex = () => {},
    selectionIndex,
}: galleryProps) => {
    return (
        <div className="@sm:grid-cols-1 @md:grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @7xl:grid-cols-5 grid h-fit w-full justify-items-center gap-3 overflow-y-auto p-4 align-middle duration-200 md:p-12">
            <>
                <span className="col-span-full justify-self-start rounded-md border border-base-800 bg-red-950 px-2 py-1 text-left text-sm text-base-300">
                    Only interact with token content if you trust the creator -
                    RebelMint has no verification or control over token content.
                </span>
                {allTokens &&
                    allTokens[0] &&
                    allTokens.map((a: tokenStruct, index: number) => (
                        <RMTokenCard
                            key={index}
                            token={a}
                            tokenIndex={index}
                            setSelectionIndex={setSelectionIndex}
                            selectionIndex={selectionIndex}
                        />
                    ))}
            </>
        </div>
    )
}
