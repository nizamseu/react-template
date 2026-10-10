// DisabledCertainDateCalendar

// DisabledCertainDateCalendar · Calendar demo
// Description:
// Calendar component with selectively disabled dates (e.g. weekends or specific holiday closures).
// Prevents selection of unavailable business days while keeping valid dates interactive.
//
// Design:
// - Disabled dates rendered with cursor-not-allowed and muted opacity (opacity-30)
// - Valid dates retain standard hover and brand blue (#2a85ff) active styling
// - Dark mode support with dark:text-gray-500
//
// What it does:
// - Evaluates whether each day is disabled (e.g. Saturdays, Sundays, specific dates)
// - Prevents click callbacks on disabled days
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DisabledCertainDateCalendar from '@/TestComponent/DataDisplay/Calendar/DisabledCertainDateCalendar';
//
// const MyComponent = () => {
//     return <DisabledCertainDateCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function DisabledCertainDateCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedDate, setSelectedDate] = useState(14)

    // In Oct 2026: Day 1 is Thursday (idx 4)
    // Weekends occur when (day + 4 - 1) % 7 === 0 (Sun) or 6 (Sat)
    const isWeekend = (day) => {
        const dayOfWeek = (day + 4 - 1) % 7
        return dayOfWeek === 0 || dayOfWeek === 6
    }

    return (
        <div
            className={cn(
                'w-full max-w-[300px] mx-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-sm',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex items-center justify-between pb-3">
                <h6 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    October 2026 (Weekdays Only)
                </h6>
                <div className="flex items-center gap-1">
                    <button
                        aria-label="Previous month"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        type="button"
                    >
                        <HiChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        aria-label="Next month"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        type="button"
                    >
                        <HiChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                {weekDays.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isDisabled = isWeekend(day)
                    const isSelected = selectedDate === day
                    return (
                        <button
                            key={day}
                            aria-disabled={isDisabled}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg font-medium transition',
                                isDisabled &&
                                    'cursor-not-allowed opacity-30 text-gray-400 dark:text-gray-600',
                                !isDisabled && isSelected &&
                                    'bg-[#2a85ff] font-bold text-white shadow-sm',
                                !isDisabled && !isSelected &&
                                    'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            disabled={isDisabled || disabled || loading}
                            type="button"
                            onClick={() => !isDisabled && setSelectedDate(day)}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            <div className="mt-3 border-t border-gray-100 pt-2 text-center text-xs text-gray-400">
                Weekends are disabled
            </div>
        </div>
    )
}

export default DisabledCertainDateCalendar;
