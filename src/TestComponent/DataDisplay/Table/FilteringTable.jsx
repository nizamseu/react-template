// FilteringTable

// FilteringTable · Table demo
// Description:
// Searchable table component with real-time text input filtering.
// Enables instant record search across table attributes and shows empty state when no matches exist.
//
// Design:
// - Search bar with magnifying glass icon above table
// - Instant live filtering on keystroke
// - Empty state fallback message
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Filters records matching search query against multiple fields
// - Displays filtered record count
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
// import FilteringTable from '@/TestComponent/DataDisplay/Table/FilteringTable';
//
// const MyComponent = () => {
//     return <FilteringTable />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const dataset = [
    { name: 'Maria Anders', email: 'maria@example.com', role: 'Developer', status: 'Active' },
    { name: 'Francisco Chang', email: 'francisco@example.com', role: 'Designer', status: 'Pending' },
    { name: 'Roland Mendel', email: 'roland@example.com', role: 'Product Lead', status: 'Active' },
    { name: 'Helen Bennett', email: 'helen@example.com', role: 'QA Engineer', status: 'Closed' },
    { name: 'Yoshi Tannamuri', email: 'yoshi@example.com', role: 'DevOps', status: 'Active' },
]

export function FilteringTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [query, setQuery] = useState('')

    const filtered = dataset.filter(
        (row) =>
            row.name.toLowerCase().includes(query.toLowerCase()) ||
            row.email.toLowerCase().includes(query.toLowerCase()) ||
            row.role.toLowerCase().includes(query.toLowerCase()),
    )

    return (
        <div
            className={cn('w-full space-y-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Search Input Bar */}
            <div className="relative max-w-xs">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    aria-label="Filter records"
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="Search name, role, email..."
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                            <tr>
                                <th className="px-5 py-3.5" scope="col">Name</th>
                                <th className="px-5 py-3.5" scope="col">Email</th>
                                <th className="px-5 py-3.5" scope="col">Role</th>
                                <th className="px-5 py-3.5" scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                            {filtered.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                                >
                                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                        {row.name}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                                        {row.email}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3.5">{row.role}</td>
                                    <td className="whitespace-nowrap px-5 py-3.5">
                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#2a85ff] dark:bg-blue-950/40">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td className="p-8 text-center text-xs text-gray-400" colSpan={4}>
                                        No records matching &quot;{query}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default FilteringTable;
