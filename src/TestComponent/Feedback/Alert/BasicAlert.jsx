// BasicAlert

// BasicAlert · Alert demo

// Description:
// Basic usage of an Alert notification component. Displays informational or warning text
// within a styled banner container with clean borders and subtle background.

// Design:
// - Subtle warning background (#fffbeb) with border (#fef3c7) in light mode
// - Dark mode support with dark:bg-amber-950/30 and dark:border-amber-800/40
// - Clean typography with text-sm text-amber-800 dark:text-amber-200
// - Rounded-lg padding (p-4)

// What it does:
// - Renders a standard feedback banner
// - Display-only banner for user notifications
// - Supports custom children content or default copywriting

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - children: node (default: "Additional description and information about copywriting.")
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicAlert from '@/TestComponent/Feedback/Alert/BasicAlert';
//
// const MyComponent = () => {
//     return <BasicAlert />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BasicAlert({
    children = 'Additional description and information about copywriting.',
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'w-full max-w-xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 transition-colors',
                'dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            role="alert"
            {...props}
        >
            {children}
        </div>
    )
}

export default BasicAlert
