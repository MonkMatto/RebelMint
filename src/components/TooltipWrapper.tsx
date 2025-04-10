'use client'
import React, { ReactNode, useState, useRef, useEffect } from 'react'

type TooltipPosition =
    | 'top'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'

interface TooltipWrapperProps {
    children: ReactNode
    tooltip: ReactNode
    position?: TooltipPosition
    delay?: number
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    tooltip,
    position = 'top',
    delay = 0,
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleMouseEnter = () => {
        if (delay === 0) {
            setIsVisible(true)
            return
        }

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, delay)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsVisible(false)
    }

    const getTooltipPositionClass = (): string => {
        switch (position) {
            case 'left':
                return 'right-full top-1/2 -translate-y-1/2 mr-2'
            case 'right':
                return 'left-full top-1/2 -translate-y-1/2 ml-2'
            case 'top-left':
                return 'bottom-full left-0 mb-2'
            case 'top-right':
                return 'bottom-full right-0 mb-2'
            case 'bottom':
                return 'top-full left-1/2 -translate-x-1/2 mt-2'
            case 'bottom-right':
                return 'top-full right-0 mt-2'
            case 'bottom-left':
                return 'top-full left-0 mt-2'
            default: // top
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
        }
    }

    const getTooltipArrowPositionClass = (): string => {
        switch (position) {
            case 'left':
                return 'left-full top-1/2 -translate-y-1/2 border-l-base-700 '
            case 'right':
                return 'right-full top-1/2 -translate-y-1/2 border-r-base-700 '
            case 'top-left':
                return 'top-full left-2 border-t-base-700 '
            case 'top-right':
                return 'top-full right-2 border-t-base-700 '
            case 'bottom':
                return 'bottom-full left-1/2 -translate-x-1/2 border-b-base-700 '
            case 'bottom-right':
                return 'bottom-full right-2 border-b-base-700 '
            case 'bottom-left':
                return 'bottom-full left-2 border-b-base-700 '
            default: // top
                return 'top-full left-1/2 -translate-x-1/2 border-t-base-700 '
        }
    }

    return (
        <span
            className="relative inline items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {tooltip && (
                <div
                    className={`pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'} absolute z-[99] whitespace-nowrap rounded-lg bg-base-700 px-3 py-2 text-sm font-medium text-white transition-opacity duration-150 ${getTooltipPositionClass()}`}
                >
                    {tooltip}
                    <div
                        className={`absolute border-4 border-transparent ${getTooltipArrowPositionClass()}`}
                    ></div>
                </div>
            )}
        </span>
    )
}

export default TooltipWrapper
