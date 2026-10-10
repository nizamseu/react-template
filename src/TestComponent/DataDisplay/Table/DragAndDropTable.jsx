// DragAndDropTable

// DragAndDropTable · Table demo
// Description:
// Table component featuring row reordering capabilities with handle controls.
// Enables users to prioritize or organize tabular rows manually.
//
// Design:
// - Drag grip handles (HiMenuAlt4 icon) in the leading column
// - Step shift buttons (Up/Down) for accessible order adjustments
// - Animated row transitions and dark mode support
//
// What it does:
// - Shifts rows up or down in the array sequence
// - Preserves row data integrity during reordering
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
// import DragAndDropTable from '@/TestComponent/DataDisplay/Table/DragAndDropTable';
//
// const MyComponent = () => {
//     return <DragAndDropTable />
// }
// ```

'use client'

import { useState } from 'react';
import { HiArrowDown, HiArrowUp, HiMenuAlt4 } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const initialItems = [
    { id: '1', title: 'Task 1: Design Review', priority: 'High', status: 'In Progress' },
    { id: '2', title: 'Task 2: API Specification', priority: 'Urgent', status: 'Completed' },
    { id: '3', title: 'Task 3: Testing & QA', priority: 'Medium', status: 'Pending' },
    { id: '4', title: 'Task 4: Release Notes', priority: 'Low', status: 'Draft' },
]

export function DragAndDropTable({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [items, setItems] = useState(initialItems)

    const moveRow = (index, direction) => {
        if (disabled || loading) return
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= items.length) return

        const updated = [...items]
        const [moved] = updated.splice(index, 1)
        updated.splice(newIndex, 0, moved)
        setItems(updated)
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
                            <th className="w-16 px-4 py-3.5 text-center" scope="col">Reorder</th>
                            <th className="px-5 py-3.5" scope="col">Task</th>
                            <th className="px-5 py-3.5" scope="col">Priority</th>
                            <th className="px-5 py-3.5" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                        {items.map((item, idx) => (
                            <tr
                                key={item.id}
                                className="transition hover:bg-gray-50/80 dark:hover:bg-gray-750"
                            >
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-400">
                                        <HiMenuAlt4 className="h-4 w-4 text-gray-400" />
                                        <button
                                            aria-label="Move task up"
                                            className={cn(
                                                'rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700',
                                                idx === 0 && 'cursor-not-allowed opacity-20',
                                            )}
                                            disabled={idx === 0 || disabled || loading}
                                            type="button"
                                            onClick={() => moveRow(idx, 'up')}
                                        >
                                            <HiArrowUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            aria-label="Move task down"
                                            className={cn(
                                                'rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700',
                                                idx === items.length - 1 && 'cursor-not-allowed opacity-20',
                                            )}
                                            disabled={idx === items.length - 1 || disabled || loading}
                                            type="button"
                                            onClick={() => moveRow(idx, 'down')}
                                        >
                                            <HiArrowDown className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                    {item.title}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5">
                                    <span
                                        className={cn(
                                            'rounded px-2 py-0.5 text-xs font-semibold',
                                            item.priority === 'Urgent'
                                                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                                : item.priority === 'High'
                                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                        )}
                                    >
                                        {item.priority}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                                    {item.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DragAndDropTable;
