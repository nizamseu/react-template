// AffixTimeInput

// AffixTimeInput · TimeInput demo

// Description:
// Demonstrates TimeInput components with custom prefix and suffix clock icons.

// Design:
// - Stacked column layout with 16px vertical gap
// - Left prefix clock icon on first input
// - Right suffix solid clock icon on second input
// - Full dark mode support

// What it does:
// - Displays custom prefix and suffix icon arrangements
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AffixTimeInput from '@/TestComponent/Forms/TimeInput/AffixTimeInput';
//
// const MyComponent = () => {
//     return <AffixTimeInput />
// }
// ```

'use client'

import { HiOutlineClock, HiClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AffixTimeInput({
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
            {/* Prefix Clock */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineClock className="text-lg" />
                </div>
                <input
                    type="time"
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>

            {/* Suffix Clock */}
            <div className="relative">
                <input
                    type="time"
                    disabled={disabled || loading}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3.5 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <HiClock className="text-lg text-[#2a85ff]" />
                </div>
            </div>
        </div>
    )
}

export default AffixTimeInput
