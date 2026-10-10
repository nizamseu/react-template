// ColorsProgress

// ColorsProgress · Progress demo

// Description:
// Demonstrates progress bars styled with custom theme colors (such as Red and Green)
// to communicate semantic status like errors, warnings, or successful completion.

// Design:
// - Red-500 fill bar for urgent or low progress (20%)
// - Emerald-500 fill bar for healthy or positive progress (30%)
// - Smooth transitions and clean dark mode track

// What it does:
// - Renders two stacked progress bars with custom accent colors
// - Formats and displays percentage numbers

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ColorsProgress from '@/TestComponent/Feedback/Progress/ColorsProgress';
//
// const MyComponent = () => {
//     return <ColorsProgress />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function ColorsProgress({
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
            <div className="flex items-center gap-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full rounded-full bg-red-500 transition-all duration-300"
                        style={{ width: '20%' }}
                    />
                </div>
                <span className="min-w-[2.5rem] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    20%
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: '30%' }}
                    />
                </div>
                <span className="min-w-[2.5rem] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    30%
                </span>
            </div>
        </div>
    )
}

export default ColorsProgress
