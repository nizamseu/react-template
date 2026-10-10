// SimpleTable

// SimpleTable · Table demo
// Description:
// Clean HTML5 responsive table with structured table head, body rows, and border dividers.
// Displays multi-column tabular records with clear visual alignment.
//
// Design:
// - Header with uppercase muted typography (text-xs font-semibold text-gray-500 uppercase)
// - Alternating soft hover rows with border dividers (border-b border-gray-100 dark:border-gray-700)
// - Responsive horizontal overflow wrapper
// - Dark mode support with dark:text-gray-200 and dark:bg-gray-800
//
// What it does:
// - Renders structured tabular dataset
// - Preserves horizontal scrollability on smaller screens
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
// import SimpleTable from '@/TestComponent/DataDisplay/Table/SimpleTable';
//
// const MyComponent = () => {
//     return <SimpleTable />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const sampleRows = [
    { company: 'Alfreds Futterkiste', contact: 'Maria Anders', country: 'Germany' },
    { company: 'Centro comercial Moctezuma', contact: 'Francisco Chang', country: 'Mexico' },
    { company: 'Ernst Handel', contact: 'Roland Mendel', country: 'Austria' },
    { company: 'Island Trading', contact: 'Helen Bennett', country: 'UK' },
    { company: 'Laughing Bacchus Winecellars', contact: 'Yoshi Tannamuri', country: 'Canada' },
]

export function SimpleTable({
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
                        <tr>
                            <th className="px-5 py-3.5" scope="col">Company</th>
                            <th className="px-5 py-3.5" scope="col">Contact</th>
                            <th className="px-5 py-3.5" scope="col">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {sampleRows.map((row, idx) => (
                            <tr
                                key={idx}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                                    {row.company}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">{row.contact}</td>
                                <td className="whitespace-nowrap px-5 py-3.5 text-gray-500 dark:text-gray-400">
                                    {row.country}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SimpleTable;
