// BasicTag

// BasicTag · Tag demo
// Description:
// Standard category tag component. Labels items, categories, or attributes with clean border
// and subtle neutral styling.
//
// Design:
// - Rounded-md badge container with subtle border (border-gray-200 dark:border-gray-700)
// - Balanced font padding (px-2.5 py-1 text-xs font-medium)
// - Hover transition and dark mode support
//
// What it does:
// - Renders a basic semantic tag with children content
//
// Props:
// - children: node (default: "Basic Tag")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicTag from '@/TestComponent/DataDisplay/Tag/BasicTag';
//
// const MyComponent = () => {
//     return <BasicTag>Technology</BasicTag>
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BasicTag({
    children = 'Basic Tag',
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('inline-flex items-center gap-2', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <span
                className={cn(
                    'inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:border-gray-300',
                    'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600',
                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                )}
            >
                {children}
            </span>
        </div>
    )
}

export default BasicTag;
