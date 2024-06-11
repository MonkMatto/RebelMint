import { RMTokenCard } from './TokenCard'
import '../../output.css'
import {
    galleryProps,
    tokenStruct,
} from '../../contract/versioning/typeInterfacing'

export const RMGallery = ({
    allTokens,
    setSelectionIndex = () => {},
    selectionIndex,
}: galleryProps) => {
    return (
        <div className="grid h-fit w-full grid-cols-1 justify-items-center gap-3 overflow-y-auto p-12 align-middle duration-200 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {allTokens &&
                allTokens.map((a: tokenStruct, index: number) => (
                    <RMTokenCard
                        key={index}
                        token={a}
                        tokenIndex={index}
                        setSelectionIndex={setSelectionIndex}
                        selectionIndex={selectionIndex}
                    />
                ))}
        </div>
    )
}
