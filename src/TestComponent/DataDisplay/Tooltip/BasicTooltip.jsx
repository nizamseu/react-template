// BasicTooltip

// BasicTooltip · Tooltip demo
// Description:
// Standard hover-triggered informative tooltip overlay with arrow pointer.
// Reveals descriptive hints and supplementary context upon mouse hover or focus.
//
// Design:
// - Dark sleek floating popover (bg-gray-900 text-white text-xs rounded-md shadow-lg)
// - Downward/upward triangular arrow indicator
// - Smooth opacity transition and scale entry
//
// What it does:
// - Shows floating tooltip upon mouse enter
// - Hides gracefully on mouse leave
// - Accessible focus handling
//
// Props:
// - title: string (default: "Tooltip message")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicTooltip from '@/TestComponent/DataDisplay/Tooltip/BasicTooltip';
//
// const MyComponent = () => {
//     return <BasicTooltip title="Tooltip message" />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function BasicTooltip({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Tooltip message',
    variant = 'primary',
    ...props
}) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            className={cn('relative inline-block', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            onMouseEnter={() => !disabled && !loading && setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            {...props}
        >
            <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                type="button"
            >
                Hover me
            </button>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition duration-200">
                    <span>{title}</span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    )
}

export default BasicTooltip;
