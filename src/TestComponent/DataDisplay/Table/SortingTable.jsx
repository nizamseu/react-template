// SortingTable

// SortingTable · Table demo
// Description:
// Interactive table with sortable column headers. Users can click any header column to toggle
// between ascending and descending alphabetical or numerical sort orders.
//
// Design:
// - Sort direction indicator arrows (HiArrowSmUp, HiArrowSmDown) on active column
// - Hover effect on clickable header columns
// - Active sorted column highlighted in brand blue (#2a85ff)
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Tracks sortColumn and sortDirection ('asc' | 'desc')
// - Re-sorts dataset dynamically upon column header click
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
// import SortingTable from '@/TestComponent/DataDisplay/Table/SortingTable';
//
// const MyComponent = () => {
//     return <SortingTable />
// }
// ```

'use client'

import { useState } from 'react';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const initialData = [
    { name: 'Maria Anders', age: 24, visits: 28, progress: 56, status: 'Active' },
    { name: 'Francisco Chang', age: 39, visits: 90, progress: 85, status: 'Pending' },
    { name: 'Roland Mendel', age: 45, visits: 12, progress: 30, status: 'Active' },
    { name: 'Helen Bennett', age: 31, visits: 64, progress: 92, status: 'Closed' },
    { name: 'Yoshi Tannamuri', age: 28, visits: 42, progress: 74, status: 'Active' },
]

export function SortingTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [sortCol, setSortCol] = useState('name')
    const [sortDir, setSortDir] = useState('asc')

    const handleSort = (col) => {
        if (sortCol === col) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortCol(col)
            setSortDir('asc')
        }
    }

    const sortedData = [...initialData].sort((a, b) => {
        const valA = a[sortCol]
        const valB = b[sortCol]
        if (typeof valA === 'number') {
            return sortDir === 'asc' ? valA - valB : valB - valA
        }
        return sortDir === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA))
    })

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
                            {[
                                { key: 'name', label: 'Name' },
                                { key: 'age', label: 'Age' },
                                { key: 'visits', label: 'Visits' },
                                { key: 'progress', label: 'Progress (%)' },
                                { key: 'status', label: 'Status' },
                            ].map((col) => {
                                const isSorted = sortCol === col.key
                                return (
                                    <th
                                        key={col.key}
                                        className="cursor-pointer select-none px-5 py-3.5 transition hover:text-gray-900 dark:hover:text-gray-100"
                                        scope="col"
                                        onClick={() => handleSort(col.key)}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className={cn(isSorted && 'text-[#2a85ff]')}>
                                                {col.label}
                                            </span>
                                            {isSorted && (
                                                sortDir === 'asc'
                                                    ? <HiArrowSmUp className="h-4 w-4 text-[#2a85ff]" />
                                                    : <HiArrowSmDown className="h-4 w-4 text-[#2a85ff]" />
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {sortedData.map((row, idx) => (
                            <tr
                                key={idx}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                    {row.name}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">{row.age}</td>
                                <td className="whitespace-nowrap px-5 py-3.5">{row.visits}</td>
                                <td className="whitespace-nowrap px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-1.5 rounded-full bg-[#2a85ff]"
                                                style={{ width: `${row.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs">{row.progress}%</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">
                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2a85ff] dark:bg-blue-950/40">
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SortingTable;
