// BasicSelect

// BasicSelect · Select demo

// Description:
// The most basic usage of a dropdown Select component, allowing users
// to choose an option from a list.

// Design:
// - Modern select dropdown with custom chevron arrow
// - Rounded-lg border with smooth focus ring and brand blue #2a85ff
// - Full dark mode support with dark:bg-gray-800, dark:border-gray-600

// What it does:
// - Manages selected option value in state
// - Supports placeholder and custom options
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto select element

// Usage example:
// ```jsx
// import BasicSelect from '@/TestComponent/Forms/Select/BasicSelect';
//
// const MyComponent = () => {
//     return <BasicSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const defaultOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'green', label: 'Green' },
]

export function BasicSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    options = defaultOptions,
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
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed appearance-none pr-10 cursor-pointer"
                onChange={(e) => setSelected(e.target.value)}
                {...props}
            >
                <option disabled value="">
                    Please Select...
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
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

export default BasicSelect
