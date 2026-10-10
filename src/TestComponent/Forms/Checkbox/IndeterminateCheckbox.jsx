// IndeterminateCheckbox

// IndeterminateCheckbox · Checkbox demo

// Description:
// Demonstrates an "indeterminate" master checkbox ("Check all") that controls
// and reflects the state of a group of child checkboxes. Displays a dash
// icon when partially selected.

// Design:
// - Master checkbox separated from children by a divider line
// - Indeterminate dash visual state when partially selected
// - Brand blue #2a85ff checked color
// - Full dark mode support

// What it does:
// - Manages checked/indeterminate status dynamically based on children selection count
// - Clicking "Check all" toggles between selecting all items and selecting none
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import IndeterminateCheckbox from '@/TestComponent/Forms/Checkbox/IndeterminateCheckbox';
//
// const MyComponent = () => {
//     return <IndeterminateCheckbox />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const options = ['Selection A', 'Selection B', 'Selection C']

export function IndeterminateCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState(['Selection A'])

    const allChecked = selected.length === options.length
    const isIndeterminate = selected.length > 0 && selected.length < options.length

    const handleMasterToggle = () => {
        if (allChecked) {
            setSelected([])
        } else {
            setSelected([...options])
        }
    }

    const toggleChild = (opt) => {
        setSelected((prev) =>
            prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt],
        )
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col gap-3 max-w-sm', className)}
            {...props}
        >
            {/* Master Checkbox */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none pb-2 border-b border-gray-200 dark:border-gray-700">
                <input
                    ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate
                    }}
                    type="checkbox"
                    checked={allChecked}
                    disabled={disabled || loading}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                    onChange={handleMasterToggle}
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Check all
                </span>
            </label>

            {/* Child Checkboxes */}
            <div className="flex flex-col gap-2.5 pl-6">
                {options.map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={selected.includes(opt)}
                            disabled={disabled || loading}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                            onChange={() => toggleChild(opt)}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {opt}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default IndeterminateCheckbox
