import badge from '../assets/badge.svg'

interface ProjectProps {
    title?: string
    creator?: string
    desc?: string
    mintPrice?: number
    imgURL?: string
}
interface InfoProps {
    project: ProjectProps
}
const OpenMintInfo = ({ project }: InfoProps) => {
    const { title, creator, desc } = project
    return (
        <div
            id="OM-info"
            className="relative h-fit w-full rounded-lg p-12 duration-200"
        >
            <div className="flex h-fit items-start">
                <h1 className="@5xl:text-5xl @3xl:text-3xl @lg:text-xl @sm:text-md 6xl mb-0 font-extrabold">
                    {title}
                </h1>
                <img src={badge} className="invert-[80%]"></img>
            </div>
            <h3 className="@5xl:text-3xl @3xl:text-xl @lg:text-lg @sm:text-sm font-regular mb-5">
                {'by ' + creator}
            </h3>
            <p className="bg-bgcol @5xl:text-2xl @3xl:text-lg @sm:text-sm absolute h-10 max-h-52 w-fit truncate text-wrap duration-200 hover:z-10 hover:h-fit hover:overflow-y-auto">
                {desc}
            </p>
        </div>
    )
}

export default OpenMintInfo
