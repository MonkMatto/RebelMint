import badge from '../assets/badge.svg'
import { useState } from 'react'

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
    const [descToggled, setDescToggled] = useState(false)
    const descHeight = descToggled ? ' h-[50svh] md:h-64' : ' h-24'
    return (
        <div
            id="OM-info"
            className="bg-base-50 text-base-950 relative mt-8 h-fit w-full rounded-lg p-4 duration-200 md:p-12"
        >
            <div className="flex h-fit items-start">
                <a
                    href={explorerUrl}
                    target="_blank"
                    className="@5xl:text-5xl @3xl:text-3xl @lg:text-xl @sm:text-md 6xl mb-0 font-extrabold"
                >
                    {title}
                </a>
                <img src={badge} className="invert-[10%]"></img>
            </div>
            <h3 className="@5xl:text-3xl @3xl:text-xl @lg:text-lg @sm:text-sm font-regular mb-5">
                {'by ' + creator}
            </h3>
            <div
                onMouseEnter={() => setDescToggled(true)}
                onMouseLeave={() => setDescToggled(false)}
                className={
                    '@5xl:text-2xl @3xl:text-lg @sm:text-sm bg-base-50 border-base-100 text-base-950 w-fit overflow-y-scroll text-wrap rounded-md border p-4 duration-200' +
                    descHeight
                }
            >
                {desc}
            </div>
        </div>
    )
}

export default OpenMintInfo
