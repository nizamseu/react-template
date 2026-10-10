// BorderlessCard

// BorderlessCard · Cards demo
// Description:
// Clean borderless card design with soft background fill or drop shadow instead of perimeter borders.
// Excellent for minimal dashboards, modern clean themes, or high-density layouts.
//
// Design:
// - Borderless perimeter (border-0)
// - Gentle background tint (bg-gray-50/80 dark:bg-gray-800/80) and soft shadow
// - Rounded-xl corners
//
// What it does:
// - Renders a card container without physical border strokes
// - Blends seamlessly into modern flat interface layouts
//
// Props:
// - title: string (default: "Borderless Card")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BorderlessCard from '@/TestComponent/DataDisplay/Cards/BorderlessCard';
//
// const MyComponent = () => {
//     return <BorderlessCard />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BorderlessCard({
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Borderless Card',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'w-full max-w-md rounded-xl bg-gray-50 p-6 shadow-sm transition dark:bg-gray-800/90',
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
                        the card&apos;s content without any distracting outline borders.
                    </p>
                )}
            </div>
        </div>
    )
}

export default BorderlessCard;
