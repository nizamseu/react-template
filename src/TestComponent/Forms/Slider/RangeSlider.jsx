// RangeSlider

// RangeSlider · Slider demo

// Description:
// Demonstrates a dual-handle Slider for selecting a numeric range between
// a minimum and maximum threshold (e.g. 20 to 50).

// Design:
// - Dual range thumbs and highlighted middle active span
// - Brand blue #2a85ff active range track
// - Full dark mode support

// What it does:
// - Manages two values: rangeMin and rangeMax
// - Ensures min cannot exceed max
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import RangeSlider from '@/TestComponent/Forms/Slider/RangeSlider';
//
// const MyComponent = () => {
//     return <RangeSlider />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function RangeSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [minVal, setMinVal] = useState(20)
    const [maxVal, setMaxVal] = useState(70)

    const handleMin = (e) => {
        const value = Math.min(Number(e.target.value), maxVal - 5)
        setMinVal(value)
    }

    const handleMax = (e) => {
        const value = Math.max(Number(e.target.value), minVal + 5)
        setMaxVal(value)
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4 py-4', className)}
            {...props}
        >
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={minVal}
                    disabled={disabled || loading}
                    className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                    onChange={handleMin}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={maxVal}
                    disabled={disabled || loading}
                    className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                    onChange={handleMax}
                />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                <span>Min: <strong className="text-[#2a85ff]">{minVal}</strong></span>
                <span>Max: <strong className="text-[#2a85ff]">{maxVal}</strong></span>
            </div>
        </div>
    )
}

export default RangeSlider
