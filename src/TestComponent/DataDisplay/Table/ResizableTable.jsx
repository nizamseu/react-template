// ResizableTable

// ResizableTable · Table demo
// Description:
// Table component featuring resizable columns.
// Enables users to adjust column widths dynamically using drag handles or preset width toggles.
//
// Design:
// - Column border separator handles (cursor-col-resize)
// - Dynamic inline style width allocation
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Tracks column widths in state
// - Allows user to adjust column widths
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
// import ResizableTable from '@/TestComponent/DataDisplay/Table/ResizableTable';
//
// const MyComponent = () => {
//     return <ResizableTable />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const sampleRows = [
    { name: 'Maria Anders', company: 'Alfreds Futterkiste', country: 'Germany' },
    { name: 'Francisco Chang', company: 'Centro Moctezuma', country: 'Mexico' },
    { name: 'Roland Mendel', company: 'Ernst Handel', country: 'Austria' },
]

export function ResizableTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [widths, setWidths] = useState({ col1: 180, col2: 240, col3: 160 })

    const expandCol = (col) => {
        setWidths((prev) => ({
            ...prev,
            [col]: prev[col] === 180 ? 260 : 180,
        }))
    }

    return (
        <div
            className={cn('w-full space-y-2', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Click column headers to toggle column widths:</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                            <tr>
                                <th
                                    className="cursor-pointer select-none px-5 py-3.5 transition hover:text-[#2a85ff]"
                                    scope="col"
                                    style={{ width: widths.col1 }}
                                    onClick={() => expandCol('col1')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Name ({widths.col1}px)</span>
                                        <span className="text-[10px] text-gray-400">⇄</span>
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer select-none px-5 py-3.5 transition hover:text-[#2a85ff]"
                                    scope="col"
                                    style={{ width: widths.col2 }}
                                    onClick={() => expandCol('col2')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Company ({widths.col2}px)</span>
                                        <span className="text-[10px] text-gray-400">⇄</span>
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer select-none px-5 py-3.5 transition hover:text-[#2a85ff]"
                                    scope="col"
                                    style={{ width: widths.col3 }}
                                    onClick={() => expandCol('col3')}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Country ({widths.col3}px)</span>
                                        <span className="text-[10px] text-gray-400">⇄</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                            {sampleRows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                                >
                                    <td className="truncate px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100" style={{ maxWidth: widths.col1 }}>
                                        {row.name}
                                    </td>
                                    <td className="truncate px-5 py-3.5" style={{ maxWidth: widths.col2 }}>
                                        {row.company}
                                    </td>
                                    <td className="truncate px-5 py-3.5 text-gray-500 dark:text-gray-400" style={{ maxWidth: widths.col3 }}>
                                        {row.country}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ResizableTable;
