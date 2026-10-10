// StepSlider

// StepSlider · Slider demo

// Description:
// Demonstrates a Slider that snaps to discrete step intervals (e.g. 0°C, 25°C,
// 50°C, 75°C, 100°C) with visible step tick marks.

// Design:
// - Range slider with step increments of 25
// - Tick marks and labels positioned at interval points
// - Brand blue #2a85ff track
// - Full dark mode support

// What it does:
// - Snaps value strictly to discrete step increments
// - Displays temperature labels corresponding to steps
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import StepSlider from '@/TestComponent/Forms/Slider/StepSlider';
//
// const MyComponent = () => {
//     return <StepSlider />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const steps = [
    { value: 0, label: '0°C' },
    { value: 25, label: '25°C' },
    { value: 50, label: '50°C' },
    { value: 75, label: '75°C' },
    { value: 100, label: '100°C' },
]

export function StepSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [val, setVal] = useState(25)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4 py-4', className)}
            {...props}
        >
            <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={val}
                disabled={disabled || loading}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                onChange={(e) => setVal(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                {steps.map((s) => (
                    <span
                        key={s.value}
                        className={cn(val === s.value && 'font-bold text-[#2a85ff] dark:text-blue-400')}
                    >
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default StepSlider
