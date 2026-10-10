// BasicSpinner

// BasicSpinner · Spinner demo

// Description:
// Basic usage of an animated loading Spinner. Communicates active background processing
// and operation loading states with a smooth circular rotation.

// Design:
// - Hardware-accelerated CSS animate-spin
// - Brand blue #2a85ff stroke accent
// - Clean SVG circular track and leading indicator arc
// - Size: 32px (h-8 w-8)

// What it does:
// - Renders an animated SVG circular spinner
// - Visual feedback during async operations

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicSpinner from '@/TestComponent/Feedback/Spinner/BasicSpinner';
//
// const MyComponent = () => {
//     return <BasicSpinner />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BasicSpinner({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('inline-flex items-center justify-center', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <svg
                aria-label="Loading..."
                className="h-8 w-8 animate-spin text-[#2a85ff]"
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

export default BasicSpinner
