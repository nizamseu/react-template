// CircleProgress

// CircleProgress · Progress demo

// Description:
// Circular progress indicator displaying operation completion as a circular stroke ring.
// Supports complete ring and gapped bottom arc variations.

// Design:
// - SVG circular stroke ring with smooth stroke-dashoffset transition
// - Centered bold percentage label
// - Brand blue #2a85ff stroke with soft gray track
// - Full dark mode support

// What it does:
// - Computes SVG circumference and arc offsets
// - Renders two circular progress bars (40% complete and 70% open arc)

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CircleProgress from '@/TestComponent/Feedback/Progress/CircleProgress';
//
// const MyComponent = () => {
//     return <CircleProgress />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

function SvgCircle({ percent = 40, size = 100, strokeWidth = 8, gapDegree = 0 }) {
    const validPercent = Math.min(Math.max(percent, 0), 100)
    const radius = (size - strokeWidth) / 2
    const totalCircumference = 2 * Math.PI * radius
    const arcLength = totalCircumference * ((360 - gapDegree) / 360)
    const strokeDashoffset = arcLength * (1 - validPercent / 100)
    const rotation = gapDegree ? 90 + gapDegree / 2 : -90

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ height: size, width: size }}
        >
            <svg
                className="h-full w-full"
                style={{ transform: `rotate(${rotation}deg)` }}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background Track */}
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeDasharray={`${arcLength} ${totalCircumference}`}
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                />
                {/* Progress Fill */}
                <circle
                    className="text-[#2a85ff] transition-all duration-300"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeDasharray={`${arcLength} ${totalCircumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                />
            </svg>
            <span className="absolute text-sm font-bold text-gray-800 dark:text-gray-100">
                {validPercent}%
            </span>
        </div>
    )
}

export function CircleProgress({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-8', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <SvgCircle percent={40} size={100} />
            <SvgCircle gapDegree={70} percent={70} size={100} />
        </div>
    )
}

export default CircleProgress
