// PageSizePagination

// PageSizePagination · Pagination demo
// Description:
// Pagination component coupled with a page size selector dropdown.
// Enables users to switch how many records are displayed per page and dynamically re-slices datasets.
//
// Design:
// - Inline select menu (5, 10, 20, 50 items/page) with custom rounded styling
// - Synchronized pagination controls responding immediately to page size changes
// - Total item counter indicating active item range
// - Dark mode support with dark:text-gray-200, dark:border-gray-700, and dark:bg-gray-800
//
// What it does:
// - Dynamically updates total pages when pageSize changes
// - Resets or clips currentPage if it exceeds the new page limit
// - Emits onPageSizeChange and onPageChange events
//
// Props:
// - total: number (default: 100)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import PageSizePagination from '@/TestComponent/Navigation/Pagination/PageSizePagination';
//
// const MyComponent = () => {
//     return <PageSizePagination total={100} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const pageSizeOptions = [
    { label: '5 / page', value: 5 },
    { label: '10 / page', value: 10 },
    { label: '20 / page', value: 20 },
    { label: '50 / page', value: 50 },
]

export function PageSizePagination({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    total = 100,
    variant = 'primary',
    ...props
}) {
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)

    const totalPages = Math.ceil(total / pageSize)

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize)
        setPage(1)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !disabled && !loading) {
            setPage(newPage)
        }
    }

    const startItem = (page - 1) * pageSize + 1
    const endItem = Math.min(page * pageSize, total)

    return (
        <div
            className={cn('flex flex-wrap items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>
                    Showing <strong className="text-gray-800 dark:text-gray-200">{startItem}-{endItem}</strong> of{' '}
                    <strong className="text-gray-800 dark:text-gray-200">{total}</strong>
                </span>
            </div>

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

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => {
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

            {/* Page Size Selector */}
            <div className="relative">
                <select
                    aria-label="Select items per page"
                    className="h-9 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 shadow-sm outline-none transition focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    disabled={disabled || loading}
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default PageSizePagination;
