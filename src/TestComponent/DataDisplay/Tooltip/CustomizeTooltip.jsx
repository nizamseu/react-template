// CustomizeTooltip

// CustomizeTooltip · Tooltip demo
// Description:
// Tooltip component rendering rich customized HTML content and icons.
// Provides informative tooltips containing formatted text, shortcuts, or status badges.
//
// Design:
// - Rich popover container with styled inline badges and highlighted text
// - High-contrast dark background (bg-gray-900)
// - Pointer arrow aligned with trigger
//
// What it does:
// - Renders complex HTML within tooltip title container
// - Supports icons and custom formatting
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import CustomizeTooltip from '@/TestComponent/DataDisplay/Tooltip/CustomizeTooltip';
//
// const MyComponent = () => {
//     return <CustomizeTooltip />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomizeTooltip({
    className,
    disabled = false,
    loading = false,
    size = 'md',
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
                Rich HTML Tooltip
            </button>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 min-w-48 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl">
                    <div className="flex items-center gap-1.5 font-semibold text-yellow-400">
                        <HiOutlineSparkles className="h-4 w-4" />
                        <span>Pro Tip &amp; Shortcut</span>
                    </div>
                    <p className="mt-1 leading-snug text-gray-300">
                        Press <kbd className="rounded bg-gray-700 px-1 py-0.5 text-[10px] font-mono text-white">⌘ + K</kbd> to open quick commands.
                    </p>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    )
}

export default CustomizeTooltip;
