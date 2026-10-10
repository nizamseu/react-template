// DisabledDropdown

// DisabledDropdown · Dropdown demo
// Description:
// Dropdown component demonstrating disabled states. Shows both an entirely disabled trigger
// button and active dropdowns containing selectively disabled menu items.
//
// Design:
// - Disabled buttons show cursor-not-allowed, opacity-50, and inactive hover states
// - Disabled menu items retain list formatting but prevent interaction and highlight
// - Accessible aria-disabled attributes for screen readers
//
// What it does:
// - Renders a disabled dropdown button that cannot be opened
// - Renders an interactive dropdown containing disabled individual options
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
// import DisabledDropdown from '@/TestComponent/Navigation/Dropdown/DisabledDropdown';
//
// const MyComponent = () => {
//     return <DisabledDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DisabledDropdown({
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
            className={cn('flex flex-wrap items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* 1. Fully disabled trigger */}
            <div className="relative inline-block text-left">
                <button
                    disabled
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 opacity-60 dark:border-gray-800 dark:bg-gray-850 dark:text-gray-500"
                    type="button"
                >
                    <span>Disabled Trigger</span>
                    <HiChevronDown className="h-4 w-4" />
                </button>
            </div>

            {/* 2. Interactive trigger with disabled items */}
            <div ref={ref} className="relative inline-block text-left">
                <button
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>Partially Disabled Menu</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                    />
                </button>

                {isOpen && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Item A (Active)
                        </button>
                        <button
                            disabled
                            aria-disabled="true"
                            className="block w-full cursor-not-allowed px-4 py-2 text-left text-sm text-gray-400 opacity-50 dark:text-gray-500"
                            type="button"
                        >
                            Item B (Disabled)
                        </button>
                        <button
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Item C (Active)
                        </button>
                        <button
                            disabled
                            aria-disabled="true"
                            className="block w-full cursor-not-allowed px-4 py-2 text-left text-sm text-gray-400 opacity-50 dark:text-gray-500"
                            type="button"
                        >
                            Item D (Disabled)
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DisabledDropdown;
