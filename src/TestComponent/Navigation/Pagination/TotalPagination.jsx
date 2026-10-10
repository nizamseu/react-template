// TotalPagination

// TotalPagination · Pagination demo
// Description:
// Pagination component featuring an informative item counter summary.
// Informs users of the total item volume and current range while providing pagination navigation.
//
// Design:
// - Left-aligned total indicator text with subtle gray tone
// - Standard pagination buttons with brand blue (#2a85ff) active highlight
// - Clean horizontal flex alignment with responsive wrap
// - Dark mode support with dark:text-gray-300 and dark:bg-gray-800
//
// What it does:
// - Calculates item range: "Showing X-Y of Z items" or "Total: Z items"
// - Handles page transitions
// - Disables previous/next when boundary is reached
//
// Props:
// - total: number (default: 50)
// - pageSize: number (default: 10)
// - displayTotal: boolean (default: true)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import TotalPagination from '@/TestComponent/Navigation/Pagination/TotalPagination';
//
// const MyComponent = () => {
//     return <TotalPagination displayTotal total={50} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TotalPagination({
    className,
    disabled = false,
    displayTotal = true,
    loading = false,
    pageSize = 10,
    size = 'md',
    total = 50,
    variant = 'primary',
    ...props
}) {
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(total / pageSize)

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
            {displayTotal && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>
                        Showing <strong className="text-gray-800 dark:text-gray-200">{startItem}-{endItem}</strong> of{' '}
                        <strong className="text-gray-800 dark:text-gray-200">{total}</strong> items
                    </span>
                </div>
            )}

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

export default TotalPagination;
