// HorizontalLayoutForm

// HorizontalLayoutForm · FormControl demo

// Description:
// Demonstrates a horizontal form layout where field labels are aligned to the left
// of their input elements with fixed column widths and right text alignment.

// Design:
// - Horizontal flex layout (sm:flex sm:items-center sm:gap-4)
// - Fixed width label column (sm:w-28 sm:text-right)
// - Brand blue #2a85ff input focus rings and primary submit button
// - Full dark mode support

// What it does:
// - Collects Name and Email in a horizontal form structure
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import HorizontalLayoutForm from '@/TestComponent/Forms/FormControl/HorizontalLayoutForm';
//
// const MyComponent = () => {
//     return <HorizontalLayoutForm />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function HorizontalLayoutForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        window.alert(JSON.stringify({ name, email }, null, 2))
    }

    return (
        <form
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-4 max-w-lg w-full text-gray-900 dark:text-gray-100', className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <div className="sm:flex sm:items-center sm:gap-4">
                <label className="block text-sm font-medium mb-1.5 sm:mb-0 sm:w-28 sm:text-right shrink-0 text-gray-700 dark:text-gray-200">
                    Name:
                </label>
                <div className="flex-1">
                    <input
                        type="text"
                        value={name}
                        disabled={disabled || loading}
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <div className="sm:flex sm:items-center sm:gap-4">
                <label className="block text-sm font-medium mb-1.5 sm:mb-0 sm:w-28 sm:text-right shrink-0 text-gray-700 dark:text-gray-200">
                    Email:
                </label>
                <div className="flex-1">
                    <input
                        type="email"
                        value={email}
                        disabled={disabled || loading}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="sm:flex sm:items-center sm:gap-4 pt-1">
                <div className="sm:w-28 shrink-0" />
                <button
                    type="submit"
                    disabled={disabled || loading}
                    className="rounded-lg font-medium px-4 py-2 text-sm bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default HorizontalLayoutForm
