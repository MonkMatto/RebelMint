import { TokenCard } from './TokenCard'

interface galleryProps {
    project: object
    tokens: []
    setSelectionIndex: (p: number) => void
    selectionIndex: number
}

export const OMGallery = ({
    project,
    tokens,
    setSelectionIndex = () => {},
    selectionIndex,
}: galleryProps) => {
    return (
        <div className="grid h-full w-full grid-cols-2 gap-5 overflow-y-auto p-12 duration-200 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tokens &&
                tokens.map((a, index) => (
                    <TokenCard
                        key={index}
                        token={a}
                        tokenIndex={index}
                        saleInfo={project.allTokens[index]}
                        setSelectionIndex={setSelectionIndex}
                        selectionIndex={selectionIndex}
                    />
                ))}
        </div>
    )
}
