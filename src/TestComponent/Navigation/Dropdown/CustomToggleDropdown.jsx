// CustomToggleDropdown

// CustomToggleDropdown · Dropdown demo
// Description:
// Dropdown menu rendered with a custom toggle trigger. Allows replacing the default text/chevron
// button with customized buttons, avatar badges, or action buttons.
//
// Design:
// - Custom pill trigger with brand blue button styling and avatar or icon
// - Floating menu card positioned seamlessly below the custom trigger
// - Smooth transitions on open and close
//
// What it does:
// - Renders a dropdown opened via a custom trigger element
// - Allows selecting options and triggers callbacks
// - Closes cleanly on outside click
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
// import CustomToggleDropdown from '@/TestComponent/Navigation/Dropdown/CustomToggleDropdown';
//
// const MyComponent = () => {
//     return <CustomToggleDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { HiOutlineDotsVertical, HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const items = [
    { key: 'a', name: 'Profile Settings' },
    { key: 'b', name: 'Subscription Plan' },
    { key: 'c', name: 'API Credentials' },
    { key: 'd', name: 'Team Access' },
]

export function CustomToggleDropdown({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen1, setIsOpen1] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const ref1 = useRef(null)
    const ref2 = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref1.current && !ref1.current.contains(event.target)) {
                setIsOpen1(false)
            }
            if (ref2.current && !ref2.current.contains(event.target)) {
                setIsOpen2(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            className={cn('flex flex-wrap items-center gap-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Custom Trigger 1: Action Button with Icon */}
            <div ref={ref1} className="relative inline-block text-left">
                <button
                    aria-expanded={isOpen1}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2a85ff] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1f70e0] focus:outline-none focus:ring-2 focus:ring-[#2a85ff] focus:ring-offset-2"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setIsOpen1(!isOpen1)}
                >
                    <HiOutlineSparkles className="h-4 w-4" />
                    <span>Quick Actions</span>
                </button>

                {isOpen1 && (
                    <div className="absolute left-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item) => (
                            <button
                                key={item.key}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                type="button"
                                onClick={() => setIsOpen1(false)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Trigger 2: Icon Only Dots Menu */}
            <div ref={ref2} className="relative inline-block text-left">
                <button
                    aria-expanded={isOpen2}
                    aria-label="More options"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => setIsOpen2(!isOpen2)}
                >
                    <HiOutlineDotsVertical className="h-5 w-5" />
                </button>

                {isOpen2 && (
                    <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        {items.map((item) => (
                            <button
                                key={item.key}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                                type="button"
                                onClick={() => setIsOpen2(false)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomToggleDropdown;
