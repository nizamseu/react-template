// SizeAvatar

// SizeAvatar · Avatar demo
// Description:
// Demonstrates avatar indicators rendered across different size scales (sm, md, lg, xl/custom).
// Provides consistent profile representation across various interface densities.
//
// Design:
// - Circular avatars with proportional icon sizing and font sizing
// - Neutral border/background styling with dark mode support
// - Smooth transitions on hover
//
// What it does:
// - Renders sm (32px), md (40px), lg (48px), and xl (60px) avatar variants
// - Supports icons, initials, or image assets
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
// import SizeAvatar from '@/TestComponent/DataDisplay/Avatar/SizeAvatar';
//
// const MyComponent = () => {
//     return <SizeAvatar />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const sizes = [
    { label: 'Small (32px)', sizeClass: 'h-8 w-8 text-sm', iconSize: 'h-4 w-4' },
    { label: 'Medium (40px)', sizeClass: 'h-10 w-10 text-base', iconSize: 'h-5 w-5' },
    { label: 'Large (48px)', sizeClass: 'h-12 w-12 text-lg', iconSize: 'h-6 w-6' },
    { label: 'Extra Large (60px)', sizeClass: 'h-[60px] w-[60px] text-xl', iconSize: 'h-8 w-8' },
]

export function SizeAvatar({
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
            {sizes.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                        className={cn(
                            'inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition',
                            'dark:bg-gray-800 dark:text-gray-300',
                            item.sizeClass,
                            (disabled || loading) && 'opacity-50',
                        )}
                    >
                        <HiOutlineUser className={item.iconSize} />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

export default SizeAvatar;
