import { ArrowUpRightFromSquare } from 'lucide-react'
import opennew from './opennew.svg'

interface PopUpInfoProps {
    selection: {
        name: string
        created_by?: string
        image: string
        description?: string
        attributes?: Array<{
            trait_type: string
            value: string | number
        }>
        external_url?: string
    }
}

export const PopUpInfo = ({ selection }: PopUpInfoProps) => {
    const { name, created_by, description, attributes, external_url } =
        selection

    return (
        <div
            id="OM-popup-token-info"
            className="flex h-full w-full flex-col justify-start gap-4 p-4"
        >
            <div className="flex h-fit w-full flex-nowrap items-center justify-between gap-8 rounded-lg text-base-50">
                <div className="flex h-fit w-3/4 flex-col">
                    <h1 className="w-fit text-3xl font-bold">{name}</h1>
                    {created_by && (
                        <h1 className="w-fit text-lg font-thin text-base-200">
                            by {created_by}
                        </h1>
                    )}
                </div>
                {external_url && (
                    <a
                        href={
                            external_url
                                ? external_url
                                : 'https://rebel-mint.vercel.app'
                        }
                        target="_blank"
                        className="aspect-square h-full"
                    >
                        <ArrowUpRightFromSquare />
                    </a>
                )}
            </div>
            {description && (
                <p className="my-4 max-h-[50svh] overflow-y-auto whitespace-pre-wrap rounded-lg border-base-800 bg-base-700 p-6 text-lg font-light text-base-300">
                    {description}
                </p>
            )}
            <div className="flex h-fit max-h-[20svh] w-full justify-self-end">
                <AllTraits attributes={attributes} />
            </div>
        </div>
    )
}

const AllTraits = ({
    attributes,
}: {
    attributes?: Array<{ trait_type: string; value: string | number }>
}) => {
    if (attributes && attributes[0]) {
        return (
            <div className="mt-auto flex flex-wrap gap-2 justify-self-end overflow-y-auto text-lg">
                {attributes.map((a, index) => (
                    <div
                        key={index}
                        className="flex w-fit gap-2 bg-card px-2 py-1"
                    >
                        <p key={`trait-${index}`}>{a.trait_type + ': '}</p>
                        <p key={`value-${index}`}>{a.value}</p>
                    </div>
                ))}
            </div>
        )
    }
    return null
}
