// TypeAvatar

// TypeAvatar · Avatar demo
// Description:
// Demonstrates avatar content types: text initials, icon placeholders, and photo image sources.
// Accommodates user profile states from empty initial accounts to fully configured profiles.
//
// Design:
// - Text initials with bold centered typography
// - Icon avatar with standard icon placeholder
// - Photo avatar with smooth object-cover cropping
// - Dark mode support with dark:bg-gray-800 and dark:text-gray-200
//
// What it does:
// - Renders text-based, icon-based, and image-based profile avatars
// - Handles image onerror fallback gracefully
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
// import TypeAvatar from '@/TestComponent/DataDisplay/Avatar/TypeAvatar';
//
// const MyComponent = () => {
//     return <TypeAvatar />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TypeAvatar({
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
            {/* 1. Initials Avatar */}
            <div className="flex flex-col items-center gap-2">
                <div
                    className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-[#2a85ff] shadow-sm',
                        'dark:bg-blue-950/50 dark:text-blue-400',
                        (disabled || loading) && 'opacity-50',
                    )}
                >
                    JD
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Initials</span>
            </div>

            {/* 2. Icon Avatar */}
            <div className="flex flex-col items-center gap-2">
                <div
                    className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm',
                        'dark:bg-gray-800 dark:text-gray-300',
                        (disabled || loading) && 'opacity-50',
                    )}
                >
                    <HiOutlineUser className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Icon</span>
            </div>

            {/* 3. Image Photo Avatar */}
            <div className="flex flex-col items-center gap-2">
                <img
                    alt="User Profile"
                    className={cn(
                        'h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-gray-100 dark:ring-gray-700',
                        (disabled || loading) && 'opacity-50',
                    )}
                    src="/img/avatars/thumb-1.jpg"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Photo Image</span>
            </div>
        </div>
    )
}

export default TypeAvatar;
