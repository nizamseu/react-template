// DisabledMenu

// DisabledMenu · Menu demo
// Description:
// Vertical navigation menu demonstrating disabled items. Renders menu entries that are
// non-interactive and visually dimmed while keeping other options fully functional.
//
// Design:
// - Disabled items have cursor-not-allowed, opacity-50, and suppressed hover highlights
// - Active items retain standard hover and brand blue (#2a85ff) selection styling
// - Dark mode support with dark:text-gray-500 and dark:bg-gray-800
//
// What it does:
// - Renders a vertical menu with disabled menu item
// - Prevents click handlers and keyboard focus on disabled elements
// - Maintains accessible aria-disabled tags
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
// import DisabledMenu from '@/TestComponent/Navigation/Menu/DisabledMenu';
//
// const MyComponent = () => {
//     return <DisabledMenu />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function DisabledMenu({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [selectedKey, setSelectedKey] = useState('settings')

    return (
        <div
            className={cn(
                'w-full max-w-[260px] rounded-lg border border-gray-200 bg-white p-2 shadow-sm',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <nav aria-label="Disabled menu demo" className="flex flex-col gap-1">
                <button
                    className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'settings'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('settings')}
                >
                    Settings
                </button>

                <button
                    disabled
                    aria-disabled="true"
                    className="flex w-full cursor-not-allowed items-center rounded-md px-3 py-2 text-left text-sm font-medium text-gray-400 opacity-50 dark:text-gray-500"
                    type="button"
                >
                    Message (Disabled)
                </button>

                <button
                    className={cn(
                        'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition',
                        selectedKey === 'gallery'
                            ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    )}
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setSelectedKey('gallery')}
                >
                    Gallery
                </button>
            </nav>
        </div>
    )
}

export default DisabledMenu;
