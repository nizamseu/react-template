// StatusAvatar

// StatusAvatar · Avatar demo
// Description:
// Avatar component equipped with presence indicators and notification badge overlays.
// Communicates online, away, busy, and unread notification counts directly on the user avatar.
//
// Design:
// - Absolute positioned status dots with white border knockouts (ring-2 ring-white)
// - Color-coded presence dots: Online (Emerald), Busy (Red), Away (Amber)
// - Numeric badge capsule for unread message counts
// - Dark mode support with dark:ring-gray-900
//
// What it does:
// - Positions presence indicators at the bottom-right or top-right quadrant
// - Renders numeric count badges
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
// import StatusAvatar from '@/TestComponent/DataDisplay/Avatar/StatusAvatar';
//
// const MyComponent = () => {
//     return <StatusAvatar />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StatusAvatar({
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
            {/* 1. Online Presence */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineUser className="h-6 w-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>

            {/* 2. Away Presence */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineUser className="h-6 w-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-gray-900" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Away</span>
            </div>

            {/* 3. Busy Presence */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineUser className="h-6 w-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Busy</span>
            </div>

            {/* 4. Notification Count Badge */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative inline-block">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineUser className="h-6 w-6" />
                    </div>
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                        8
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Count Badge</span>
            </div>
        </div>
    )
}

export default StatusAvatar;
