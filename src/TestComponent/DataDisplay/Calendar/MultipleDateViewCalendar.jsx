// MultipleDateViewCalendar

// MultipleDateViewCalendar · Calendar demo
// Description:
// Dual-month calendar component rendering two consecutive months side-by-side.
// Enables cross-month scheduling and long-range timeline visibility.
//
// Design:
// - Two-column responsive month grid (October & November 2026)
// - Synchronized header navigation
// - Cohesive brand blue (#2a85ff) date selection
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders two adjacent months side by side
// - Allows selecting dates across either month
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
// import MultipleDateViewCalendar from '@/TestComponent/DataDisplay/Calendar/MultipleDateViewCalendar';
//
// const MyComponent = () => {
//     return <MultipleDateViewCalendar />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function MonthGrid({ daysCount, monthName, onSelect, selectedDate, startOffset }) {
    return (
        <div className="flex-1">
            <h6 className="pb-3 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                {monthName}
            </h6>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                {weekDays.map((d) => (
                    <div key={d} className="py-1">
                        {d}
                    </div>
                ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 w-8" />
                ))}
                {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDate === `${monthName}-${day}`
                    return (
                        <button
                            key={day}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg font-medium transition',
                                isSelected
                                    ? 'bg-[#2a85ff] font-bold text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            type="button"
                            onClick={() => onSelect(`${monthName}-${day}`)}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export function MultipleDateViewCalendar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedDate, setSelectedDate] = useState('October 2026-15')

    return (
        <div
            className={cn(
                'w-full max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2a85ff]">
                    Multi-Month View
                </span>
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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <MonthGrid
                    daysCount={31}
                    monthName="October 2026"
                    selectedDate={selectedDate}
                    startOffset={4}
                    onSelect={setSelectedDate}
                />
                <MonthGrid
                    daysCount={30}
                    monthName="November 2026"
                    selectedDate={selectedDate}
                    startOffset={0}
                    onSelect={setSelectedDate}
                />
            </div>
        </div>
    )
}

export default MultipleDateViewCalendar;
