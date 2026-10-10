// GroupCheckbox

// GroupCheckbox · Checkbox demo

// Description:
// Demonstrates a horizontal group of checkboxes bound to a selection array,
// allowing users to toggle individual selections independently.

// Design:
// - Horizontal inline layout (flex items-center gap-6)
// - Brand blue #2a85ff checks with smooth transitions
// - Muted dark mode labels with dark:text-gray-300
// - Responsive wrap on smaller viewports

// What it does:
// - Tracks active selections array in React state
// - Toggles inclusion of an item on checkbox change
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - initialValues: string[] (default: ['Selection A'])
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import GroupCheckbox from '@/TestComponent/Forms/Checkbox/GroupCheckbox';
//
// const MyComponent = () => {
//     return <GroupCheckbox />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const defaultOptions = ['Selection A', 'Selection B', 'Selection C']

export function GroupCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialValues = ['Selection A'],
    options = defaultOptions,
    className,
    ...props
}) {
    const [selected, setSelected] = useState(initialValues)

    const toggleOption = (opt) => {
        setSelected((prev) =>
            prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt],
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
            {options.map((opt) => {
                const isChecked = selected.includes(opt)
                return (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={disabled || loading}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                            onChange={() => toggleOption(opt)}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {opt}
                        </span>
                    </label>
                )
            })}
        </div>
    )
}

export default GroupCheckbox
