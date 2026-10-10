// SimpleMenu

// SimpleMenu · Menu demo
// Description:
// Vertical navigation list menu with selectable items. Provides clean selection state,
// hover effects, and keyboard accessibility for sidebar or panel navigation.
//
// Design:
// - Bordered card container (max-w-[260px]) with rounded corners
// - Menu items with subtle rounded-md borders, hover background, and active blue indicator
// - Brand blue (#2a85ff) text and background highlight for selected items
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders a simple vertical navigation list
// - Tracks active selected key
// - Triggers onSelect callback when item is clicked
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
// import SimpleMenu from '@/TestComponent/Navigation/Menu/SimpleMenu';
//
// const MyComponent = () => {
//     return <SimpleMenu />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const items = [
    { key: 'settings', label: 'Settings' },
    { key: 'message', label: 'Message' },
    { key: 'gallery', label: 'Gallery' },
]

export function SimpleMenu({
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
            <nav aria-label="Simple menu" className="flex flex-col gap-1">
                {items.map((item) => {
                    const isSelected = selectedKey === item.key
                    return (
                        <button
                            key={item.key}
                            className={cn(
                                'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition',
                                isSelected
                                    ? 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/60',
                            )}
                            disabled={disabled || loading}
                            type="button"
                            onClick={() => setSelectedKey(item.key)}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}

export default SimpleMenu;
