// RangeDatePicker

// RangeDatePicker · DatePicker demo

// Description:
// Demonstrates a DatePicker component for selecting a start and end date range.

// Design:
// - Two date input fields chained with a "to" connector
// - Calendar icon prefix
// - Full dark mode support

// What it does:
// - Captures startDate and endDate
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import RangeDatePicker from '@/TestComponent/Forms/DatePicker/RangeDatePicker';
//
// const MyComponent = () => {
//     return <RangeDatePicker />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function RangeDatePicker({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [start, setStart] = useState('2026-10-01')
    const [end, setEnd] = useState('2026-10-15')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex items-center gap-2 max-w-md w-full', className)}
            {...props}
        >
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-base" />
                </div>
                <input
                    type="date"
                    value={start}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setStart(e.target.value)}
                />
            </div>

            <span className="text-xs font-semibold text-gray-400">to</span>

            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-base" />
                </div>
                <input
                    type="date"
                    value={end}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setEnd(e.target.value)}
                />
            </div>
        </div>
    )
}

export default RangeDatePicker
