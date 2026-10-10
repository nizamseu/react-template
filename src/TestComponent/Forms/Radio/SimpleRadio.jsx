// SimpleRadio

// SimpleRadio · Radio demo

// Description:
// Demonstrates standalone Radio buttons allowing single selection within
// the same name group. Features standard unselected and pre-selected items.

// Design:
// - Circular radio button with brand blue #2a85ff active inner dot
// - Clean typography with text-sm text-gray-700 dark:text-gray-300
// - Dark mode support with dark:border-gray-600 dark:bg-gray-800

// What it does:
// - Renders two radio inputs sharing the same group name
// - Updates checked state automatically via standard browser radio semantics
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SimpleRadio from '@/TestComponent/Forms/Radio/SimpleRadio';
//
// const MyComponent = () => {
//     return <SimpleRadio />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function SimpleRadio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState('2')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex items-center gap-6', className)}
            {...props}
        >
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="radio"
                    name="simpleRadioExample"
                    value="1"
                    checked={selected === '1'}
                    disabled={disabled || loading}
                    className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                    onChange={() => setSelected('1')}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Radio
                </span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="radio"
                    name="simpleRadioExample"
                    value="2"
                    checked={selected === '2'}
                    disabled={disabled || loading}
                    className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                    onChange={() => setSelected('2')}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Checked Radio
                </span>
            </label>
        </div>
    )
}

export default SimpleRadio
