// MarksSlider

// MarksSlider · Slider demo

// Description:
// Demonstrates a Slider with currency milestone marks ($20,000, $50,000,
// $80,000) displayed along the track.

// Design:
// - Range slider track with positioned mark indicator labels
// - Currency labels in clean typography
// - Brand blue #2a85ff track
// - Full dark mode support

// What it does:
// - Shows marked milestones along the 0-100 range
// - Updates live slider value smoothly
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import MarksSlider from '@/TestComponent/Forms/Slider/MarksSlider';
//
// const MyComponent = () => {
//     return <MarksSlider />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function MarksSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [val, setVal] = useState(40)

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
                value={val}
                disabled={disabled || loading}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                onChange={(e) => setVal(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>$0</span>
                <span className={cn(val >= 20 && 'text-[#2a85ff] font-medium')}>$20,000</span>
                <span className={cn(val >= 50 && 'text-[#2a85ff] font-medium')}>$50,000</span>
                <span className={cn(val >= 80 && 'text-[#2a85ff] font-medium')}>$80,000</span>
                <span>$100,000</span>
            </div>
        </div>
    )
}

export default MarksSlider
