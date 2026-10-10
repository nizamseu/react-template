// GroupTable

// GroupTable · Table demo
// Description:
// Table component featuring multi-tiered grouped column headers.
// Clusters related table columns under parent section categories for complex data schemas.
//
// Design:
// - Two-tier header rows with colSpan dividers
// - Center-aligned group categories and left-aligned leaf headers
// - Subtle border separation between column groups
//
// What it does:
// - Renders hierarchical grouped column headers
// - Organizes related attributes logically
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
// import GroupTable from '@/TestComponent/DataDisplay/Table/GroupTable';
//
// const MyComponent = () => {
//     return <GroupTable />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const data = [
    { name: 'Maria Anders', email: 'maria@test.com', visits: 28, score: '94%' },
    { name: 'Francisco Chang', email: 'chang@test.com', visits: 90, score: '88%' },
    { name: 'Roland Mendel', email: 'roland@test.com', visits: 12, score: '76%' },
]

export function GroupTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
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
                <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                        {/* Tier 1: Group Category Headers */}
                        <tr className="border-b border-gray-200 text-center dark:border-gray-700">
                            <th className="border-r border-gray-200 px-5 py-2.5 dark:border-gray-700 text-[#2a85ff]" colSpan={2}>
                                Personal Info
                            </th>
                            <th className="px-5 py-2.5 text-[#2a85ff]" colSpan={2}>
                                Activity Metrics
                            </th>
                        </tr>
                        {/* Tier 2: Leaf Columns */}
                        <tr>
                            <th className="px-5 py-3" scope="col">Name</th>
                            <th className="border-r border-gray-200 px-5 py-3 dark:border-gray-700" scope="col">Email</th>
                            <th className="px-5 py-3" scope="col">Visits</th>
                            <th className="px-5 py-3" scope="col">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {data.map((row, idx) => (
                            <tr
                                key={idx}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                    {row.name}
                                </td>
                                <td className="whitespace-nowrap border-r border-gray-100 px-5 py-3.5 text-xs text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
                                    {row.email}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">{row.visits}</td>
                                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                                    {row.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GroupTable;
