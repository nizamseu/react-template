// CustomIconAlert

// CustomIconAlert · Alert demo

// Description:
// Demonstrates replacing the default status icon with a custom React icon (e.g., HiFire)
// alongside success green styling.

// Design:
// - Success green banner (border-emerald-200, bg-emerald-50)
// - Custom flame icon in vibrant green/emerald
// - Dark mode support with dark:bg-emerald-950/30 and dark:border-emerald-800/40
// - Rounded-lg padding with aligned content

// What it does:
// - Accepts any custom icon component via customIcon prop
// - Renders a success alert with custom iconography
// - Clean display-only notification

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - customIcon: React node (default: <HiFire />)
// - children: node (default text)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomIconAlert from '@/TestComponent/Feedback/Alert/CustomIconAlert';
//
// const MyComponent = () => {
//     return <CustomIconAlert />
// }
// ```

'use client'

import { HiFire } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomIconAlert({
    children = 'Additional description and information about copywriting.',
    className,
    customIcon = <HiFire className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'flex w-full max-w-xl items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 transition-colors',
                'dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            role="alert"
            {...props}
        >
            <div className="mt-0.5 shrink-0">{customIcon}</div>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default CustomIconAlert
