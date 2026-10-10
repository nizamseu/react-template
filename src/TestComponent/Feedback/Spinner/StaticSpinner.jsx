// StaticSpinner

// StaticSpinner · Spinner demo

// Description:
// Demonstrates pausing or stopping the spinner animation (isSpinning = false),
// showing a static circle indicator for paused or completed processing.

// Design:
// - Static circular track and indicator arc without rotation
// - Interactive toggle button to pause/resume animation
// - Brand blue #2a85ff fill

// What it does:
// - Toggles CSS animate-spin on/off
// - Demonstrates paused state representation

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import StaticSpinner from '@/TestComponent/Feedback/Spinner/StaticSpinner';
//
// const MyComponent = () => {
//     return <StaticSpinner />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function StaticSpinner({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isSpinning, setIsSpinning] = useState(false)

    return (
        <div
            className={cn('flex items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <svg
                className={cn('h-10 w-10 text-[#2a85ff]', isSpinning && 'animate-spin')}
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v8H4z"
                    fill="currentColor"
                />
            </svg>

            <button
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                type="button"
                onClick={() => setIsSpinning((prev) => !prev)}
            >
                {isSpinning ? 'Pause Animation' : 'Start Animation'}
            </button>
        </div>
    )
}

export default StaticSpinner
