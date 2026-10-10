// LineProgress

// LineProgress · Progress demo

// Description:
// Standard linear progress bar indicating the completion percentage of an operation.
// Displays a smooth horizontal fill bar with trailing percentage text.

// Design:
// - Track bar: bg-gray-200 dark:bg-gray-700, rounded-full
// - Fill bar: Brand blue #2a85ff with smooth width transition
// - Trailing percentage label in text-xs font-semibold
// - Full dark mode support

// What it does:
// - Renders a horizontal progress bar based on percent prop (default 30%)
// - Clamps value between 0 and 100

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - percent: number (default: 30)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import LineProgress from '@/TestComponent/Feedback/Progress/LineProgress';
//
// const MyComponent = () => {
//     return <LineProgress percent={45} />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function LineProgress({
    className,
    disabled = false,
    loading = false,
    percent = 30,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const validPercent = Math.min(Math.max(percent, 0), 100)

    return (
        <div
            className={cn('flex w-full max-w-md items-center gap-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className="h-full rounded-full bg-[#2a85ff] transition-all duration-300"
                    style={{ width: `${validPercent}%` }}
                />
            </div>
            <span className="min-w-[2.5rem] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                {validPercent}%
            </span>
        </div>
    )
}

export default LineProgress
