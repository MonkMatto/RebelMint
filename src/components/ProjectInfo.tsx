import { useState, useRef, useEffect } from 'react'
import TooltipWrapper from './TooltipWrapper'
import { ShieldCheck } from 'lucide-react'

interface ProjectProps {
    title?: string
    creator?: string
    desc?: string
    mintPrice?: number
    imgURL?: string
}
interface InfoProps {
    project: ProjectProps
    explorerUrl: string
}
const OpenMintInfo = ({ project, explorerUrl }: InfoProps) => {
    const { title, creator, desc } = project
    const [descExpanded, setDescExpanded] = useState(false)
    const [needsExpansion, setNeedsExpansion] = useState(false)
    const descRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (descRef.current) {
            // Checking if the content is overflowing
            const needsExpand =
                descRef.current.scrollHeight > descRef.current.clientHeight
            setNeedsExpansion(needsExpand)
        }
    }, [desc])

    return (
        <div
            id="RM-info"
            className="relative flex h-fit w-full flex-col gap-4 overflow-hidden rounded-lg bg-base-850 text-base-50 duration-200"
        >
            <div id="info-header" className="flex flex-col p-4 md:p-6">
                <div className="flex h-fit items-center gap-2">
                    <a
                        href={explorerUrl}
                        target="_blank"
                        className="@5xl:text-3xl @3xl:text-2xl @lg:text-xl @sm:text-md 6xl mb-0 font-extrabold"
                    >
                        {title}
                    </a>
                    <TooltipWrapper
                        tooltip="Verified by RebelMint"
                        position="bottom-right"
                    >
                        <ShieldCheck className="size-6 text-base-400" />
                    </TooltipWrapper>
                </div>
                <h3 className="@5xl:text-xl @3xl:text-xl @lg:text-lg @sm:text-sm font-regular mb-5 text-base-400">
                    {'by ' + creator}
                </h3>
            </div>

            <div className="relative w-full bg-base-800 bg-opacity-30 p-4 md:p-6">
                <div
                    ref={descRef}
                    className={`w-full min-w-[40ch] max-w-[40ch] overflow-y-scroll whitespace-pre-line rounded-md text-base text-base-400 duration-200 ${
                        !descExpanded
                            ? 'line-clamp-4 h-24 overflow-hidden'
                            : 'min-h-24'
                    }`}
                >
                    {desc}
                </div>

                {/* Gradient overlay on collapse, can go if distracting or breaks function */}
                {/* {!descExpanded && needsExpansion && (
                    <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-base-800 to-transparent"></div>
                )} */}

                {needsExpansion && (
                    <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-2 text-sm font-medium text-base-500 hover:text-base-700"
                    >
                        {descExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default OpenMintInfo
