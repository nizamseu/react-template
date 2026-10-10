// DynamicProgress

// DynamicProgress · Progress demo

// Description:
// Demonstrates dynamically controlled progress indicators with interactive increment (+)
// and decrement (-) buttons, updating both linear and circular indicators concurrently.

// Design:
// - Step action buttons (- / +) in compact pill group
// - Synchronized linear progress bar and circular progress ring
// - Brand blue #2a85ff active fill
// - Full dark mode support

// What it does:
// - Manages percentage state (default 20%, clamped 0-100)
// - Increases or decreases by 10% on button click
// - Re-renders animated SVG circle and linear fill

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DynamicProgress from '@/TestComponent/Feedback/Progress/DynamicProgress';
//
// const MyComponent = () => {
//     return <DynamicProgress />
// }
// ```

'use client'

import { useState } from 'react';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

function SvgCircleDynamic({ percent = 20, size = 90, strokeWidth = 8 }) {
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

export function DynamicProgress({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [percentage, setPercentage] = useState(20)

    const onIncrease = () => {
        setPercentage((prev) => Math.min(prev + 10, 100))
    }

    const onDecrease = () => {
        setPercentage((prev) => Math.max(prev - 10, 0))
    }

    return (
        <div
            className={cn('w-full max-w-lg space-y-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Control Buttons */}
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-0.5 shadow-sm">
                <button
                    aria-label="Decrease percentage"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 transition"
                    disabled={disabled || loading || percentage <= 0}
                    type="button"
                    onClick={onDecrease}
                >
                    <HiMinus className="h-4 w-4" />
                </button>
                <button
                    aria-label="Increase percentage"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 transition"
                    disabled={disabled || loading || percentage >= 100}
                    type="button"
                    onClick={onIncrease}
                >
                    <HiPlus className="h-4 w-4" />
                </button>
            </div>

            {/* Synchronized Display */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-1 items-center gap-3 w-full">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full rounded-full bg-[#2a85ff] transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="min-w-[2.5rem] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {percentage}%
                    </span>
                </div>

                <SvgCircleDynamic percent={percentage} size={90} />
            </div>
        </div>
    )
}

export default DynamicProgress
