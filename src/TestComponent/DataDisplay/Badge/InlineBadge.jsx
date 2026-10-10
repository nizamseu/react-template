// InlineBadge

// InlineBadge · Badge demo
// Description:
// Standalone and inline badge component for text headings, table rows, and list items.
// Displays contextual tags, status pills, or version labels seamlessly within typography flow.
//
// Design:
// - Inline-flex capsule alignment matching font baseline
// - Clean micro-pill styling with status dot prefixes
// - Multi-color support: Brand Blue (#2a85ff), Emerald, Amber, Rose
// - Dark mode support with dark:bg-gray-800 and dark:text-gray-200
//
// What it does:
// - Renders inline status pills with dot prefixes and text labels
// - Blends gracefully inside headings, tables, or cards
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
// import InlineBadge from '@/TestComponent/DataDisplay/Badge/InlineBadge';
//
// const MyComponent = () => {
//     return <InlineBadge />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const inlineItems = [
    { label: 'Active', dotClass: 'bg-emerald-500', pillClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { label: 'Pending', dotClass: 'bg-amber-500', pillClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
    { label: 'In Review', dotClass: 'bg-[#2a85ff]', pillClass: 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400' },
    { label: 'Cancelled', dotClass: 'bg-red-500', pillClass: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
]

export function InlineBadge({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {inlineItems.map((item, idx) => (
                <div
                    key={idx}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-xs',
                        item.pillClass,
                        (disabled || loading) && 'opacity-50',
                    )}
                >
                    <span className={cn('h-1.5 w-1.5 rounded-full', item.dotClass)} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

export default InlineBadge;
