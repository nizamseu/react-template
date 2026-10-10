// DefaultOpenTooltip

// DefaultOpenTooltip · Tooltip demo
// Description:
// Tooltip component rendered in an initially open or persistently pinned state.
// Ideal for onboarding tours, initial feature announcements, or walkthrough spotlights.
//
// Design:
// - Persistently visible tooltip bubble pinned over target element
// - Sleek dark container (bg-gray-900) with arrow indicator
// - Interactive close button to dismiss the hint
//
// What it does:
// - Displays open tooltip immediately upon mounting
// - Allows user to dismiss or toggle visibility
//
// Props:
// - title: string (default: "Always visible initial hint")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DefaultOpenTooltip from '@/TestComponent/DataDisplay/Tooltip/DefaultOpenTooltip';
//
// const MyComponent = () => {
//     return <DefaultOpenTooltip />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DefaultOpenTooltip({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Welcome! Start exploring your dashboard here.',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div
            className={cn('relative inline-block pt-10', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                Target Element (Default Open)
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 py-1.5 pl-3 pr-2 text-xs font-medium text-white shadow-xl">
                    <div className="flex items-center gap-2">
                        <span>{title}</span>
                        <button
                            aria-label="Dismiss tooltip"
                            className="rounded p-0.5 text-gray-400 hover:text-white"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            <HiX className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    )
}

export default DefaultOpenTooltip;
