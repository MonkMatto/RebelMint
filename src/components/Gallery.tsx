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
        <div className="flex h-full w-full flex-wrap gap-5 overflow-y-auto p-12 duration-200">
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
