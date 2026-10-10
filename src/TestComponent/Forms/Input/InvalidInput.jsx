// InvalidInput

// InvalidInput · Input demo

// Description:
// Demonstrates an input in an invalid/error state. Highlights the border
// and focus ring in red and features a right-aligned exclamation error icon
// with inline error feedback.

// Design:
// - Red border (border-red-500) and focus ring (focus:ring-red-500)
// - Right trailing HiExclamationCircle icon in red
// - Interactive toggle button to switch between valid and invalid states
// - Dark mode support with dark:bg-gray-800, dark:border-red-500

// What it does:
// - Manages local invalid state with a toggle button
// - Conditionally displays red warning styles and trailing icon
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - initialInvalid: boolean (default: true)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import InvalidInput from '@/TestComponent/Forms/Input/InvalidInput';
//
// const MyComponent = () => {
//     return <InvalidInput />
// }
// ```

'use client'

import { useState } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InvalidInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialInvalid = true,
    className,
    ...props
}) {
    const [invalid, setInvalid] = useState(initialInvalid)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4', className)}
            {...props}
        >
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Invalid input"
                    defaultValue="invalid@email"
                    className={cn(
                        'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 pr-10',
                        invalid
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                    )}
                />
                {invalid && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <HiExclamationCircle className="text-red-500 text-xl" />
                    </div>
                )}
            </div>

            <button
                type="button"
                disabled={disabled || loading}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setInvalid(!invalid)}
            >
                Toggle {invalid ? 'Valid' : 'Invalid'} State
            </button>
        </div>
    )
}

export default InvalidInput
