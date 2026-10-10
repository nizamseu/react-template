// TooltipSlider

// TooltipSlider · Slider demo

// Description:
// Demonstrates a Slider that displays a floating value tooltip above the thumb
// when hovered or adjusted.

// Design:
// - Floating value badge positioned dynamically above the slider thumb
// - Dark pill tooltip with arrow tip
// - Brand blue #2a85ff track
// - Full dark mode support

// What it does:
// - Shows floating tooltip indicator with current percentage
// - Follows thumb position smoothly
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import TooltipSlider from '@/TestComponent/Forms/Slider/TooltipSlider';
//
// const MyComponent = () => {
//     return <TooltipSlider />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function TooltipSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = 60,
    className,
    ...props
}) {
    const [val, setVal] = useState(defaultValue)
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full pt-8 pb-4 relative', className)}
            {...props}
        >
            {/* Tooltip Badge */}
            <div
                style={{ left: `calc(${val}% - 16px)` }}
                className={cn(
                    'absolute top-0 px-2 py-0.5 rounded bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold shadow pointer-events-none transition-opacity duration-150',
                    isHovered ? 'opacity-100' : 'opacity-80',
                )}
            >
                {val}%
            </div>

            <input
                type="range"
                min="0"
                max="100"
                value={val}
                disabled={disabled || loading}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onChange={(e) => setVal(Number(e.target.value))}
            />
        </div>
    )
}

export default TooltipSlider
