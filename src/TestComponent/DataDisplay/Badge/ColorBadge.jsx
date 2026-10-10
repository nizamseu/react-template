// ColorBadge

// ColorBadge · Badge demo
// Description:
// Badge component showcasing diverse semantic color themes (Blue, Emerald, Red, Amber, Neutral).
// Communicates urgency, status tier, and information categorization through intentional color tokens.
//
// Design:
// - Filled color badges and subtle soft tint badges
// - White border ring overlay against anchor element
// - Multi-color support (Blue #2a85ff, Emerald, Red, Amber)
// - Dark mode support with dark:ring-gray-900
//
// What it does:
// - Renders badges with diverse background and text color tokens
// - Supports dot indicators and count capsules
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
// import ColorBadge from '@/TestComponent/DataDisplay/Badge/ColorBadge';
//
// const MyComponent = () => {
//     return <ColorBadge />
// }
// ```

'use client'

import { HiOutlineBell } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const badges = [
    { label: 'Blue', badgeClass: 'bg-[#2a85ff] text-white', count: 5 },
    { label: 'Emerald', badgeClass: 'bg-emerald-500 text-white', count: 12 },
    { label: 'Amber', badgeClass: 'bg-amber-500 text-white', count: 8 },
    { label: 'Red Soft', badgeClass: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-bold', count: 99 },
    { label: 'Neutral', badgeClass: 'bg-white text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600', count: 'Pro' },
]

export function ColorBadge({
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
            {badges.map((item, idx) => (
                <div key={idx} className="relative inline-block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                        <HiOutlineBell className="h-6 w-6" />
                    </div>
                    <span
                        className={cn(
                            'absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold ring-2 ring-white shadow-sm dark:ring-gray-900',
                            item.badgeClass,
                            (disabled || loading) && 'opacity-50',
                        )}
                    >
                        {item.count}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default ColorBadge;
