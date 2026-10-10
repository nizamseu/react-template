// CountOverflowBadge

// CountOverflowBadge · Badge demo
// Description:
// Badge component with dynamic overflow clipping (e.g. 99+, 9+).
// Prevents excessively wide badges from overflowing or distorting compact UI elements.
//
// Design:
// - Red rounded capsule with proportional width padding
// - Crisp white knockout border ring (ring-2 ring-white dark:ring-gray-900)
// - Bold white typography
// - Dark mode support with dark:ring-gray-900
//
// What it does:
// - Evaluates count > maxCount and formats as `${maxCount}+`
// - Displays exact count when within limit
//
// Props:
// - maxCount: number (default: 99)
// - count: number (default: 120)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import CountOverflowBadge from '@/TestComponent/DataDisplay/Badge/CountOverflowBadge';
//
// const MyComponent = () => {
//     return <CountOverflowBadge count={120} maxCount={99} />
// }
// ```

'use client'

import { HiOutlineMail } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CountOverflowBadge({
    className,
    count = 120,
    disabled = false,
    loading = false,
    maxCount = 99,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const formatCount = (val, max) => (val > max ? `${max}+` : val)

    return (
        <div
            className={cn('flex flex-wrap items-center gap-8', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Example 1: maxCount 9 */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineMail className="h-6 w-6" />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white shadow-sm dark:ring-gray-900">
                        {formatCount(12, 9)}
                    </span>
                </div>
                <span className="text-xs text-gray-400">maxCount: 9 (12 → 9+)</span>
            </div>

            {/* Example 2: maxCount 99 */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineMail className="h-6 w-6" />
                    </div>
                    <span className="absolute -right-2.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-white shadow-sm dark:ring-gray-900">
                        {formatCount(count, maxCount)}
                    </span>
                </div>
                <span className="text-xs text-gray-400">maxCount: 99 ({count} → 99+)</span>
            </div>
        </div>
    )
}

export default CountOverflowBadge;
