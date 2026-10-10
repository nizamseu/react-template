// DefaultActiveDropdown

// DefaultActiveDropdown · Dropdown demo
// Description:
// Dropdown menu supporting active / pre-selected states. Displays items with active visual highlights
// indicating the current selection across single items and nested submenus.
//
// Design:
// - Selected item highlighted with brand blue (#2a85ff) background tint and text color
// - Active check icon or bullet indicator for clarity
// - Dark mode support with dark:bg-blue-900/30 and dark:text-blue-400
// - Clean submenu flyouts with borders and shadows
//
// What it does:
// - Renders two dropdowns demonstrating activeKey behavior
// - Supports controlled or pre-selected activeKey tracking
// - Highlights active leaf items in nested structures
//
// Props:
// - activeKey: string (default: "a")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DefaultActiveDropdown from '@/TestComponent/Navigation/Dropdown/DefaultActiveDropdown';
//
// const MyComponent = () => {
//     return <DefaultActiveDropdown activeKey="a" />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiCheck, HiChevronDown, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const items = [
    { key: 'a', name: 'Item A' },
    { key: 'b', name: 'Item B' },
    { key: 'c', name: 'Item C' },
    { key: 'd', name: 'Item D' },
]

export function DefaultActiveDropdown({
    activeKey = 'a',
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen1, setIsOpen1] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [currentKey1, setCurrentKey1] = useState(activeKey)
    const [currentKey2, setCurrentKey2] = useState('item-2-1-2')
    const [submenuOpen, setSubmenuOpen] = useState(false)

    const ref1 = useRef(null)
    const ref2 = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref1.current && !ref1.current.contains(event.target)) {
                setIsOpen1(false)
            }
            if (ref2.current && !ref2.current.contains(event.target)) {
                setIsOpen2(false)
                setSubmenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            className={cn('flex flex-wrap items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Dropdown 1: Single Level Active Item */}
            <div ref={ref1} className="relative inline-block text-left">
                <button
                    aria-expanded={isOpen1}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setIsOpen1(!isOpen1)}
                >
                    <span>Selected: {currentKey1.toUpperCase()}</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 transition-transform', isOpen1 && 'rotate-180')}
                    />
                </button>

                {isOpen1 && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item) => {
                            const isActive = currentKey1 === item.key
                            return (
                                <button
                                    key={item.key}
                                    className={cn(
                                        'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition',
                                        isActive
                                            ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                                    )}
                                    type="button"
                                    onClick={() => {
                                        setCurrentKey1(item.key)
                                        setIsOpen1(false)
                                    }}
                                >
                                    <span>{item.name}</span>
                                    {isActive && <HiCheck className="h-4 w-4 text-[#2a85ff]" />}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Dropdown 2: Nested Submenu Active Item */}
            <div ref={ref2} className="relative inline-block text-left">
                <button
                    aria-expanded={isOpen2}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setIsOpen2(!isOpen2)}
                >
                    <span>Nested Active ({currentKey2})</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 transition-transform', isOpen2 && 'rotate-180')}
                    />
                </button>

                {isOpen2 && (
                    <div className="absolute left-0 z-50 mt-2 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                            className={cn(
                                'block w-full px-4 py-2 text-left text-sm transition',
                                currentKey2 === 'item-1'
                                    ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            type="button"
                            onClick={() => {
                                setCurrentKey2('item-1')
                                setIsOpen2(false)
                            }}
                        >
                            Item 1
                        </button>

                        <div
                            className="relative"
                            onMouseEnter={() => setSubmenuOpen(true)}
                            onMouseLeave={() => setSubmenuOpen(false)}
                        >
                            <div className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                <span>Item 2</span>
                                <HiChevronRight className="h-4 w-4 text-gray-400" />
                            </div>

                            {submenuOpen && (
                                <div className="absolute left-full top-0 z-50 -ml-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                    {['item-2-1-1', 'item-2-1-2', 'item-2-1-3'].map((nestedKey) => {
                                        const isNestedActive = currentKey2 === nestedKey
                                        return (
                                            <button
                                                key={nestedKey}
                                                className={cn(
                                                    'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition',
                                                    isNestedActive
                                                        ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                                                )}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentKey2(nestedKey)
                                                    setIsOpen2(false)
                                                    setSubmenuOpen(false)
                                                }}
                                            >
                                                <span>{nestedKey}</span>
                                                {isNestedActive && (
                                                    <HiCheck className="h-4 w-4 text-[#2a85ff]" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            className={cn(
                                'block w-full px-4 py-2 text-left text-sm transition',
                                currentKey2 === 'item-3'
                                    ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                            )}
                            type="button"
                            onClick={() => {
                                setCurrentKey2('item-3')
                                setIsOpen2(false)
                            }}
                        >
                            Item 3
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DefaultActiveDropdown;
