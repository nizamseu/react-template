// TriggerDropdown

// TriggerDropdown · Dropdown demo
// Description:
// Dropdown menu demonstrating distinct user activation triggers.
// Supports standard click, mouse hover, and right-click (context menu) activations.
//
// Design:
// - Clean badge-style trigger buttons side-by-side
// - Floating menus styled consistently across all trigger variations
// - Clear helper badges distinguishing click, hover, and contextmenu interactions
//
// What it does:
// - Renders 3 dropdown instances showcasing click, hover, and right-click triggers
// - Prevents native browser context menu on right-click target
// - Automatically dismisses on outside clicks or blur events
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
// import TriggerDropdown from '@/TestComponent/Navigation/Dropdown/TriggerDropdown';
//
// const MyComponent = () => {
//     return <TriggerDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const items = ['Active Item', 'Item B', 'Item C', 'Item D']

export function TriggerDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [openClick, setOpenClick] = useState(false)
    const [openHover, setOpenHover] = useState(false)
    const [openContext, setOpenContext] = useState(false)

    const clickRef = useRef(null)
    const contextRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (clickRef.current && !clickRef.current.contains(event.target)) {
                setOpenClick(false)
            }
            if (contextRef.current && !contextRef.current.contains(event.target)) {
                setOpenContext(false)
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
            {/* 1. Click Trigger */}
            <div ref={clickRef} className="relative inline-block text-left">
                <button
                    aria-expanded={openClick}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setOpenClick(!openClick)}
                >
                    <span>Click Trigger</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 transition-transform', openClick && 'rotate-180')}
                    />
                </button>

                {openClick && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                type="button"
                                onClick={() => setOpenClick(false)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Hover Trigger */}
            <div
                className="relative inline-block text-left"
                onMouseEnter={() => setOpenHover(true)}
                onMouseLeave={() => setOpenHover(false)}
            >
                <button
                    aria-expanded={openHover}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                >
                    <span>Hover Trigger</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 transition-transform', openHover && 'rotate-180')}
                    />
                </button>

                {openHover && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                type="button"
                                onClick={() => setOpenHover(false)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Right Click (Context Menu) Trigger */}
            <div ref={contextRef} className="relative inline-block text-left">
                <button
                    aria-expanded={openContext}
                    className="inline-flex select-none items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                    onContextMenu={(e) => {
                        e.preventDefault()
                        setOpenContext(true)
                    }}
                >
                    <span>Right Click Me</span>
                    <HiChevronDown className="h-4 w-4" />
                </button>

                {openContext && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                type="button"
                                onClick={() => setOpenContext(false)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TriggerDropdown;
