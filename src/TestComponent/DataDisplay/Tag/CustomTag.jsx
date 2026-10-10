// CustomTag

// CustomTag · Tag demo
// Description:
// Colorful pill tags with custom background fills and typography treatments.
// Communicates distinct status categories such as priorities, categories, and tags.
//
// Design:
// - Borderless pills with vibrant background tints
// - High-contrast text colors
// - Dark mode support with semi-transparent tinted backgrounds
//
// What it does:
// - Renders customized solid and soft filled tags
// - Fits label requirements for cards, tables, and product badges
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
// import CustomTag from '@/TestComponent/DataDisplay/Tag/CustomTag';
//
// const MyComponent = () => {
//     return <CustomTag />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const customTags = [
    { label: 'Urgent', tagClass: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
    { label: 'In Progress', tagClass: 'bg-blue-100 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400' },
    { label: 'Completed', tagClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { label: 'Featured', tagClass: 'bg-indigo-600 text-white' },
    { label: 'Warning', tagClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
]

export function CustomTag({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {customTags.map((item, idx) => (
                <span
                    key={idx}
                    className={cn(
                        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold shadow-xs',
                        item.tagClass,
                        (disabled || loading) && 'opacity-50',
                    )}
                >
                    {item.label}
                </span>
            ))}
        </div>
    )
}

export default CustomTag;
