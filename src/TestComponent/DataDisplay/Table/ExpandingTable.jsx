// ExpandingTable

// ExpandingTable · Table demo
// Description:
// Table component with expandable nested rows.
// Allows users to expand individual rows to reveal supplementary metadata, nested logs, or sub-records.
//
// Design:
// - Rotating chevron toggle arrow in the leading column
// - Indented expandable details sub-row with tinted background (bg-gray-50 dark:bg-gray-900/40)
// - Smooth transition on collapse/expand
//
// What it does:
// - Toggles row expansion state independently per record
// - Displays nested details without navigating away from the table view
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
// import ExpandingTable from '@/TestComponent/DataDisplay/Table/ExpandingTable';
//
// const MyComponent = () => {
//     return <ExpandingTable />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const rows = [
    {
        id: '1',
        name: 'Order #9021',
        customer: 'Maria Anders',
        total: '$350.00',
        details: 'Items: 2x Mechanical Keyboards, 1x Desk Mat. Shipping to Berlin, Germany.',
    },
    {
        id: '2',
        name: 'Order #9022',
        customer: 'Francisco Chang',
        total: '$120.50',
        details: 'Items: 1x Wireless Mouse. Shipping to Mexico City, Mexico.',
    },
    {
        id: '3',
        name: 'Order #9023',
        customer: 'Roland Mendel',
        total: '$840.00',
        details: 'Items: 1x 4K Monitor, 1x Monitor Arm. Shipping to Graz, Austria.',
    },
]

export function ExpandingTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [expandedIds, setExpandedIds] = useState(['1'])

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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
                            <th className="w-10 px-4 py-3.5" scope="col" />
                            <th className="px-5 py-3.5" scope="col">Order</th>
                            <th className="px-5 py-3.5" scope="col">Customer</th>
                            <th className="px-5 py-3.5" scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {rows.map((row) => {
                            const isExpanded = expandedIds.includes(row.id)
                            return (
                                <tr key={row.id} className="contents">
                                    <tr className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750">
                                        <td className="px-4 py-3.5">
                                            <button
                                                aria-expanded={isExpanded}
                                                aria-label={`Toggle row ${row.name}`}
                                                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                                type="button"
                                                onClick={() => toggleExpand(row.id)}
                                            >
                                                <HiChevronRight
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isExpanded && 'rotate-90 text-[#2a85ff]',
                                                    )}
                                                />
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                            {row.name}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5">{row.customer}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                                            {row.total}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td
                                                className="border-b border-gray-100 bg-gray-50/70 p-4 text-xs text-gray-600 dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-300"
                                                colSpan={4}
                                            >
                                                <div className="ml-8 flex flex-col gap-1">
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        Detailed Information:
                                                    </span>
                                                    <p>{row.details}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ExpandingTable;
