// InputSizeDatePicker

// InputSizeDatePicker · DatePicker demo

// Description:
// Demonstrates DatePicker inputs across Small (sm), Medium (md), and Large (lg) sizes.

// Design:
// - Stacked column layout with 16px vertical gap
// - sm: text-xs, py-1.5, px-2.5
// - md: text-sm, py-2, px-3.5
// - lg: text-base, py-2.5, px-4
// - Full dark mode support

// What it does:
// - Displays three size variations of DatePicker
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import InputSizeDatePicker from '@/TestComponent/Forms/DatePicker/InputSizeDatePicker';
//
// const MyComponent = () => {
//     return <InputSizeDatePicker />
// }
// ```

'use client'

import { HiOutlineCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InputSizeDatePicker({
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
            {/* Small */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-base" />
                </div>
                <input
                    type="date"
                    disabled={disabled || loading}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-8 pr-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>

            {/* Medium */}
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

            {/* Large */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <HiOutlineCalendar className="text-xl" />
                </div>
                <input
                    type="date"
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-11 pr-4 py-2.5 text-base text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
        </div>
    )
}

export default InputSizeDatePicker
