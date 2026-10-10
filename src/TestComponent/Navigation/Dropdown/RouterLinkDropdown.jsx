// RouterLinkDropdown

// RouterLinkDropdown · Dropdown demo
// Description:
// Dropdown menu integrating navigation links. Menu items navigate to distinct application routes
// or destinations while preserving dropdown accessibility and behavior.
//
// Design:
// - Navigation links styled consistently with regular interactive dropdown options
// - Hover indicator with brand blue (#2a85ff) accents
// - External link or route destination icons
// - Dark mode support with dark:text-gray-200 and dark:hover:bg-gray-700
//
// What it does:
// - Renders dropdown items wrapped in navigation links
// - Closes menu upon link click
// - Supports accessible keyboard focus and router navigation
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
// import RouterLinkDropdown from '@/TestComponent/Navigation/Dropdown/RouterLinkDropdown';
//
// const MyComponent = () => {
//     return <RouterLinkDropdown />
// }
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { HiChevronDown, HiOutlineExternalLink } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const navLinks = [
    { name: 'Checkbox Components', path: '/ui-components/checkbox' },
    { name: 'Button Components', path: '/ui-components/button' },
    { name: 'Alert Components', path: '/ui-components/alert' },
    { name: 'Dialog Components', path: '/ui-components/dialog' },
]

export function RouterLinkDropdown({
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
                <span>Navigate Components</span>
                <HiChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            className="flex items-center justify-between px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-[#2a85ff] dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-[#2a85ff]"
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                        >
                            <span>{link.name}</span>
                            <HiOutlineExternalLink className="h-3.5 w-3.5 text-gray-400" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RouterLinkDropdown;
