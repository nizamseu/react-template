// MultipleSelectionCalendar

// MultipleSelectionCalendar · Calendar demo
// Description:
// Calendar component allowing multiple distinct, non-consecutive dates to be selected simultaneously.
// Perfect for shift scheduling, recurring appointment picking, and custom day filters.
//
// Design:
// - Selected dates highlighted with brand blue (#2a85ff) rounded capsules
// - Clear tag chips summary displaying selected count
// - Smooth toggling upon click
//
// What it does:
// - Toggles date presence in selectedDates array upon click
// - Emits list of selected dates
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
// import MultipleSelectionCalendar from '@/TestComponent/DataDisplay/Calendar/MultipleSelectionCalendar';
//
// const MyComponent = () => {
//     return <MultipleSelectionCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function MultipleSelectionCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedDays, setSelectedDays] = useState([5, 12, 19, 26])

    const toggleDay = (day) => {
        if (disabled || loading) return
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
        )
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

            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDays.includes(day)
                    return (
                        <button
                            key={day}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg font-medium transition',
                                isSelected
                                    ? 'bg-[#2a85ff] font-bold text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => toggleDay(day)}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            <div className="mt-3 border-t border-gray-100 pt-2 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {selectedDays.length} date{selectedDays.length !== 1 ? 's' : ''} selected
            </div>
        </div>
    )
}

export default MultipleSelectionCalendar;
