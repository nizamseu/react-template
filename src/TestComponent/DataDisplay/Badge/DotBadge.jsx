// DotBadge

// DotBadge · Badge demo
// Description:
// Minimalist dot status indicator badge component.
// Alerts users to new updates, activity, or unread events without displaying numeric counts.
//
// Design:
// - Circular dot indicator (8px-10px) with white knockout border ring
// - Vibrant status dots: Brand Blue (#2a85ff), Emerald, Amber, Red
// - Soft ping animation option for real-time notifications
// - Dark mode support with dark:ring-gray-900
//
// What it does:
// - Renders discreet status dots attached to an anchor target
// - Supports static and animated pulsing indicators
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
// import DotBadge from '@/TestComponent/DataDisplay/Badge/DotBadge';
//
// const MyComponent = () => {
//     return <DotBadge />
// }
// ```

'use client'

import { HiOutlineBell, HiOutlineChatAlt } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DotBadge({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-8', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* 1. Red Notification Dot */}
            <div className="relative inline-block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <HiOutlineBell className="h-6 w-6" />
                </div>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            </div>

            {/* 2. Blue Activity Dot with Pulse */}
            <div className="relative inline-block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <HiOutlineChatAlt className="h-6 w-6" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2a85ff] opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#2a85ff] ring-2 ring-white dark:ring-gray-900" />
                </span>
            </div>

            {/* 3. Emerald Success Dot */}
            <div className="relative inline-block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <HiOutlineBell className="h-6 w-6" />
                </div>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
            </div>
        </div>
    )
}

export default DotBadge;
