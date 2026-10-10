// DefaultActiveMenu

// DefaultActiveMenu · Menu demo
// Description:
// Vertical navigation menu supporting pre-selected active keys upon mount.
// Renders menu options with pre-activated visual indicators.
//
// Design:
// - Selected items highlighted with soft blue fill (bg-blue-50) and brand blue (#2a85ff) typography
// - Dark mode support with dark:bg-blue-950/40 and dark:text-blue-400
// - Clean borders and container shadows
//
// What it does:
// - Accepts defaultActiveKeys array to select items initially
// - Allows user to change active selection
// - Supports active highlighting across flat and nested items
//
// Props:
// - defaultActiveKeys: array (default: ['item-2'])
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DefaultActiveMenu from '@/TestComponent/Navigation/Menu/DefaultActiveMenu';
//
// const MyComponent = () => {
//     return <DefaultActiveMenu defaultActiveKeys={['item-2']} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DefaultActiveMenu({
    className,
    defaultActiveKeys = ['item-2'],
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [activeKey, setActiveKey] = useState(defaultActiveKeys[0] || 'item-2')
    const [isItem3Open, setIsItem3Open] = useState(true)

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
            <nav aria-label="Default active menu" className="flex flex-col gap-1">
                <button
                    className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        activeKey === 'item-1'
                            ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setActiveKey('item-1')}
                >
                    <span>Item 1</span>
                    {activeKey === 'item-1' && <HiCheck className="h-4 w-4 text-[#2a85ff]" />}
                </button>

                <button
                    className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        activeKey === 'item-2'
                            ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setActiveKey('item-2')}
                >
                    <span>Item 2 (Active)</span>
                    {activeKey === 'item-2' && <HiCheck className="h-4 w-4 text-[#2a85ff]" />}
                </button>

                {/* Collapsible Item 3 */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setIsItem3Open(!isItem3Open)}
                    >
                        <span>Item 3</span>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                isItem3Open && 'rotate-180',
                            )}
                        />
                    </button>
                    {isItem3Open && (
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                            <button
                                className={cn(
                                    'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    activeKey === 'item-3-1'
                                        ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setActiveKey('item-3-1')}
                            >
                                <span>Item 3.1</span>
                                {activeKey === 'item-3-1' && (
                                    <HiCheck className="h-4 w-4 text-[#2a85ff]" />
                                )}
                            </button>
                            <button
                                className={cn(
                                    'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    activeKey === 'item-3-2'
                                        ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setActiveKey('item-3-2')}
                            >
                                <span>Item 3.2</span>
                                {activeKey === 'item-3-2' && (
                                    <HiCheck className="h-4 w-4 text-[#2a85ff]" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default DefaultActiveMenu;
