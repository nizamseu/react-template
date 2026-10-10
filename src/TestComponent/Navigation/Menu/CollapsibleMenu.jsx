// CollapsibleMenu

// CollapsibleMenu · Menu demo
// Description:
// Vertical navigation menu with deeply nested accordion sections. Enables clean folding and
// expansion of multi-tier navigation hierarchies.
//
// Design:
// - Animated rotating chevrons indicating open/closed state
// - Indented border guides distinguishing hierarchy levels
// - Brand blue (#2a85ff) active highlight on selected leaf nodes
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Expands and collapses parent sections independently
// - Supports multi-level nesting (level 1 -> level 2 -> level 3)
// - Emits onToggle events and tracks active leaf selection
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
// import CollapsibleMenu from '@/TestComponent/Navigation/Menu/CollapsibleMenu';
//
// const MyComponent = () => {
//     return <CollapsibleMenu />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CollapsibleMenu({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedKey, setSelectedKey] = useState('item-3-1')
    const [expandedSections, setExpandedSections] = useState({
        'item-3': true,
        'item-4': false,
        'item-4-3': false,
    })

    const toggleSection = (key) => {
        setExpandedSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    return (
        <div
            className={cn(
                'w-full max-w-[270px] rounded-lg border border-gray-200 bg-white p-2 shadow-sm',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <nav aria-label="Collapsible menu" className="flex flex-col gap-1">
                {/* Flat Items */}
                <button
                    className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'item-1'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('item-1')}
                >
                    Item 1
                </button>
                <button
                    className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'item-2'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('item-2')}
                >
                    Item 2
                </button>

                {/* Collapsible Item 3 */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => toggleSection('item-3')}
                    >
                        <span>Item 3</span>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                expandedSections['item-3'] && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedSections['item-3'] && (
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                            <button
                                className={cn(
                                    'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'item-3-1'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('item-3-1')}
                            >
                                Item 3.1
                            </button>
                            <button
                                className={cn(
                                    'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'item-3-2'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('item-3-2')}
                            >
                                Item 3.2
                            </button>
                        </div>
                    )}
                </div>

                {/* Collapsible Item 4 with nested Item 4.3 */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => toggleSection('item-4')}
                    >
                        <span>Item 4</span>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                expandedSections['item-4'] && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedSections['item-4'] && (
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                            <button
                                className={cn(
                                    'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'item-4-1'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('item-4-1')}
                            >
                                Item 4.1
                            </button>
                            <button
                                className={cn(
                                    'flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'item-4-2'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('item-4-2')}
                            >
                                Item 4.2
                            </button>

                            {/* Nested Item 4.3 */}
                            <div>
                                <button
                                    className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60"
                                    disabled={disabled || loading}
                                    type="button"
                                    onClick={() => toggleSection('item-4-3')}
                                >
                                    <span>Item 4.3</span>
                                    <HiChevronDown
                                        className={cn(
                                            'h-3.5 w-3.5 text-gray-400 transition-transform duration-200',
                                            expandedSections['item-4-3'] && 'rotate-180',
                                        )}
                                    />
                                </button>
                                {expandedSections['item-4-3'] && (
                                    <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                                        <button
                                            className={cn(
                                                'flex w-full items-center rounded-md px-2 py-1 text-left text-xs font-medium transition',
                                                selectedKey === 'item-4-3-1'
                                                    ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/60',
                                            )}
                                            disabled={disabled || loading}
                                            type="button"
                                            onClick={() => setSelectedKey('item-4-3-1')}
                                        >
                                            Item 4.3.1
                                        </button>
                                        <button
                                            className={cn(
                                                'flex w-full items-center rounded-md px-2 py-1 text-left text-xs font-medium transition',
                                                selectedKey === 'item-4-3-2'
                                                    ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/60',
                                            )}
                                            disabled={disabled || loading}
                                            type="button"
                                            onClick={() => setSelectedKey('item-4-3-2')}
                                        >
                                            Item 4.3.2
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default CollapsibleMenu;
