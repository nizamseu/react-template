// TimeRangeInput

// TimeRangeInput · TimeInput demo

// Description:
// Demonstrates a time range picker allowing users to define start and
// end times in a single unified component row.

// Design:
// - Two time inputs connected with a "to" connector label
// - Clock icon indicators
// - Full dark mode support

// What it does:
// - Captures startTime and endTime
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import TimeRangeInput from '@/TestComponent/Forms/TimeInput/TimeRangeInput';
//
// const MyComponent = () => {
//     return <TimeRangeInput />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TimeRangeInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [start, setStart] = useState('09:00')
    const [end, setEnd] = useState('17:00')

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
                    <HiOutlineClock className="text-base" />
                </div>
                <input
                    type="time"
                    value={start}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setStart(e.target.value)}
                />
            </div>

            <span className="text-xs font-semibold text-gray-400">to</span>

            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineClock className="text-base" />
                </div>
                <input
                    type="time"
                    value={end}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setEnd(e.target.value)}
                />
            </div>
        </div>
    )
}

export default TimeRangeInput
