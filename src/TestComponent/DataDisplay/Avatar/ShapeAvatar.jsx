// ShapeAvatar

// ShapeAvatar · Avatar demo
// Description:
// Avatar component demonstrating geometric shapes: square, rounded rectangle, and circle.
// Fits diverse visual design requirements from modern sharp corners to playful circles.
//
// Design:
// - Square: crisp subtle rounded edges (rounded-md)
// - Rounded: generous soft corners (rounded-2xl)
// - Circle: completely round avatar (rounded-full)
// - Dark mode support with dark:bg-gray-800 and dark:text-gray-300
//
// What it does:
// - Renders avatars in 3 distinct geometric silhouettes
// - Supports icons and custom fallback indicators
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
// import ShapeAvatar from '@/TestComponent/DataDisplay/Avatar/ShapeAvatar';
//
// const MyComponent = () => {
//     return <ShapeAvatar />
// }
// ```

'use client'

import { HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const shapes = [
    { label: 'Square', shapeClass: 'rounded-md' },
    { label: 'Rounded Rectangle', shapeClass: 'rounded-2xl' },
    { label: 'Circle', shapeClass: 'rounded-full' },
]

export function ShapeAvatar({
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
            {shapes.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                        className={cn(
                            'inline-flex h-12 w-12 items-center justify-center bg-gray-100 text-gray-600 shadow-sm transition',
                            'dark:bg-gray-800 dark:text-gray-300',
                            item.shapeClass,
                            (disabled || loading) && 'opacity-50',
                        )}
                    >
                        <HiOutlineUser className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

export default ShapeAvatar;
