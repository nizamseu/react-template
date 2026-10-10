// SizeProgress

// SizeProgress · Progress demo

// Description:
// Demonstrates compact size adjustments for progress indicators, featuring a slim
// horizontal progress bar alongside a compact 80px circular progress ring.

// Design:
// - Slim line progress (h-1 / 4px)
// - Compact circular progress ring (width & height 80px)
// - Brand blue #2a85ff fill with dark mode support

// What it does:
// - Adjusts scale of both line and circle indicators
// - Fits compact headers, cards, and dense dashboards

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizeProgress from '@/TestComponent/Feedback/Progress/SizeProgress';
//
// const MyComponent = () => {
//     return <SizeProgress />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

function SvgCircleSmall({ percent = 40, size = 80, strokeWidth = 6 }) {
    const validPercent = Math.min(Math.max(percent, 0), 100)
    const radius = (size - strokeWidth) / 2
    const totalCircumference = 2 * Math.PI * radius
    const strokeDashoffset = totalCircumference * (1 - validPercent / 100)

    return (
        <div
            className="relative flex items-center justify-center shrink-0"
            style={{ height: size, width: size }}
        >
            <svg
                className="h-full w-full -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
            >
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="text-[#2a85ff] transition-all duration-300"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeDasharray={totalCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                />
            </svg>
            <span className="absolute text-xs font-bold text-gray-800 dark:text-gray-100">
                {validPercent}%
            </span>
        </div>
    )
}

export function SizeProgress({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-8 w-full max-w-lg', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex flex-1 items-center gap-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-full rounded-full bg-[#2a85ff] transition-all duration-300"
                        style={{ width: '60%' }}
                    />
                </div>
                <span className="min-w-[2rem] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    60%
                </span>
            </div>

            <SvgCircleSmall percent={40} size={80} />
        </div>
    )
}

export default SizeProgress
