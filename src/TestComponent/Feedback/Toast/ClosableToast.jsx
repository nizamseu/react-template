// ClosableToast

// ClosableToast · Toast demo

// Description:
// Demonstrates an explicitly closable Toast notification featuring an interactive close icon.
// Users can dismiss the notification on demand or allow it to fade out.

// Design:
// - Prominent dismiss icon (HiX) with hover ring
// - Clean white / dark:bg-gray-800 card elevation
// - Brand blue #2a85ff trigger button

// What it does:
// - Provides a manual dismiss trigger
// - Closes instantly upon clicking the X button

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ClosableToast from '@/TestComponent/Feedback/Toast/ClosableToast';
//
// const MyComponent = () => {
//     return <ClosableToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX, HiInformationCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClosableToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [visible, setVisible] = useState(false)

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
                onClick={() => setVisible(true)}
            >
                Show Closable Toast
            </button>

            {visible && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <HiInformationCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#2a85ff]" />
                    <div className="flex-1 pr-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Closable Notification
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            The fat cat sat on the mat bat away with paws annoy owner. Click
                            the close icon to dismiss immediately.
                        </div>
                    </div>
                    <button
                        aria-label="Dismiss toast"
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
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

export default ClosableToast
