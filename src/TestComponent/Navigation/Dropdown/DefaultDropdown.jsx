// DefaultDropdown

// DefaultDropdown · Dropdown demo
// Description:
// Standard click-triggered dropdown menu component. Opens a floating list of selectable options
// when clicked and closes upon option selection or clicking outside.
//
// Design:
// - Trigger button with border, rounded-md, and chevron icon that rotates when open
// - Floating menu card with shadow-lg, border, rounded-lg, and smooth entrance
// - Hover states with light blue/gray background and brand blue (#2a85ff) accents
// - Dark mode support with dark:bg-gray-800 and dark:border-gray-700
//
// What it does:
// - Toggles dropdown visibility on button click
// - Closes on item selection or outside click
// - Emits onSelect event callback with selected item details
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
// import DefaultDropdown from '@/TestComponent/Navigation/Dropdown/DefaultDropdown';
//
// const MyComponent = () => {
//     return <DefaultDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const items = [
    { key: 'a', name: 'Item A' },
    { key: 'b', name: 'Item B' },
    { key: 'c', name: 'Item C' },
    { key: 'd', name: 'Item D' },
]

export function DefaultDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (item) => {
        setSelectedItem(item)
        setIsOpen(false)
    }

    return (
        <div
            ref={dropdownRef}
            className={cn('relative inline-block text-left', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={cn(
                    'inline-flex items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] focus:ring-offset-2',
                    'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                )}
                disabled={disabled || loading}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedItem ? selectedItem.name : 'Click Me!'}</span>
                <HiChevronDown
                    className={cn(
                        'h-4 w-4 text-gray-500 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {isOpen && (
                <div
                    aria-orientation="vertical"
                    className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                    role="menu"
                >
                    {items.map((item) => (
                        <button
                            key={item.key}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                            role="menuitem"
                            type="button"
                            onClick={() => handleSelect(item)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DefaultDropdown;
