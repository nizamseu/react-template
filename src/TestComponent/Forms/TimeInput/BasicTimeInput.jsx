// BasicTimeInput

// BasicTimeInput · TimeInput demo

// Description:
// Demonstrates a clean time input field with clock icon prefix, allowing
// users to input or choose hour and minute values.

// Design:
// - Standard input with embedded clock icon (HiOutlineClock)
// - Brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Captures standard time strings (HH:mm)
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultValue: string (default: "12:30")
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import BasicTimeInput from '@/TestComponent/Forms/TimeInput/BasicTimeInput';
//
// const MyComponent = () => {
//     return <BasicTimeInput />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicTimeInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = '12:30',
    className,
    ...props
}) {
    const [time, setTime] = useState(defaultValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-xs w-full relative', className)}
        >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <HiOutlineClock className="text-lg" />
            </div>
            <input
                type="time"
                value={time}
                disabled={disabled || loading}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                onChange={(e) => setTime(e.target.value)}
                {...props}
            />
        </div>
    )
}

export default BasicTimeInput
