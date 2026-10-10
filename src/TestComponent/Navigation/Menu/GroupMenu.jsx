// GroupMenu

// GroupMenu · Menu demo
// Description:
// Vertical menu with grouped category sections. Organizes related navigation links under
// distinct uppercase section headers.
//
// Design:
// - Uppercase group section headers (text-xs uppercase font-semibold text-gray-400)
// - Indented nested items with smooth hover and active indicator
// - Brand blue (#2a85ff) highlight on selected items
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Groups navigation options into distinct logical clusters
// - Supports collapsible items within groups
// - Emits selection events on click
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
// import GroupMenu from '@/TestComponent/Navigation/Menu/GroupMenu';
//
// const MyComponent = () => {
//     return <GroupMenu />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GroupMenu({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedKey, setSelectedKey] = useState('group-1-item-1')
    const [isGroup1Item3Open, setIsGroup1Item3Open] = useState(false)

    return (
        <div
            className={cn(
                'w-full max-w-[270px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <nav aria-label="Grouped menu" className="flex flex-col gap-4">
                {/* Group 1 */}
                <div className="flex flex-col gap-1">
                    <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Group 1
                    </span>
                    <button
                        className={cn(
                            'flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition',
                            selectedKey === 'group-1-item-1'
                                ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                        )}
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setSelectedKey('group-1-item-1')}
                    >
                        Item 1
                    </button>
                    <button
                        className={cn(
                            'flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition',
                            selectedKey === 'group-1-item-2'
                                ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                        )}
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setSelectedKey('group-1-item-2')}
                    >
                        Item 2
                    </button>

                    {/* Sub-item collapse */}
                    <div>
                        <button
                            className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => setIsGroup1Item3Open(!isGroup1Item3Open)}
                        >
                            <span>Item 3</span>
                            <HiChevronDown
                                className={cn(
                                    'h-4 w-4 text-gray-400 transition-transform duration-200',
                                    isGroup1Item3Open && 'rotate-180',
                                )}
                            />
                        </button>
                        {isGroup1Item3Open && (
                            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                                <button
                                    className={cn(
                                        'flex w-full items-center rounded-md px-2.5 py-1 text-left text-sm font-medium transition',
                                        selectedKey === 'group-1-item-3-1'
                                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                    )}
                                    disabled={disabled || loading}
                                    type="button"
                                    onClick={() => setSelectedKey('group-1-item-3-1')}
                                >
                                    Item 3.1
                                </button>
                                <button
                                    className={cn(
                                        'flex w-full items-center rounded-md px-2.5 py-1 text-left text-sm font-medium transition',
                                        selectedKey === 'group-1-item-3-2'
                                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                    )}
                                    disabled={disabled || loading}
                                    type="button"
                                    onClick={() => setSelectedKey('group-1-item-3-2')}
                                >
                                    Item 3.2
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Group 2 */}
                <div className="flex flex-col gap-1 border-t border-gray-100 pt-3 dark:border-gray-700/60">
                    <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Group 2
                    </span>
                    <button
                        className={cn(
                            'flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition',
                            selectedKey === 'group-2-item-1'
                                ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                        )}
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setSelectedKey('group-2-item-1')}
                    >
                        Item 1
                    </button>
                    <button
                        className={cn(
                            'flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition',
                            selectedKey === 'group-2-item-2'
                                ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                        )}
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setSelectedKey('group-2-item-2')}
                    >
                        Item 2
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default GroupMenu;
