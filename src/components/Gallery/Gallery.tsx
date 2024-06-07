import { RMTokenCard } from './TokenCard'
import { galleryProps } from '../../contract/versioning/typeInterfacing'

export const RMGallery = ({
    allTokenSaleInfo,
    tokens,
    setSelectionIndex = () => {},
    selectionIndex,
}: galleryProps) => {
    return (
        <div className="grid h-full w-full grid-cols-1 justify-items-center gap-3 overflow-y-auto p-12 align-middle duration-200 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tokens &&
                tokens.map((a, index) => (
                    <RMTokenCard
                        key={index}
                        token={a}
                        tokenIndex={index}
                        saleInfo={allTokenSaleInfo[index]}
                        setSelectionIndex={setSelectionIndex}
                        selectionIndex={selectionIndex}
                    />
                ))}
        </div>
    )
}
