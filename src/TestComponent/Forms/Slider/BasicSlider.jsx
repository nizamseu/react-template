// BasicSlider

// BasicSlider · Slider demo

// Description:
// Demonstrates a clean horizontal range Slider allowing users to pick
// a continuous numeric value between 0 and 100 with interactive track fill.

// Design:
// - Track height h-2 rounded-full with #2a85ff active fill and gray-200 / dark:bg-gray-700 background
// - Circular thumb with white fill and #2a85ff border
// - Full dark mode support

// What it does:
// - Manages numeric slider value (0 to 100)
// - Updates active track fill width dynamically
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultValue: number (default: 60)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicSlider from '@/TestComponent/Forms/Slider/BasicSlider';
//
// const MyComponent = () => {
//     return <BasicSlider defaultValue={60} />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function BasicSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = 60,
    className,
    ...props
}) {
    const [val, setVal] = useState(defaultValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full py-4', className)}
            {...props}
        >
            <div className="relative flex items-center">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    disabled={disabled || loading}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                    onChange={(e) => setVal(Number(e.target.value))}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{val}</span>
                <span>100</span>
            </div>
        </div>
    )
}

export default BasicSlider
