// IconMenu

// IconMenu · Menu demo
// Description:
// Vertical navigation menu with rich icon prefixes and collapsible nested menu options.
// Enhances menu legibility and aesthetic appeal with clear visual metaphors.
//
// Design:
// - Icon prefix aligned with text labels
// - Collapsible branch section with chevron indicators
// - Selected item highlighting with brand blue (#2a85ff) accents
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders menu items paired with react-icons
// - Supports expanding/collapsing sub-branches
// - Tracks active selection across items
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
// import IconMenu from '@/TestComponent/Navigation/Menu/IconMenu';
//
// const MyComponent = () => {
//     return <IconMenu />
// }
// ```

'use client'

import { useState } from 'react';
import {
    HiChevronDown,
    HiOutlineChat,
    HiOutlineCog,
    HiOutlineGlobeAlt,
    HiOutlineSupport,
    HiWifi,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function IconMenu({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedKey, setSelectedKey] = useState('settings')
    const [isNetworkOpen, setIsNetworkOpen] = useState(true)

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
            <nav aria-label="Icon menu" className="flex flex-col gap-1">
                {/* Settings */}
                <button
                    className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'settings'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('settings')}
                >
                    <HiOutlineCog className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>Settings</span>
                </button>

                {/* Messages */}
                <button
                    className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'messages'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('messages')}
                >
                    <HiOutlineChat className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>Messages</span>
                </button>

                {/* Network Collapse */}
                <div>
                    <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <HiOutlineGlobeAlt className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <span>Network</span>
                        </div>
                        <HiChevronDown
                            className={cn(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                isNetworkOpen && 'rotate-180',
                            )}
                        />
                    </button>

                    {isNetworkOpen && (
                        <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                            <button
                                className={cn(
                                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'wifi'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('wifi')}
                            >
                                <HiWifi className="h-4 w-4" />
                                <span>Wifi</span>
                            </button>
                            <button
                                className={cn(
                                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition',
                                    selectedKey === 'support'
                                        ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setSelectedKey('support')}
                            >
                                <HiOutlineSupport className="h-4 w-4" />
                                <span>Support</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default IconMenu;
