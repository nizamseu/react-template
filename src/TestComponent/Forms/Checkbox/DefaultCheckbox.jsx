// DefaultCheckbox

// DefaultCheckbox · Checkbox demo

// Description:
// A standard single checkbox input supporting default checked state,
// toggle interaction, and accessible label pairing.

// Design:
// - Square rounded checkbox with #2a85ff brand blue check fill
// - Smooth transitions on hover and focus ring
// - Clean typography with text-sm, text-gray-800 dark:text-gray-200
// - Dark mode support with dark:border-gray-600 dark:bg-gray-800

// What it does:
// - Manages checked state or uncontrolled defaultChecked
// - Accessible checkbox with click and keyboard support
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultChecked: boolean (default: true)
// - label: string (default: "Checkbox")
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import DefaultCheckbox from '@/TestComponent/Forms/Checkbox/DefaultCheckbox';
//
// const MyComponent = () => {
//     return <DefaultCheckbox label="Accept terms" />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function DefaultCheckbox({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultChecked = true,
    label = 'Checkbox',
    className,
    ...props
}) {
    const [checked, setChecked] = useState(defaultChecked)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex items-center', className)}
        >
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled || loading}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setChecked(e.target.checked)}
                    {...props}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </span>
            </label>
        </div>
    )
}

export default DefaultCheckbox
