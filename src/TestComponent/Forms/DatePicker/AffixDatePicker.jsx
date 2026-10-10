// AffixDatePicker

// AffixDatePicker · DatePicker demo

// Description:
// Demonstrates DatePicker inputs with custom prefix and suffix calendar icons.

// Design:
// - Stacked column layout with 16px vertical gap
// - Left prefix calendar icon on first input
// - Right suffix stats/calendar icon on second input
// - Full dark mode support

// What it does:
// - Renders prefix and suffix icon configurations
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AffixDatePicker from '@/TestComponent/Forms/DatePicker/AffixDatePicker';
//
// const MyComponent = () => {
//     return <AffixDatePicker />
// }
// ```

'use client'

import { HiOutlineCalendar } from 'react-icons/hi';
import { TbCalendarStats } from 'react-icons/tb';
import { cn } from '@/design-system/lib/cn';

export function AffixDatePicker({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-xs w-full space-y-4', className)}
            {...props}
        >
            {/* Prefix Calendar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-lg" />
                </div>
                <input
                    type="date"
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>

            {/* Suffix Calendar */}
            <div className="relative">
                <input
                    type="date"
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3.5 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <TbCalendarStats className="text-xl text-[#2a85ff]" />
                </div>
            </div>
        </div>
    )
}

export default AffixDatePicker
