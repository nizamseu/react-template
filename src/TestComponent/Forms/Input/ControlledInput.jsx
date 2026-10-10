// ControlledInput

// ControlledInput · Input demo

// Description:
// Demonstrates a React controlled input component where value and onChange
// are synchronized with local state, showing live value mirroring.

// Design:
// - Stacked column layout with input and real-time live preview panel
// - Preview panel displayed in a rounded-lg code box with subtle border
// - Brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Uses React useState to bind value and trigger on input events
// - Displays the current state value dynamically below the input
// - Fully standalone single component

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - initialValue: string (default: "")
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import ControlledInput from '@/TestComponent/Forms/Input/ControlledInput';
//
// const MyComponent = () => {
//     return <ControlledInput initialValue="Initial text" />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function ControlledInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialValue = '',
    className,
    ...props
}) {
    const [value, setValue] = useState(initialValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-3', className)}
        >
            <input
                type="text"
                value={value}
                disabled={disabled || loading}
                placeholder="Type something..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                onChange={(e) => setValue(e.target.value)}
                {...props}
            />
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Current Value: </span>
                {value ? `"${value}"` : <span className="italic text-gray-400">(empty)</span>}
            </div>
        </div>
    )
}

export default ControlledInput
