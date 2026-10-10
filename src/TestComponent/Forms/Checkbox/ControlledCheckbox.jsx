// ControlledCheckbox

// ControlledCheckbox · Checkbox demo

// Description:
// Demonstrates a React controlled checkbox where selection state is managed
// via external/parent useState hooks, rendering live state feedback.

// Design:
// - Column layout featuring a standalone checkbox and a group of checkboxes
// - Feedback panel displaying currently selected values in real time
// - Brand blue #2a85ff checked styling
// - Full dark mode support

// What it does:
// - Connects state variables to individual and group checkbox selections
// - Renders state mirroring preview
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ControlledCheckbox from '@/TestComponent/Forms/Checkbox/ControlledCheckbox';
//
// const MyComponent = () => {
//     return <ControlledCheckbox />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const options = ['Selection A', 'Selection B', 'Selection C']

export function ControlledCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [checked, setChecked] = useState(false)
    const [selectedList, setSelectedList] = useState(['Selection A'])

    const toggleGroup = (val) => {
        setSelectedList((prev) =>
            prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val],
        )
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col gap-5 max-w-md', className)}
            {...props}
        >
            {/* Single Controlled Checkbox */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled || loading}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                    onChange={(e) => setChecked(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Standalone Checkbox (Status: {checked ? 'Checked' : 'Unchecked'})
                </span>
            </label>

            {/* Controlled Group */}
            <div className="flex flex-wrap items-center gap-5">
                {options.map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={selectedList.includes(opt)}
                            disabled={disabled || loading}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                            onChange={() => toggleGroup(opt)}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {opt}
                        </span>
                    </label>
                ))}
            </div>

            {/* Preview State */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Selected List: </span>
                {selectedList.length > 0 ? selectedList.join(', ') : <span className="italic text-gray-400">None</span>}
            </div>
        </div>
    )
}

export default ControlledCheckbox
