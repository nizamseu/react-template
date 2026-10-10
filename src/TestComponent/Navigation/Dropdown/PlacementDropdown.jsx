// PlacementDropdown

// PlacementDropdown · Dropdown demo
// Description:
// Dropdown component demonstrating varied spatial placements and positioning anchors.
// Supports top, bottom, left, and right alignments with start, center, and end offsets.
//
// Design:
// - Dynamic absolute positioning calculations aligned to trigger boundaries
// - Grid layout presenting key placement directions
// - Floating menus with drop-shadows and subtle borders
// - Dark mode support with dark:bg-gray-800 and dark:border-gray-700
//
// What it does:
// - Renders dropdown buttons for multiple placement options
// - Positions menus properly according to selected or active placement
// - Supports outside click to dismiss open placement menus
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
// import PlacementDropdown from '@/TestComponent/Navigation/Dropdown/PlacementDropdown';
//
// const MyComponent = () => {
//     return <PlacementDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const placements = [
    { id: 'bottom-start', label: 'Bottom Start', menuClass: 'left-0 top-full mt-2' },
    { id: 'bottom-center', label: 'Bottom Center', menuClass: 'left-1/2 -translate-x-1/2 top-full mt-2' },
    { id: 'bottom-end', label: 'Bottom End', menuClass: 'right-0 top-full mt-2' },
    { id: 'top-start', label: 'Top Start', menuClass: 'left-0 bottom-full mb-2' },
    { id: 'top-center', label: 'Top Center', menuClass: 'left-1/2 -translate-x-1/2 bottom-full mb-2' },
    { id: 'top-end', label: 'Top End', menuClass: 'right-0 bottom-full mb-2' },
    { id: 'right-start', label: 'Right Start', menuClass: 'left-full top-0 ml-2' },
    { id: 'left-start', label: 'Left Start', menuClass: 'right-full top-0 mr-2' },
]

export function PlacementDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [activePlacement, setActivePlacement] = useState(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setActivePlacement(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn('w-full max-w-2xl py-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {placements.map((p) => {
                    const isOpen = activePlacement === p.id
                    return (
                        <div key={p.id} className="relative inline-block text-center">
                            <button
                                aria-expanded={isOpen}
                                className={cn(
                                    'inline-flex w-full items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff]',
                                    'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                                    isOpen && 'border-[#2a85ff] ring-1 ring-[#2a85ff]',
                                )}
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => setActivePlacement(isOpen ? null : p.id)}
                            >
                                <span className="truncate">{p.label}</span>
                                <HiChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            </button>

                            {isOpen && (
                                <div
                                    className={cn(
                                        'absolute z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800',
                                        p.menuClass,
                                    )}
                                >
                                    <div className="border-b border-gray-100 px-3 py-1.5 text-left text-xs font-semibold text-gray-400 dark:border-gray-700">
                                        {p.label}
                                    </div>
                                    <button
                                        className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                        type="button"
                                        onClick={() => setActivePlacement(null)}
                                    >
                                        Option 1
                                    </button>
                                    <button
                                        className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                        type="button"
                                        onClick={() => setActivePlacement(null)}
                                    >
                                        Option 2
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PlacementDropdown;
