// FormatDatePicker

// FormatDatePicker · DatePicker demo

// Description:
// Demonstrates DatePicker components displaying formatted date strings
// (e.g. "MMM, DD YYYY" like "Oct 06, 2026") with custom readable labels.

// Design:
// - Date picker with formatted date display
// - Calendar icon prefix
// - Full dark mode support

// What it does:
// - Formats raw date object to human-friendly strings
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import FormatDatePicker from '@/TestComponent/Forms/DatePicker/FormatDatePicker';
//
// const MyComponent = () => {
//     return <FormatDatePicker />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FormatDatePicker({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [rawDate, setRawDate] = useState('2026-10-06')

    const formatted = new Date(rawDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-xs w-full space-y-2', className)}
            {...props}
        >
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-lg" />
                </div>
                <input
                    type="date"
                    value={rawDate}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setRawDate(e.target.value)}
                />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                Formatted: <strong className="text-[#2a85ff]">{formatted}</strong>
            </div>
        </div>
    )
}

export default FormatDatePicker
