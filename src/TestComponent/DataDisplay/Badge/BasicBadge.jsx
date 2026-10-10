// BasicBadge

// BasicBadge · Badge demo
// Description:
// Standard badge notification overlay attached to an anchor element (avatar or icon).
// Highlights unread message counts or status labels.
//
// Design:
// - Absolute positioned red/primary capsule badge over anchor component
// - Crisp white knockout border ring (ring-2 ring-white dark:ring-gray-900)
// - Bold white typography with proportional micro-padding
// - Dark mode support with dark:ring-gray-900
//
// What it does:
// - Overlays numeric counts or brief text tags ('New') onto children elements
// - Auto-expands into rounded capsule for multi-digit content
//
// Props:
// - content: string | number (default: 9)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicBadge from '@/TestComponent/DataDisplay/Badge/BasicBadge';
//
// const MyComponent = () => {
//     return <BasicBadge content={9} />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicBadge({
    className,
    content = 9,
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
            {/* Number Count Badge */}
            <div className="relative inline-block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <HiOutlineUser className="h-6 w-6" />
                </div>
                <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-white shadow-sm dark:ring-gray-900">
                    {content}
                </span>
            </div>

            {/* Text Tag Badge */}
            <div className="relative inline-block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <HiOutlineUser className="h-6 w-6" />
                </div>
                <span className="absolute -right-2 -top-1.5 inline-flex items-center justify-center rounded-full bg-[#2a85ff] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ring-2 ring-white shadow-sm dark:ring-gray-900">
                    New
                </span>
            </div>
        </div>
    )
}

export default BasicBadge;
