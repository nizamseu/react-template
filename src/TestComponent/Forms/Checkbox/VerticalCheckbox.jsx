// VerticalCheckbox

// VerticalCheckbox · Checkbox demo

// Description:
// Demonstrates vertically stacked checkboxes arranged in a column with
// uniform spacing, suitable for forms with longer label descriptions.

// Design:
// - Vertical column layout with 12px vertical spacing (flex flex-col gap-3)
// - Brand blue #2a85ff checked fill
// - Full dark mode support with dark:text-gray-300

// What it does:
// - Renders vertical checkboxes with independent state selection
// - Clean standalone single component

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import VerticalCheckbox from '@/TestComponent/Forms/Checkbox/VerticalCheckbox';
//
// const MyComponent = () => {
//     return <VerticalCheckbox />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const defaultOptions = ['Option A', 'Option B', 'Option C']

export function VerticalCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    options = defaultOptions,
    className,
    ...props
}) {
    const [selected, setSelected] = useState(['Option A'])

    const toggle = (opt) => {
        setSelected((prev) =>
            prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt],
        )
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col gap-3', className)}
            {...props}
        >
            {options.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        disabled={disabled || loading}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                        onChange={() => toggle(opt)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {opt}
                    </span>
                </label>
            ))}
        </div>
    )
}

export default VerticalCheckbox
