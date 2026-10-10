// AlertToast

// AlertToast · Toast demo

// Description:
// Demonstrates rendering an Alert banner style inside a top floating Toast overlay.
// Fuses the rich semantic styling of Alert with the transient popup behavior of Toast.

// Design:
// - Top-centered fixed banner (fixed top-6 left-1/2 -translate-x-1/2)
// - Success green banner style (bg-emerald-50, border-emerald-200)
// - Leading check icon and dismiss button
// - Full dark mode support

// What it does:
// - Displays a floating banner alert
// - Auto-dismisses after 4 seconds or on manual close

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AlertToast from '@/TestComponent/Feedback/Toast/AlertToast';
//
// const MyComponent = () => {
//     return <AlertToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AlertToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [visible, setVisible] = useState(false)

    const showAlertToast = () => {
        setVisible(true)
        setTimeout(() => {
            setVisible(false)
        }, 4000)
    }

    return (
        <div
            className={cn('inline-block', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={showAlertToast}
            >
                Show Alert Toast
            </button>

            {visible && (
                <div
                    aria-live="polite"
                    className="fixed left-1/2 top-6 z-50 flex w-full max-w-lg -translate-x-1/2 items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-2xl dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-200 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="alert"
                >
                    <div className="flex items-center gap-3">
                        <HiCheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium">
                            Action completed successfully! Your settings have been saved.
                        </span>
                    </div>
                    <button
                        aria-label="Close alert toast"
                        className="rounded p-1 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition"
                        type="button"
                        onClick={() => setVisible(false)}
                    >
                        <HiX className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default AlertToast
