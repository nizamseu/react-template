// ControlledPagination

// ControlledPagination · Pagination demo
// Description:
// Fully controlled pagination component driven by external state and action triggers.
// Demonstrates how parent components can programmatically navigate or synchronize page positions.
//
// Design:
// - Control bar above pagination containing quick jump action buttons
// - Synchronized active page indicator in brand blue (#2a85ff)
// - Informational pill badge displaying active page state
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Accepts currentPage from props/state and responds to onChange
// - Quick step buttons (First, Prev, Next, Last, Jump to 5) update the external state
// - Disables boundary buttons appropriately
//
// Props:
// - total: number (default: 100)
// - pageSize: number (default: 10)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import ControlledPagination from '@/TestComponent/Navigation/Pagination/ControlledPagination';
//
// const MyComponent = () => {
//     return <ControlledPagination />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ControlledPagination({
    className,
    disabled = false,
    loading = false,
    pageSize = 10,
    size = 'md',
    total = 100,
    variant = 'primary',
    ...props
}) {
    const totalPages = Math.ceil(total / pageSize)
    const [page, setPage] = useState(6)

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !disabled && !loading) {
            setPage(newPage)
        }
    }

    return (
        <div
            className={cn('flex flex-col gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* External Controls */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    External Controls:
                </span>
                <button
                    className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    type="button"
                    onClick={() => handlePageChange(1)}
                >
                    First Page (1)
                </button>
                <button
                    className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    type="button"
                    onClick={() => handlePageChange(5)}
                >
                    Jump to 5
                </button>
                <button
                    className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    type="button"
                    onClick={() => handlePageChange(totalPages)}
                >
                    Last Page ({totalPages})
                </button>
                <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400">
                    Current: Page {page} of {totalPages}
                </span>
            </div>

            {/* Pagination Bar */}
            <div className="inline-flex items-center gap-1">
                <button
                    aria-label="Previous page"
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                        (page <= 1 || disabled || loading) && 'cursor-not-allowed opacity-40',
                    )}
                    disabled={page <= 1 || disabled || loading}
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                >
                    <HiChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = page === p
                    return (
                        <button
                            key={p}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                                isActive
                                    ? 'bg-[#2a85ff] text-white shadow-sm'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => handlePageChange(p)}
                        >
                            {p}
                        </button>
                    )
                })}

                <button
                    aria-label="Next page"
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                        (page >= totalPages || disabled || loading) && 'cursor-not-allowed opacity-40',
                    )}
                    disabled={page >= totalPages || disabled || loading}
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                >
                    <HiChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default ControlledPagination;
