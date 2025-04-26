import React from 'react'

interface DisplayProps {
    image: string
    animation_url?: string
}

export const Display = ({ image, animation_url }: DisplayProps) => {
    const style = {
        '--image-url': ` url(${image})`,
    } as React.CSSProperties

    const openInNewTab = () => {
        window.open(
            animation_url ? animation_url : image,
            '_blank',
            'noreferrer'
        )
    }

    if (animation_url) {
        return (
            <div
                className="relative flex h-full w-full items-center rounded-lg bg-bgcol"
                onClick={openInNewTab}
            >
                <iframe
                    className="h-full max-h-full w-full"
                    src={animation_url}
                    onClick={openInNewTab}
                ></iframe>
                <div
                    className="hover:curs group absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center duration-100 hover:backdrop-blur-sm"
                    onClick={openInNewTab}
                >
                    <p className="hidden p-2 text-neutral-300 duration-100 group-hover:block group-hover:bg-bgcol">
                        Open Live View
                    </p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="relative flex h-full w-full items-center rounded-lg bg-bgcol">
                <div
                    className="aspect-square h-full w-full bg-[image:var(--image-url)] bg-contain bg-center bg-no-repeat"
                    style={style}
                    onClick={openInNewTab}
                ></div>
                <div
                    className="group absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center duration-100 hover:cursor-pointer hover:backdrop-blur-sm"
                    onClick={openInNewTab}
                >
                    <p className="hidden p-2 duration-100 group-hover:block group-hover:bg-bgcol">
                        Open Live View
                    </p>
                </div>
            </div>
        )
    }
}
