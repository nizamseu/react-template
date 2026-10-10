// BasicCalendar

// BasicCalendar · Calendar demo
// Description:
// Interactive month calendar grid with date selection and month navigation.
// Enables users to browse months and select a single date.
//
// Design:
// - Clean 7-column calendar grid (Su, Mo, Tu, We, Th, Fr, Sa)
// - Selected date highlighted in vibrant brand blue (#2a85ff) with white text
// - Today indicator ring
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders days of active month
// - Handles month navigation (Previous/Next month)
// - Tracks selected date state and triggers onChange
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
// import BasicCalendar from '@/TestComponent/DataDisplay/Calendar/BasicCalendar';
//
// const MyComponent = () => {
//     return <BasicCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function BasicCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 10)) // Oct 2026
    const [selectedDate, setSelectedDate] = useState(10)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const prevMonth = () => {
        if (!disabled && !loading) {
            setCurrentDate(new Date(year, month - 1, 1))
        }
    }

    const nextMonth = () => {
        if (!disabled && !loading) {
            setCurrentDate(new Date(year, month + 1, 1))
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
            {/* Header: Month & Year Navigator */}
            <div className="flex items-center justify-between pb-3">
                <h6 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {monthNames[month]} {year}
                </h6>
                <div className="flex items-center gap-1">
                    <button
                        aria-label="Previous month"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        disabled={disabled || loading}
                        type="button"
                        onClick={prevMonth}
                    >
                        <HiChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        aria-label="Next month"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        disabled={disabled || loading}
                        type="button"
                        onClick={nextMonth}
                    >
                        <HiChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                {weekDays.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDate === day
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
                            onClick={() => setSelectedDate(day)}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default BasicCalendar;
