// PaginationTable

// PaginationTable · Table demo
// Description:
// Table component integrated with paginated page-stepping controls.
// Splits larger datasets across bite-sized pages and provides controls to navigate through pages.
//
// Design:
// - Clean bottom pagination footer with item range summary (e.g. "Showing 1-3 of 8")
// - Page navigation buttons with brand blue (#2a85ff) active highlight
// - Responsive horizontal overflow container
//
// What it does:
// - Paginates array data into distinct pages
// - Handles previous/next and direct page jumping
//
// Props:
// - pageSize: number (default: 3)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import PaginationTable from '@/TestComponent/DataDisplay/Table/PaginationTable';
//
// const MyComponent = () => {
//     return <PaginationTable pageSize={3} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const allRows = [
    { id: 1, name: 'Maria Anders', company: 'Alfreds Futterkiste', country: 'Germany' },
    { id: 2, name: 'Francisco Chang', company: 'Centro Moctezuma', country: 'Mexico' },
    { id: 3, name: 'Roland Mendel', company: 'Ernst Handel', country: 'Austria' },
    { id: 4, name: 'Helen Bennett', company: 'Island Trading', country: 'UK' },
    { id: 5, name: 'Yoshi Tannamuri', company: 'Laughing Bacchus', country: 'Canada' },
    { id: 6, name: 'Giovanni Rovelli', company: 'Magazzini Alimentari', country: 'Italy' },
    { id: 7, name: 'Simon Crowther', company: 'North/South Logistics', country: 'UK' },
    { id: 8, name: 'Marie Bertrand', company: 'Paris Spécialités', country: 'France' },
]

export function PaginationTable({
    className,
    disabled = false,
    loading = false,
    pageSize = 3,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(allRows.length / pageSize)

    const startIndex = (page - 1) * pageSize
    const currentRows = allRows.slice(startIndex, startIndex + pageSize)

    return (
        <div
            className={cn('w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                        <tr>
                            <th className="px-5 py-3.5" scope="col">ID</th>
                            <th className="px-5 py-3.5" scope="col">Name</th>
                            <th className="px-5 py-3.5" scope="col">Company</th>
                            <th className="px-5 py-3.5" scope="col">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {currentRows.map((row) => (
                            <tr
                                key={row.id}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-gray-400">
                                    #{row.id}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                    {row.name}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">{row.company}</td>
                                <td className="whitespace-nowrap px-5 py-3.5 text-gray-500 dark:text-gray-400">
                                    {row.country}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-5 py-3 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing <strong>{startIndex + 1}</strong>-<strong>{Math.min(startIndex + pageSize, allRows.length)}</strong> of{' '}
                    <strong>{allRows.length}</strong>
                </span>

                <div className="flex items-center gap-1">
                    <button
                        aria-label="Previous page"
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
                            page <= 1 && 'cursor-not-allowed opacity-30',
                        )}
                        disabled={page <= 1 || disabled || loading}
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <HiChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition',
                                page === p
                                    ? 'bg-[#2a85ff] text-white shadow-xs'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        aria-label="Next page"
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
                            page >= totalPages && 'cursor-not-allowed opacity-30',
                        )}
                        disabled={page >= totalPages || disabled || loading}
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        <HiChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaginationTable;
