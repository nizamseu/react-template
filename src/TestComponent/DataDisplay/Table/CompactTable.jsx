// CompactTable

// CompactTable · Table demo
// Description:
// High-density table with condensed vertical cell padding for maximizing visible information on screen.
// Ideal for financial data tables, log viewers, and admin inventory listings.
//
// Design:
// - Compact row spacing (py-2 px-3 text-xs)
// - Subtle alternating row shading
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Renders data-dense rows without wasting vertical display space
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "sm" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import CompactTable from '@/TestComponent/DataDisplay/Table/CompactTable';
//
// const MyComponent = () => {
//     return <CompactTable />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const sampleRows = [
    { id: '101', company: 'Alfreds Futterkiste', contact: 'Maria Anders', country: 'Germany', status: 'Active' },
    { id: '102', company: 'Centro Moctezuma', contact: 'Francisco Chang', country: 'Mexico', status: 'Pending' },
    { id: '103', company: 'Ernst Handel', contact: 'Roland Mendel', country: 'Austria', status: 'Active' },
    { id: '104', company: 'Island Trading', contact: 'Helen Bennett', country: 'UK', status: 'Inactive' },
    { id: '105', company: 'Kaffi Hús', contact: 'Sven Gunnar', country: 'Iceland', status: 'Active' },
]

export function CompactTable({
    className,
    disabled = false,
    loading = false,
    size = 'sm',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700 dark:text-gray-200">
                    <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                        <tr>
                            <th className="px-3.5 py-2" scope="col">ID</th>
                            <th className="px-3.5 py-2" scope="col">Company</th>
                            <th className="px-3.5 py-2" scope="col">Contact</th>
                            <th className="px-3.5 py-2" scope="col">Country</th>
                            <th className="px-3.5 py-2" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {sampleRows.map((row) => (
                            <tr
                                key={row.id}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="whitespace-nowrap px-3.5 py-2 font-mono text-gray-400">
                                    {row.id}
                                </td>
                                <td className="whitespace-nowrap px-3.5 py-2 font-semibold text-gray-900 dark:text-gray-100">
                                    {row.company}
                                </td>
                                <td className="whitespace-nowrap px-3.5 py-2">{row.contact}</td>
                                <td className="whitespace-nowrap px-3.5 py-2 text-gray-500 dark:text-gray-400">
                                    {row.country}
                                </td>
                                <td className="whitespace-nowrap px-3.5 py-2">
                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#2a85ff] dark:bg-blue-950/40">
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

export default CompactTable;
