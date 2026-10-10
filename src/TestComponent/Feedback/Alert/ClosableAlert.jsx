// ClosableAlert

// ClosableAlert · Alert demo

// Description:
// Demonstrates a dismissible Alert banner with an interactive close button.
// Users can click the close icon to dismiss the alert banner.

// Design:
// - Success green banner (border-emerald-200, bg-emerald-50)
// - Trailing close button with smooth hover state
// - Reset button when dismissed to easily preview the interaction
// - Dark mode support with dark:bg-emerald-950/30 and dark:border-emerald-800/40

// What it does:
// - Manages open/closed state locally
// - Fires optional onClose callback
// - Displays a "Reset alert" trigger when closed for interactive testing

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - children: node (default text)
// - onClose: function callback
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ClosableAlert from '@/TestComponent/Feedback/Alert/ClosableAlert';
//
// const MyComponent = () => {
//     return <ClosableAlert />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClosableAlert({
    children = 'Thanks for submitting your application. Our team will get back to you soon.',
    className,
    disabled = false,
    loading = false,
    onClose,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(false)
        if (onClose) {
            onClose()
        }
    }

    if (!open) {
        return (
            <div className="w-full max-w-xl">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    Reset Alert
                </button>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'flex w-full max-w-xl items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 transition-all',
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
            <div className="flex items-start gap-3">
                <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="flex-1">{children}</div>
            </div>
            <button
                aria-label="Close alert"
                className="rounded p-1 text-emerald-700 hover:bg-emerald-100/80 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={handleClose}
            >
                <HiX className="h-4 w-4" />
            </button>
        </div>
    )
}

export default ClosableAlert
