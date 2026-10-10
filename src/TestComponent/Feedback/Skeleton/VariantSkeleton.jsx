// VariantSkeleton

// VariantSkeleton · Skeleton demo

// Description:
// Demonstrates Skeleton placeholder variants: circular avatar placeholder combined
// with rectangular text line placeholders to simulate a loading user profile.

// Design:
// - Circular skeleton avatar (h-10 w-10 rounded-full)
// - Rectangular skeleton bars with animate-pulse
// - Soft neutral gray-200 (dark:bg-gray-700)
// - Responsive row alignment

// What it does:
// - Renders combined shape skeletons for content loading preview
// - Communicates loading state before data arrives

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import VariantSkeleton from '@/TestComponent/Feedback/Skeleton/VariantSkeleton';
//
// const MyComponent = () => {
//     return <VariantSkeleton />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function VariantSkeleton({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex items-center gap-4 w-full max-w-sm', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    )
}

export default VariantSkeleton
