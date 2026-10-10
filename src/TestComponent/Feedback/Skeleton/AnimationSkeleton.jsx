// AnimationSkeleton

// AnimationSkeleton · Skeleton demo

// Description:
// Demonstrates disabling the pulse animation on Skeleton placeholders, providing
// a static visual wireframe when motion is undesirable or reduced motion is preferred.

// Design:
// - Side-by-side or stacked static vs animated skeleton bars
// - Flat neutral fill without pulse animation
// - Full dark mode support

// What it does:
// - Renders a static skeleton placeholder with animation disabled
// - Displays comparison with an active animated skeleton

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AnimationSkeleton from '@/TestComponent/Feedback/Skeleton/AnimationSkeleton';
//
// const MyComponent = () => {
//     return <AnimationSkeleton />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function AnimationSkeleton({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('w-full max-w-md space-y-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div>
                <span className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Static (Animation disabled)
                </span>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            <div>
                <span className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Animated (Pulse active)
                </span>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    )
}

export default AnimationSkeleton
