// AmPmTimeInput

// AmPmTimeInput · TimeInput demo

// Description:
// Demonstrates a 12-hour AM/PM TimeInput with interactive hour, minute,
// and AM/PM selection.

// Design:
// - Time input with AM/PM pill toggle button
// - Clock icon prefix
// - Full dark mode support

// What it does:
// - Toggles AM/PM mode and updates 12-hour formatted time
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AmPmTimeInput from '@/TestComponent/Forms/TimeInput/AmPmTimeInput';
//
// const MyComponent = () => {
//     return <AmPmTimeInput />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AmPmTimeInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [hour, setHour] = useState('10')
    const [minute, setMinute] = useState('30')
    const [period, setPeriod] = useState('AM')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex items-center gap-2 p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm max-w-xs', className)}
            {...props}
        >
            <HiOutlineClock className="text-gray-400 text-lg ml-2" />
            <input
                type="number"
                min="1"
                max="12"
                value={hour}
                disabled={disabled || loading}
                className="w-12 text-center text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100"
                onChange={(e) => setHour(e.target.value)}
            />
            <span className="text-gray-400 font-bold">:</span>
            <input
                type="number"
                min="0"
                max="59"
                value={minute}
                disabled={disabled || loading}
                className="w-12 text-center text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100"
                onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
            />
            <button
                type="button"
                disabled={disabled || loading}
                className="px-2 py-1 text-xs font-bold rounded bg-blue-50 dark:bg-blue-950/40 text-[#2a85ff] hover:bg-blue-100 transition-colors"
                onClick={() => setPeriod(period === 'AM' ? 'PM' : 'AM')}
            >
                {period}
            </button>
        </div>
    )
}

export default AmPmTimeInput
