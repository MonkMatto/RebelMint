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
            <h1 className="mb-2 text-5xl">{title}</h1>
            <h3 className="mb-5 text-3xl">{'by ' + creator}</h3>
            <p className="bg-bgcol absolute h-10 max-h-52 truncate text-wrap duration-200 hover:z-10 hover:h-full hover:overflow-y-auto">
                {desc}
            </p>
        </div>
    )
}

export default OpenMintInfo
