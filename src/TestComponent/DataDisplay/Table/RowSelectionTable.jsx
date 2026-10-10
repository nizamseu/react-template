// RowSelectionTable

// RowSelectionTable · Table demo
// Description:
// Table component supporting multi-row checkbox selection and batch actions.
// Enables users to select individual rows or toggle all rows simultaneously via the header checkbox.
//
// Design:
// - Checkboxes in the first column with brand blue (#2a85ff) accents
// - Selected rows highlighted with subtle blue background (bg-blue-50/50 dark:bg-blue-950/20)
// - Floating or inline batch action counter ("X rows selected")
//
// What it does:
// - Tracks selectedRowIds set
// - Toggles individual rows or selects/deselects all rows
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
// import RowSelectionTable from '@/TestComponent/DataDisplay/Table/RowSelectionTable';
//
// const MyComponent = () => {
//     return <RowSelectionTable />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const rows = [
    { id: '1', name: 'Maria Anders', role: 'Developer', location: 'Germany' },
    { id: '2', name: 'Francisco Chang', role: 'Designer', location: 'Mexico' },
    { id: '3', name: 'Roland Mendel', role: 'Product Lead', location: 'Austria' },
    { id: '4', name: 'Helen Bennett', role: 'QA Lead', location: 'UK' },
    { id: '5', name: 'Yoshi Tannamuri', role: 'DevOps', location: 'Canada' },
]

export function RowSelectionTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedIds, setSelectedIds] = useState(['1', '3'])

    const allSelected = selectedIds.length === rows.length
    const someSelected = selectedIds.length > 0 && !allSelected

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(rows.map((r) => r.id))
        }
    }

    const toggleRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    return (
        <div
            className={cn('w-full space-y-2', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Batch Status Bar */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                    {selectedIds.length} of {rows.length} row{selectedIds.length !== 1 ? 's' : ''} selected
                </span>
                {selectedIds.length > 0 && (
                    <button
                        className="font-semibold text-red-600 hover:underline dark:text-red-400"
                        type="button"
                        onClick={() => setSelectedIds([])}
                    >
                        Clear selection
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                            <tr>
                                <th className="w-12 px-4 py-3.5" scope="col">
                                    <input
                                        ref={(input) => {
                                            if (input) input.indeterminate = someSelected
                                        }}
                                        aria-label="Select all rows"
                                        checked={allSelected}
                                        className="h-4 w-4 rounded border-gray-300 text-[#2a85ff] focus:ring-[#2a85ff]"
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-5 py-3.5" scope="col">Name</th>
                                <th className="px-5 py-3.5" scope="col">Role</th>
                                <th className="px-5 py-3.5" scope="col">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                            {rows.map((row) => {
                                const isSelected = selectedIds.includes(row.id)
                                return (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            'transition',
                                            isSelected
                                                ? 'bg-blue-50/60 dark:bg-blue-950/30'
                                                : 'hover:bg-gray-50/80 dark:hover:bg-gray-750',
                                        )}
                                    >
                                        <td className="px-4 py-3.5">
                                            <input
                                                aria-label={`Select row ${row.name}`}
                                                checked={isSelected}
                                                className="h-4 w-4 rounded border-gray-300 text-[#2a85ff] focus:ring-[#2a85ff]"
                                                type="checkbox"
                                                onChange={() => toggleRow(row.id)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                            {row.name}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5">{row.role}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-gray-500 dark:text-gray-400">
                                            {row.location}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RowSelectionTable;
