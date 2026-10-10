// LoadingSwitcher

// LoadingSwitcher · Switcher demo

// Description:
// Demonstrates a Switcher with a built-in loading spinner state inside the thumb
// knob that displays during asynchronous state toggling.

// Design:
// - Circular knob embedding a miniature SVG loading spinner during pending transitions
// - Brand blue #2a85ff track when enabled
// - 1-second simulated delay for network toggle
// - Full dark mode support

// What it does:
// - Manages checked and isLoading states
// - Renders animated micro-spinner inside switch thumb during async toggle
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import LoadingSwitcher from '@/TestComponent/Forms/Switcher/LoadingSwitcher';
//
// const MyComponent = () => {
//     return <LoadingSwitcher />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function LoadingSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [checked, setChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = () => {
        if (isLoading || disabled || loading) return
        setIsLoading(true)
        setTimeout(() => {
            setChecked((prev) => !prev)
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading || isLoading}
            className={cn('inline-flex items-center gap-3', className)}
            {...props}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled || loading || isLoading}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    checked ? 'bg-[#2a85ff]' : 'bg-gray-300 dark:bg-gray-600',
                    isLoading && 'cursor-wait opacity-80',
                )}
                onClick={handleToggle}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        checked ? 'translate-x-5' : 'translate-x-0',
                    )}
                >
                    {isLoading && (
                        <svg className="animate-spin h-3 w-3 text-[#2a85ff]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    )}
                </span>
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {isLoading ? 'Updating...' : checked ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    )
}

export default LoadingSwitcher
