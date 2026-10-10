// SizesForm

// SizesForm · FormControl demo

// Description:
// Demonstrates form sizing variations across Small (sm), Medium (md), and Large (lg).
// Toggles field padding, font sizes, and button dimensions across all inputs.

// Design:
// - Interactive size switcher pill group
// - Dynamic scaling of inputs, labels, and buttons
// - Brand blue #2a85ff highlight
// - Full dark mode support

// What it does:
// - Manages local size state ('sm' | 'md' | 'lg')
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizesForm from '@/TestComponent/Forms/FormControl/SizesForm';
//
// const MyComponent = () => {
//     return <SizesForm />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const sizeOptions = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
]

const sizeStyles = {
    sm: { input: 'px-2.5 py-1.5 text-xs', label: 'text-xs', btn: 'px-3 py-1.5 text-xs' },
    md: { input: 'px-3.5 py-2 text-sm', label: 'text-sm', btn: 'px-4 py-2 text-sm' },
    lg: { input: 'px-4 py-2.5 text-base', label: 'text-base', btn: 'px-5 py-2.5 text-base' },
}

export function SizesForm({
    variant = 'primary',
    size: initialSize = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [size, setSize] = useState(initialSize)
    const sz = sizeStyles[size] || sizeStyles.md

    const handleSubmit = (e) => {
        e.preventDefault()
        window.alert('Form submitted with size: ' + size)
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-6 max-w-xl text-gray-900 dark:text-gray-100', className)}
            {...props}
        >
            <div className="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {sizeOptions.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        disabled={disabled || loading}
                        className={cn(
                            'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors',
                            size === opt.value
                                ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900',
                        )}
                        onClick={() => setSize(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className={cn('block font-medium mb-1.5 text-gray-700 dark:text-gray-200', sz.label)}>
                        Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        disabled={disabled || loading}
                        className={cn(
                            'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]',
                            sz.input,
                        )}
                    />
                </div>

                <div>
                    <label className={cn('block font-medium mb-1.5 text-gray-700 dark:text-gray-200', sz.label)}>
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        disabled={disabled || loading}
                        className={cn(
                            'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]',
                            sz.input,
                        )}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={disabled || loading}
                        className={cn(
                            'rounded-lg font-medium bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm',
                            sz.btn,
                        )}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SizesForm
