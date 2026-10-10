// BasicCard

// BasicCard · Cards demo
// Description:
// Clean structural card container for grouping related content, text, and media.
// Provides balanced padding, soft borders, and subtle elevation.
//
// Design:
// - Rounded-xl border with subtle border-gray-200 (dark:border-gray-700)
// - White background (dark:bg-gray-800) with soft drop shadow
// - Clear typography hierarchy with h5 title and descriptive body
//
// What it does:
// - Encloses content cleanly within an isolated card container
// - Supports custom children or default card copywriting
//
// Props:
// - title: string (default: "Card title")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicCard from '@/TestComponent/DataDisplay/Cards/BasicCard';
//
// const MyComponent = () => {
//     return <BasicCard title="Account Overview" />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BasicCard({
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Card title',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h5>
            <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {children || (
                    <p>
                        Some quick example text to build on the card title and make up the bulk of
                        the card&apos;s content.
                    </p>
                )}
            </div>
        </div>
    )
}

export default BasicCard;
