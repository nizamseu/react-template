// InlineLayoutForm

// InlineLayoutForm · FormControl demo

// Description:
// Demonstrates an inline form layout where multiple input fields and the submit
// action button sit side-by-side in a responsive horizontal flex row.

// Design:
// - Inline flex wrap layout (flex flex-wrap items-end gap-3)
// - Clean responsive arrangement with min-w-[160px]
// - Brand blue #2a85ff input focus rings and primary submit button
// - Full dark mode support

// What it does:
// - Collects Name and Email horizontally in a single row
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import InlineLayoutForm from '@/TestComponent/Forms/FormControl/InlineLayoutForm';
//
// const MyComponent = () => {
//     return <InlineLayoutForm />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function InlineLayoutForm({
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
            className={cn('flex flex-wrap items-end gap-3 text-gray-900 dark:text-gray-100', className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    disabled={disabled || loading}
                    placeholder="Name"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    disabled={disabled || loading}
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={disabled || loading}
                className="rounded-lg font-medium px-4 py-2 text-sm bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm"
            >
                Submit
            </button>
        </form>
    )
}

export default InlineLayoutForm
