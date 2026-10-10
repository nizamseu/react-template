// BasicDatePicker

// BasicDatePicker · DatePicker demo

// Description:
// Demonstrates a clean DatePicker input field equipped with calendar icon prefix,
// allowing users to select a calendar date.

// Design:
// - Native calendar input with HiOutlineCalendar prefix icon
// - Brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Captures calendar date value (YYYY-MM-DD)
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultValue: string (default: current date)
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import BasicDatePicker from '@/TestComponent/Forms/DatePicker/BasicDatePicker';
//
// const MyComponent = () => {
//     return <BasicDatePicker />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicDatePicker({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = '2026-10-06',
    className,
    ...props
}) {
    const [date, setDate] = useState(defaultValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-xs w-full relative', className)}
        >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <HiOutlineCalendar className="text-lg" />
            </div>
            <input
                type="date"
                value={date}
                disabled={disabled || loading}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] cursor-pointer"
                onChange={(e) => setDate(e.target.value)}
                {...props}
            />
        </div>
    )
}

export default BasicDatePicker
