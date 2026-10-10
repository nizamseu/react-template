// ColorSpinner

// ColorSpinner · Spinner demo

// Description:
// Demonstrates applying custom color styles to the Spinner component,
// using Tailwind color utilities (Amber, Emerald, and Brand Blue).

// Design:
// - Row layout with multiple color treatments
// - 40px dimensions
// - Full dark mode support

// What it does:
// - Renders spinners with semantic color themes
// - Communicates progress status (warning, success, brand)

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ColorSpinner from '@/TestComponent/Feedback/Spinner/ColorSpinner';
//
// const MyComponent = () => {
//     return <ColorSpinner />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function ColorSpinner({
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
            {/* Amber Spinner */}
            <svg
                className="h-10 w-10 animate-spin text-amber-500"
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

            {/* Emerald Spinner */}
            <svg
                className="h-10 w-10 animate-spin text-emerald-500"
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

            {/* Brand Blue Spinner */}
            <svg
                className="h-10 w-10 animate-spin text-[#2a85ff]"
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

export default ColorSpinner
