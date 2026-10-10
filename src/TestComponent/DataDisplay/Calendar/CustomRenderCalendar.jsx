// CustomRenderCalendar

// CustomRenderCalendar · Calendar demo
// Description:
// Calendar component featuring custom day cell rendering with event dots and special date styling.
// Enables highlight of schedules, holidays, and deadlines directly on the monthly grid.
//
// Design:
// - Small micro-dots under days with events
// - Colored dates for special events (e.g. date 12 has event badge, date 18 is highlighted)
// - Selected day highlight with brand blue (#2a85ff)
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders badges and indicators below specific dates
// - Supports clicking to view date details
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
// import CustomRenderCalendar from '@/TestComponent/DataDisplay/Calendar/CustomRenderCalendar';
//
// const MyComponent = () => {
//     return <CustomRenderCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const eventDays = [12, 18, 24]
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CustomRenderCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedDate, setSelectedDate] = useState(12)

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

            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
                {/* 4 empty padding days for Thursday start */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9 w-8" />
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDate === day
                    const hasEvent = eventDays.includes(day)
                    return (
                        <button
                            key={day}
                            className={cn(
                                'relative flex h-9 w-8 flex-col items-center justify-center rounded-lg font-medium transition',
                                isSelected
                                    ? 'bg-[#2a85ff] font-bold text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => setSelectedDate(day)}
                        >
                            <span>{day}</span>
                            {hasEvent && (
                                <span
                                    className={cn(
                                        'h-1 w-1 rounded-full',
                                        isSelected ? 'bg-white' : 'bg-red-500',
                                    )}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default CustomRenderCalendar;
