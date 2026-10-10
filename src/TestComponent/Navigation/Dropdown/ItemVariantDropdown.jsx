// ItemVariantDropdown

// ItemVariantDropdown · Dropdown demo
// Description:
// Dropdown component demonstrating varied item formats within a single menu.
// Showcases account user headers, divider separators, standard options, and custom highlighted actions.
//
// Design:
// - Header section with subtle secondary text and bold user email
// - Clean horizontal divider separating sections (border-t)
// - Custom styled action items with brand accents or warning colors
// - Dark mode support with rich slate/gray contrasts
//
// What it does:
// - Renders an account/profile menu with multiple item variants
// - Handles selection of items and actions
// - Preserves accessibility and focus styling
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
// import ItemVariantDropdown from '@/TestComponent/Navigation/Dropdown/ItemVariantDropdown';
//
// const MyComponent = () => {
//     return <ItemVariantDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown, HiOutlineLogout, HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ItemVariantDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
                <span>Account Menu</span>
                <HiChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    {/* Header item variant */}
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700/60">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Signed in as
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            alex_g@theme_nate.com
                        </p>
                    </div>

                    {/* Standard menu items */}
                    <div className="py-1">
                        <button
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile Details
                        </button>
                        <button
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Account Settings
                        </button>
                    </div>

                    {/* Divider item variant */}
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700/60" />

                    {/* Custom highlight item variant */}
                    <div className="px-2 py-1">
                        <button
                            className="flex w-full items-center gap-2 rounded-md bg-blue-50/80 px-3 py-2 text-left text-sm font-medium text-[#2a85ff] transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            <HiOutlineSparkles className="h-4 w-4" />
                            <span>Upgrade to Pro Plan</span>
                        </button>
                    </div>

                    {/* Divider item variant */}
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700/60" />

                    {/* Danger / Action item */}
                    <div className="py-1">
                        <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            <HiOutlineLogout className="h-4 w-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemVariantDropdown;
