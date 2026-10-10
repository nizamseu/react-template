// SubComponentTable

// SubComponentTable · Table demo
// Description:
// Table component that renders a dedicated sub-component card inside an expanded row.
// Displays detailed customer profiles, nested item inventories, or transaction breakdowns.
//
// Design:
// - Expansion toggle with rotating chevron indicator
// - Sub-component rendered within a styled card container inside the table body
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Mounts custom sub-component content on row expansion
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
// import SubComponentTable from '@/TestComponent/DataDisplay/Table/SubComponentTable';
//
// const MyComponent = () => {
//     return <SubComponentTable />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const data = [
    { id: 1, user: 'Maria Anders', role: 'Full Stack Engineer', department: 'Engineering', tasks: 14, completion: '92%' },
    { id: 2, user: 'Francisco Chang', role: 'UI/UX Designer', department: 'Product', tasks: 8, completion: '80%' },
]

export function SubComponentTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [expandedId, setExpandedId] = useState(1)

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
                            <th className="px-5 py-3.5" scope="col">User</th>
                            <th className="px-5 py-3.5" scope="col">Role</th>
                            <th className="px-5 py-3.5" scope="col">Department</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {data.map((row) => {
                            const isExpanded = expandedId === row.id
                            return (
                                <tr key={row.id} className="contents">
                                    <tr className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750">
                                        <td className="px-4 py-3.5">
                                            <button
                                                aria-label="Toggle sub-component"
                                                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                                type="button"
                                                onClick={() => setExpandedId(isExpanded ? null : row.id)}
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
                                            {row.user}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5">{row.role}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-gray-500 dark:text-gray-400">
                                            {row.department}
                                        </td>
                                    </tr>

                                    {/* Embedded Sub-Component Card */}
                                    {isExpanded && (
                                        <tr>
                                            <td className="bg-gray-50/60 p-5 dark:bg-gray-900/30" colSpan={4}>
                                                <div className="ml-8 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs dark:border-gray-700 dark:bg-gray-800">
                                                    <h6 className="text-xs font-bold uppercase tracking-wider text-[#2a85ff]">
                                                        Performance Sub-Component
                                                    </h6>
                                                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                                                        <div>
                                                            <span className="text-gray-400">Assigned Tasks:</span>
                                                            <strong className="ml-2 text-gray-800 dark:text-gray-200">
                                                                {row.tasks} sprints
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Completion Rate:</span>
                                                            <strong className="ml-2 text-emerald-600 dark:text-emerald-400">
                                                                {row.completion}
                                                            </strong>
                                                        </div>
                                                    </div>
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

export default SubComponentTable;
