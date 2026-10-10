// ColorCheckbox

// ColorCheckbox · Checkbox demo

// Description:
// Demonstrates checkboxes in various custom accent colors, such as Green,
// Yellow, Indigo, Red, and Purple, displaying customizable brand accents.

// Design:
// - Inline flex wrap of distinct color checkboxes
// - Custom accent colors: green-500, yellow-500, indigo-600, red-500, purple-500
// - Full dark mode support

// What it does:
// - Renders checkboxes with distinct accent-color properties
// - Demonstrates multi-color checkbox styling options
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ColorCheckbox from '@/TestComponent/Forms/Checkbox/ColorCheckbox';
//
// const MyComponent = () => {
//     return <ColorCheckbox />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const colorOptions = [
    { label: 'Green', color: 'accent-emerald-500 text-emerald-500' },
    { label: 'Yellow', color: 'accent-amber-500 text-amber-500' },
    { label: 'Indigo', color: 'accent-indigo-600 text-indigo-600' },
    { label: 'Red', color: 'accent-rose-500 text-rose-500' },
    { label: 'Purple', color: 'accent-purple-600 text-purple-600' },
]

export function ColorCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState(['Green', 'Indigo'])

    const toggle = (label) => {
        setSelected((prev) =>
            prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
        )
    }

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
                        type="checkbox"
                        checked={selected.includes(item.label)}
                        disabled={disabled || loading}
                        className={cn('h-4 w-4 rounded cursor-pointer', item.color)}
                        onChange={() => toggle(item.label)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
    )
}

export default ColorCheckbox
