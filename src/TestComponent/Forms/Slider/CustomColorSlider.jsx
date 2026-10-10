// CustomColorSlider

// CustomColorSlider · Slider demo

// Description:
// Demonstrates Sliders in distinct accent track colors: Emerald, Amber,
// Rose, and Indigo, showcasing brand customizability.

// Design:
// - Stacked column layout with 16px vertical gap
// - Emerald green, amber yellow, rose red, and indigo purple accents
// - Full dark mode support

// What it does:
// - Renders multi-color range sliders
// - Demonstrates color styling support
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomColorSlider from '@/TestComponent/Forms/Slider/CustomColorSlider';
//
// const MyComponent = () => {
//     return <CustomColorSlider />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const colorTracks = [
    { name: 'Emerald', accent: 'accent-emerald-500', defaultVal: 70 },
    { name: 'Amber', accent: 'accent-amber-500', defaultVal: 50 },
    { name: 'Rose', accent: 'accent-rose-500', defaultVal: 40 },
    { name: 'Indigo', accent: 'accent-indigo-600', defaultVal: 85 },
]

export function CustomColorSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [values, setValues] = useState({
        Emerald: 70,
        Amber: 50,
        Rose: 40,
        Indigo: 85,
    })

    const update = (name, val) => {
        setValues((prev) => ({ ...prev, [name]: val }))
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4 py-2', className)}
            {...props}
        >
            {colorTracks.map((item) => (
                <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{item.name}</span>
                        <span>{values[item.name]}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={values[item.name]}
                        disabled={disabled || loading}
                        className={cn('w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer', item.accent)}
                        onChange={(e) => update(item.name, Number(e.target.value))}
                    />
                </div>
            ))}
        </div>
    )
}

export default CustomColorSlider
