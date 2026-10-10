// SubmenuDropdown

// SubmenuDropdown · Dropdown demo
// Description:
// Cascading multi-level dropdown menu component. Demonstrates flyout submenus that open
// horizontally when parent menu items are hovered or focused.
//
// Design:
// - Hierarchical tree flyout menus with right-pointing chevrons
// - Crisp shadows and border separation between cascading panels
// - Active state indicator on leaf selection with brand blue (#2a85ff)
// - Dark mode support with dark:bg-gray-800 and dark:border-gray-700
//
// What it does:
// - Opens first-level dropdown on button click
// - Cascades into secondary and tertiary submenus on hover/selection
// - Closes cleanly on outside click or leaf item selection
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// feelings:
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import SubmenuDropdown from '@/TestComponent/Navigation/Dropdown/SubmenuDropdown';
//
// const MyComponent = () => {
//     return <SubmenuDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiCheck, HiChevronDown, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SubmenuDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeSubmenu, setActiveSubmenu] = useState(null)
    const [activeNestedSubmenu, setActiveNestedSubmenu] = useState(null)
    const [selectedItem, setSelectedItem] = useState('Item 2-1-1')
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
                setActiveSubmenu(null)
                setActiveNestedSubmenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (name) => {
        setSelectedItem(name)
        setIsOpen(false)
        setActiveSubmenu(null)
        setActiveNestedSubmenu(null)
    }

    return (
        <div
            ref={ref}
            className={cn('relative inline-block text-left', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                aria-expanded={isOpen}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                disabled={disabled || loading}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Selected: {selectedItem}</span>
                <HiChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-50 mt-2 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        type="button"
                        onClick={() => handleSelect('Item 1')}
                    >
                        Item 1
                    </button>

                    {/* Level 1: Submenu 'Right Item 2' */}
                    <div
                        className="relative"
                        onMouseEnter={() => setActiveSubmenu('item-2')}
                        onMouseLeave={() => {
                            setActiveSubmenu(null)
                            setActiveNestedSubmenu(null)
                        }}
                    >
                        <div className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                            <span>Right Item 2</span>
                            <HiChevronRight className="h-4 w-4 text-gray-400" />
                        </div>

                        {activeSubmenu === 'item-2' && (
                            <div className="absolute left-full top-0 z-50 -ml-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {/* Level 2: Submenu 'Item 2-1' */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setActiveNestedSubmenu('item-2-1')}
                                    onMouseLeave={() => setActiveNestedSubmenu(null)}
                                >
                                    <div className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <span>Item 2-1</span>
                                        <HiChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>

                                    {activeNestedSubmenu === 'item-2-1' && (
                                        <div className="absolute left-full top-0 z-50 -ml-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                            {['Item 2-1-1', 'Item 2-1-2', 'Item 2-1-3'].map((item) => (
                                                <button
                                                    key={item}
                                                    className={cn(
                                                        'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition',
                                                        selectedItem === item
                                                            ? 'bg-blue-50 font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                                                    )}
                                                    type="button"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    <span>{item}</span>
                                                    {selectedItem === item && (
                                                        <HiCheck className="h-4 w-4 text-[#2a85ff]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                    type="button"
                                    onClick={() => handleSelect('Item 2-2')}
                                >
                                    Item 2-2
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                    type="button"
                                    onClick={() => handleSelect('Item 2-3')}
                                >
                                    Item 2-3
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        type="button"
                        onClick={() => handleSelect('Item 4')}
                    >
                        Item 4
                    </button>
                </div>
            )}
        </div>
    )
}

export default SubmenuDropdown;
