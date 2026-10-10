// IconAlert

// IconAlert · Alert demo

// Description:
// Displays an Alert banner with an integrated status icon indicating system activity or notification context.

// Design:
// - Warning accent banner with icon in leading slot
// - Flex row alignment with icon and message
// - Amber theme with dark mode support
// - Subtle border and rounded container

// What it does:
// - Renders a notification banner with an alert icon
// - Supports custom children message
// - Display-only banner

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - children: node (default text)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import IconAlert from '@/TestComponent/Feedback/Alert/IconAlert';
//
// const MyComponent = () => {
//     return <IconAlert />
// }
// ```

'use client'

import { HiExclamation } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function IconAlert({
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
                'flex w-full max-w-xl items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 transition-colors',
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
            <HiExclamation className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default IconAlert
