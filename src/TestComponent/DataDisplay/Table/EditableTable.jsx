// EditableTable

// EditableTable · Table demo
// Description:
// Table component featuring inline cell editing. Users can directly modify cell values via embedded
// inputs and save edits instantly.
//
// Design:
// - Subtle border input inputs that blend seamlessly into table cells
// - Focus ring in brand blue (#2a85ff)
// - Status feedback showing saved changes
//
// What it does:
// - Updates row value dynamically as user edits cells
// - Preserves row and column structure
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
// import EditableTable from '@/TestComponent/DataDisplay/Table/EditableTable';
//
// const MyComponent = () => {
//     return <EditableTable />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const initialRows = [
    { id: 1, name: 'Maria Anders', role: 'Developer', rate: '$45/hr' },
    { id: 2, name: 'Francisco Chang', role: 'Designer', rate: '$40/hr' },
    { id: 3, name: 'Roland Mendel', role: 'Lead Architect', rate: '$65/hr' },
]

export function EditableTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [rows, setRows] = useState(initialRows)

    const updateCell = (id, field, value) => {
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
        )
    }

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
                            <th className="px-5 py-3.5" scope="col">Name (Editable)</th>
                            <th className="px-5 py-3.5" scope="col">Role (Editable)</th>
                            <th className="px-5 py-3.5" scope="col">Hourly Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td className="px-5 py-2.5">
                                    <input
                                        aria-label={`Edit name for row ${row.id}`}
                                        className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#2a85ff] focus:bg-white focus:ring-1 focus:ring-[#2a85ff] dark:text-gray-100 dark:focus:bg-gray-700"
                                        disabled={disabled || loading}
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => updateCell(row.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="px-5 py-2.5">
                                    <input
                                        aria-label={`Edit role for row ${row.id}`}
                                        className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-gray-600 outline-none transition focus:border-[#2a85ff] focus:bg-white focus:ring-1 focus:ring-[#2a85ff] dark:text-gray-300 dark:focus:bg-gray-700"
                                        disabled={disabled || loading}
                                        type="text"
                                        value={row.role}
                                        onChange={(e) => updateCell(row.id, 'role', e.target.value)}
                                    />
                                </td>
                                <td className="whitespace-nowrap px-5 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    {row.rate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EditableTable;
