// GroupSelect

// GroupSelect · Select demo

// Description:
// Demonstrates a Select dropdown with categorized option groups (<optgroup>),
// such as "Colours" and "Flavours".

// Design:
// - Dropdown with bold category headers and indented option items
// - Rounded-lg border with smooth brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Organizes option items into semantic optgroups
// - Manages selected option value
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto select element

// Usage example:
// ```jsx
// import GroupSelect from '@/TestComponent/Forms/Select/GroupSelect';
//
// const MyComponent = () => {
//     return <GroupSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const groups = [
    {
        name: 'Colours',
        options: ['Ocean', 'Blue', 'Purple', 'Red', 'Orange'],
    },
    {
        name: 'Flavours',
        options: ['Vanilla', 'Chocolate', 'Strawberry', 'Caramel'],
    },
]

export function GroupSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState('')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full relative', className)}
        >
            <select
                value={selected}
                disabled={disabled || loading}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] appearance-none pr-10 cursor-pointer"
                onChange={(e) => setSelected(e.target.value)}
                {...props}
            >
                <option disabled value="">
                    Select an option...
                </option>
                {groups.map((group) => (
                    <optgroup key={group.name} label={group.name} className="font-semibold text-gray-700 dark:text-gray-300">
                        {group.options.map((opt) => (
                            <option key={opt} value={opt} className="font-normal text-gray-900 dark:text-gray-100">
                                {opt}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    )
}

export default GroupSelect
