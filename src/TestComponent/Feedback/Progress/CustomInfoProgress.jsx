// CustomInfoProgress

// CustomInfoProgress · Progress demo

// Description:
// Demonstrates progress indicators where the default percentage labels are replaced
// with custom React elements: status icons (HiXCircle, HiCheckCircle) or multi-line completion text.

// Design:
// - Red progress bar with leading HiXCircle icon
// - Green progress bar with leading HiCheckCircle icon
// - Large circular gauge (140px) displaying multi-line "40% completion"
// - Full dark mode support

// What it does:
// - Replaces standard percent text with customized status nodes
// - Provides rich visual feedback for tasks and milestones

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomInfoProgress from '@/TestComponent/Feedback/Progress/CustomInfoProgress';
//
// const MyComponent = () => {
//     return <CustomInfoProgress />
// }
// ```

'use client'

import { HiXCircle, HiCheckCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

function SvgCircleWithCustomInfo({ percent = 40, size = 140, strokeWidth = 10 }) {
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
            <div className="absolute text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {validPercent}%
                </div>
                <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    completion
                </div>
            </div>
        </div>
    )
}

export function CustomInfoProgress({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-col md:flex-row items-center gap-8 w-full max-w-xl', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="w-full flex-1 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full rounded-full bg-rose-500 transition-all duration-300"
                            style={{ width: '60%' }}
                        />
                    </div>
                    <HiXCircle className="h-5 w-5 shrink-0 text-rose-500" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <HiCheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                </div>
            </div>

            <SvgCircleWithCustomInfo percent={40} size={140} />
        </div>
    )
}

export default CustomInfoProgress
