// ColorRadio

// ColorRadio · Radio demo

// Description:
// Demonstrates Radio buttons in distinct accent colors: Green, Yellow,
// Blue, Rose, and Violet, showcasing color brand customizability.

// Design:
// - Inline flex wrap of colored radio inputs
// - Specific accent classes: emerald-500, amber-500, blue-600, rose-500, violet-600
// - Full dark mode support

// What it does:
// - Renders radio options with custom accent colors
// - Updates single selected item across colors
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ColorRadio from '@/TestComponent/Forms/Radio/ColorRadio';
//
// const MyComponent = () => {
//     return <ColorRadio />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const colorOptions = [
    { label: 'Emerald', color: 'accent-emerald-500 text-emerald-500' },
    { label: 'Amber', color: 'accent-amber-500 text-amber-500' },
    { label: 'Blue', color: 'accent-blue-600 text-blue-600' },
    { label: 'Rose', color: 'accent-rose-500 text-rose-500' },
    { label: 'Violet', color: 'accent-violet-600 text-violet-600' },
]

export function ColorRadio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState('Blue')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-wrap items-center gap-6', className)}
            {...props}
        >
            {colorOptions.map((item) => (
                <label key={item.label} className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="radio"
                        name="colorRadioDemo"
                        value={item.label}
                        checked={selected === item.label}
                        disabled={disabled || loading}
                        className={cn('h-4 w-4 cursor-pointer', item.color)}
                        onChange={() => setSelected(item.label)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
    )
}

export default ColorRadio
