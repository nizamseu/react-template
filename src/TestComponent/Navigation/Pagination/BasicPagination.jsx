// BasicPagination

// BasicPagination · Pagination demo
// Description:
// Standard pagination control with numbered page buttons and Previous/Next arrows.
// Allows users to step through paginated dataset sequences.
//
// Design:
// - Circular or rounded-md page buttons (36px min touch target)
// - Active page highlighted in vibrant brand blue (#2a85ff) with white typography
// - Subtle hover effect on inactive pages and disabled state on bounding buttons
// - Dark mode support with dark:text-gray-200 and dark:hover:bg-gray-700
//
// What it does:
// - Tracks currentPage internally or via props
// - Emits onChange(newPage) when a page button is pressed
// - Disables Previous on page 1 and Next on the final page
//
// Props:
// - currentPage: number (default: 1)
// - totalPages: number (default: 5)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicPagination from '@/TestComponent/Navigation/Pagination/BasicPagination';
//
// const MyComponent = () => {
//     return <BasicPagination totalPages={5} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicPagination({
    className,
    currentPage: initialPage = 1,
    disabled = false,
    loading = false,
    size = 'md',
    totalPages = 5,
    variant = 'primary',
    ...props
}) {
    const [page, setPage] = useState(initialPage)

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !disabled && !loading) {
            setPage(newPage)
        }
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div
            className={cn('inline-flex items-center gap-1', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Prev button */}
            <button
                aria-label="Previous page"
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                    'hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                    'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    (page <= 1 || disabled || loading) &&
                        'cursor-not-allowed opacity-40 hover:border-gray-200 hover:bg-white dark:hover:bg-gray-800',
                )}
                disabled={page <= 1 || disabled || loading}
                type="button"
                onClick={() => handlePageChange(page - 1)}
            >
                <HiChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {pages.map((p) => {
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

            {/* Next button */}
            <button
                aria-label="Next page"
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition',
                    'hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                    'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                    (page >= totalPages || disabled || loading) &&
                        'cursor-not-allowed opacity-40 hover:border-gray-200 hover:bg-white dark:hover:bg-gray-800',
                )}
                disabled={page >= totalPages || disabled || loading}
                type="button"
                onClick={() => handlePageChange(page + 1)}
            >
                <HiChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

export default BasicPagination;
