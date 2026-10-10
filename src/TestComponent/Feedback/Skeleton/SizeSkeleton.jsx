// SizeSkeleton

// SizeSkeleton · Skeleton demo

// Description:
// Demonstrates customized dimensions for Skeleton components, constructing a full
// media card mockup with custom height image banner, avatar circle, and multi-width text rows.

// Design:
// - Top banner skeleton block (h-36 / ~150px)
// - Avatar circle skeleton (h-9 w-9)
// - Multi-width body rows (100% and 60% widths)
// - Contained card layout (max-w-[300px]) with soft pulsing animation

// What it does:
// - Renders a mock content card with custom dimensions
// - Simulates rich card placeholder during asynchronous data fetching

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizeSkeleton from '@/TestComponent/Feedback/Skeleton/SizeSkeleton';
//
// const MyComponent = () => {
//     return <SizeSkeleton />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SizeSkeleton({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex w-full max-w-[300px] flex-col gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Top Media Banner */}
            <div className="h-36 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

            {/* Author / Metadata Row */}
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="h-2.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2.5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
        </div>
    )
}

export default SizeSkeleton
