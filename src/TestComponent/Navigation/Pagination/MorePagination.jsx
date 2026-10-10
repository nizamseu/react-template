// MorePagination

// MorePagination · Pagination demo
// Description:
// Pagination component designed for large dataset ranges with truncated ellipses (...).
// Handles large page counts gracefully without overflowing horizontal container space.
//
// Design:
// - Dynamic windowing showing first page, current page neighbourhood, and last page
// - Elegant ellipsis placeholder (...) for skipped page ranges
// - Brand blue (#2a85ff) active highlight
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Renders two paginations (total: 50 items and 100 items with pageSize: 10)
// - Computes visible page ranges dynamically
// - Supports clicking ellipsis or direct page numbers to jump
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
// import MorePagination from '@/TestComponent/Navigation/Pagination/MorePagination';
//
// const MyComponent = () => {
//     return <MorePagination total={100} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

function PaginationBar({ currentPage, onPageChange, totalPages }) {
    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages]
        }
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    const pages = getPageNumbers()

    return (
        <div className="inline-flex items-center gap-1">
            <button
                aria-label="Previous page"
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                    'hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    currentPage <= 1 && 'cursor-not-allowed opacity-40',
                )}
                disabled={currentPage <= 1}
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
            >
                <HiChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((p, idx) => {
                if (p === '...') {
                    return (
                        <span
                            key={`ellipsis-${idx}`}
                            className="flex h-9 w-8 items-center justify-center text-sm font-medium text-gray-400 dark:text-gray-500"
                        >
                            ...
                        </span>
                    )
                }

                const isActive = currentPage === p
                return (
                    <button
                        key={p}
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition',
                            isActive
                                ? 'bg-[#2a85ff] text-white shadow-sm'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                        )}
                        type="button"
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            })}

            <button
                aria-label="Next page"
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                    'hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    currentPage >= totalPages && 'cursor-not-allowed opacity-40',
                )}
                disabled={currentPage >= totalPages}
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
            >
                <HiChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

export function MorePagination({
    className,
    disabled = false,
    loading = false,
    pageSize = 10,
    size = 'md',
    total = 100,
    variant = 'primary',
    ...props
}) {
    const [page1, setPage1] = useState(1)
    const [page2, setPage2] = useState(5)

    return (
        <div
            className={cn('flex flex-col gap-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Total 50 items (5 pages) */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total: 50 items (5 pages)
                </span>
                <PaginationBar
                    currentPage={page1}
                    totalPages={5}
                    onPageChange={setPage1}
                />
            </div>

            {/* Total 100 items (10 pages) with ellipsis */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total: {total} items ({Math.ceil(total / pageSize)} pages) with Ellipsis
                </span>
                <PaginationBar
                    currentPage={page2}
                    totalPages={Math.ceil(total / pageSize)}
                    onPageChange={setPage2}
                />
            </div>
        </div>
    )
}

export default MorePagination;
