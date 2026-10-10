// DefaultExpandMenu

// DefaultExpandMenu · Menu demo
// Description:
// Vertical navigation menu with pre-expanded collapsible menu sections. Allows important or
// deep navigation branches to be visible immediately upon initial render.
//
// Design:
// - Initially opened branch with subtle indentation border
// - Chevrons pointing down for expanded branches and right for closed ones
// - Brand blue (#2a85ff) active highlight for selected items
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Initializes with specified default expanded keys (e.g., 'item-3')
// - Allows user to collapse or expand branches dynamically
// - Tracks item selection
//
// Props:
// - defaultExpandedKeys: array (default: ['item-3'])
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DefaultExpandMenu from '@/TestComponent/Navigation/Menu/DefaultExpandMenu';
//
// const MyComponent = () => {
//     return <DefaultExpandMenu defaultExpandedKeys={['item-3']} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DefaultExpandMenu({
    className,
    defaultExpandedKeys = ['item-3'],
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedKey, setSelectedKey] = useState('item-3-1')
    const [expandedKeys, setExpandedKeys] = useState(defaultExpandedKeys)

    const toggleKey = (key) => {
        setExpandedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        )
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
            <nav aria-label="Default expand menu" className="flex flex-col gap-1">
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

                {/* Collapsible Item 3 - Expanded by default */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => toggleKey('item-3')}
                    >
                        <span>Item 3 (Expanded)</span>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                expandedKeys.includes('item-3') && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedKeys.includes('item-3') && (
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

                {/* Collapsible Item 4 - Closed by default */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => toggleKey('item-4')}
                    >
                        <span>Item 4</span>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                expandedKeys.includes('item-4') && 'rotate-180',
                            )}
                        />
                    </button>
                    {expandedKeys.includes('item-4') && (
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
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default DefaultExpandMenu;
