// ControlledSlider

// ControlledSlider · Slider demo

// Description:
// Demonstrates a React controlled Slider where value is synchronized with state
// and reflected in real-time numeric output labels.

// Design:
// - Range slider track with numeric indicator pill and live value readout
// - Brand blue #2a85ff active accent
// - Full dark mode support

// What it does:
// - Synchronizes slider position with React useState
// - Displays dynamic feedback of the active numeric value
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - initialValue: number (default: 50)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ControlledSlider from '@/TestComponent/Forms/Slider/ControlledSlider';
//
// const MyComponent = () => {
//     return <ControlledSlider initialValue={50} />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function ControlledSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialValue = 50,
    className,
    ...props
}) {
    const [value, setValue] = useState(initialValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4 py-2', className)}
            {...props}
        >
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                disabled={disabled || loading}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2a85ff]"
                onChange={(e) => setValue(Number(e.target.value))}
            />
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Slider value: </span>
                <strong className="text-[#2a85ff]">{value}</strong>
            </div>
        </div>
    )
}

export default ControlledSlider
