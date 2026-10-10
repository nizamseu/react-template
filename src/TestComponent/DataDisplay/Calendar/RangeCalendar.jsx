// RangeCalendar

// RangeCalendar · Calendar demo
// Description:
// Date range picker calendar component for booking, reservation, or reporting date intervals.
// Highlights start date, end date, and the continuous interval between them.
//
// Design:
// - Start & End date endpoints styled with brand blue (#2a85ff) circles
// - Continuous interval filled with subtle blue tint (bg-blue-50 dark:bg-blue-950/40)
// - Clear range indicator summary below the calendar
//
// What it does:
// - Allows selecting a start date and an end date
// - Highlights the intermediate date span
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
// import RangeCalendar from '@/TestComponent/DataDisplay/Calendar/RangeCalendar';
//
// const MyComponent = () => {
//     return <RangeCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function RangeCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [range, setRange] = useState({ start: 10, end: 18 })

    const handleDateClick = (day) => {
        if (disabled || loading) return
        if (range.start && !range.end) {
            if (day >= range.start) {
                setRange({ start: range.start, end: day })
            } else {
                setRange({ start: day, end: range.start })
            }
        } else {
            setRange({ start: day, end: null })
        }
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
                    October 2026
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

            <div className="mt-1 grid grid-cols-7 text-center text-xs">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isStart = range.start === day
                    const isEnd = range.end === day
                    const isInRange = range.start && range.end && day > range.start && day < range.end

                    return (
                        <button
                            key={day}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center text-xs font-medium transition',
                                (isStart || isEnd) &&
                                    'rounded-lg bg-[#2a85ff] font-bold text-white shadow-sm',
                                isInRange &&
                                    'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-300',
                                !isStart && !isEnd && !isInRange &&
                                    'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => handleDateClick(day)}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            <div className="mt-3 border-t border-gray-100 pt-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Range: Oct {range.start || '--'} - Oct {range.end || '--'}, 2026
            </div>
        </div>
    )
}

export default RangeCalendar;
