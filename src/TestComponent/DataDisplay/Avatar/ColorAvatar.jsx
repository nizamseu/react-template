// ColorAvatar

// ColorAvatar · Avatar demo
// Description:
// Avatar component showcasing varied theme color palettes and tints.
// Allows user roles, teams, or status tiers to be quickly differentiated by signature color tints.
//
// Design:
// - Soft background fills paired with high-contrast text and icon foregrounds
// - Multi-color spectrum: Brand Blue, Emerald, Amber, Rose, Purple, Indigo
// - Dark mode support with semi-transparent color backgrounds
//
// What it does:
// - Renders avatars with varied curated background color combinations
// - Compatible with initials and icon representations
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
// import ColorAvatar from '@/TestComponent/DataDisplay/Avatar/ColorAvatar';
//
// const MyComponent = () => {
//     return <ColorAvatar />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const colorVariants = [
    { label: 'Blue', colorClass: 'bg-blue-100 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400' },
    { label: 'Indigo', colorClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { label: 'Emerald', colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { label: 'Amber', colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' },
    { label: 'Rose', colorClass: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
    { label: 'Purple', colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
]

export function ColorAvatar({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('flex flex-wrap items-center gap-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {colorVariants.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                        className={cn(
                            'inline-flex h-11 w-11 items-center justify-center rounded-full font-bold shadow-sm transition',
                            item.colorClass,
                            (disabled || loading) && 'opacity-50',
                        )}
                    >
                        {idx % 2 === 0 ? <HiOutlineUser className="h-5 w-5" /> : item.label[0]}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

export default ColorAvatar;
