// NotificationToast

// NotificationToast · Toast demo

// Description:
// Basic usage of a floating Toast Notification. Pops up a floating notification card
// with title and description text to communicate status updates without interrupting workflow.

// Design:
// - Floating top-right card with deep shadow (shadow-xl)
// - Clean white / dark:bg-gray-800 card with border
// - Brand blue #2a85ff trigger button
// - Auto-dismiss after 3.5 seconds

// What it does:
// - Manages toast visibility and timer
// - Displays notification title and body
// - Auto-dismisses smoothly

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import NotificationToast from '@/TestComponent/Feedback/Toast/NotificationToast';
//
// const MyComponent = () => {
//     return <NotificationToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NotificationToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [visible, setVisible] = useState(false)

    const showToast = () => {
        setVisible(true)
        setTimeout(() => {
            setVisible(false)
        }, 3500)
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
                onClick={showToast}
            >
                Show Toast
            </button>

            {visible && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 flex w-full max-w-sm items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <div className="flex-1 pr-3">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Message
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            The fat cat sat on the mat bat away with paws annoy owner.
                        </div>
                    </div>
                    <button
                        aria-label="Close toast"
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

export default NotificationToast
