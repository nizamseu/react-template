// SizeSpinner

// SizeSpinner · Spinner demo

// Description:
// Demonstrates loading Spinners rendered across multiple dimensions:
// small (30px), medium (40px), and large (52px).

// Design:
// - Row layout with graduated scale (h-7, h-10, h-13)
// - Brand blue #2a85ff stroke
// - Responsive gap spacing

// What it does:
// - Displays 3 distinct spinner scales
// - Fits inline buttons, cards, or full page overlays

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizeSpinner from '@/TestComponent/Feedback/Spinner/SizeSpinner';
//
// const MyComponent = () => {
//     return <SizeSpinner />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SizeSpinner({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex items-center gap-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Small (30px) */}
            <svg
                className="h-[30px] w-[30px] animate-spin text-[#2a85ff]"
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

            {/* Medium (40px) */}
            <svg
                className="h-[40px] w-[40px] animate-spin text-[#2a85ff]"
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

            {/* Large (52px) */}
            <svg
                className="h-[52px] w-[52px] animate-spin text-[#2a85ff]"
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
        </div>
    )
}

export default SizeSpinner
