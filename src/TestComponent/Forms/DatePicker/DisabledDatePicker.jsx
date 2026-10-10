// DisabledDatePicker

// DisabledDatePicker · DatePicker demo

// Description:
// Demonstrates a disabled DatePicker component with inactive styles and
// prevented calendar dropdown.

// Design:
// - Grayed-out background (bg-gray-100 dark:bg-gray-700/50)
// - cursor-not-allowed
// - Full dark mode support

// What it does:
// - Renders an unclickable disabled date picker
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import DisabledDatePicker from '@/TestComponent/Forms/DatePicker/DisabledDatePicker';
//
// const MyComponent = () => {
//     return <DisabledDatePicker />
// }
// ```

'use client'

import { HiOutlineCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DisabledDatePicker({
    variant = 'primary',
    size = 'md',
    disabled = true,
    loading = false,
    className,
    ...props
}) {
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
                defaultValue="2026-10-06"
                disabled={disabled}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 pl-10 pr-3.5 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                {...props}
            />
        </div>
    )
}

export default DisabledDatePicker
