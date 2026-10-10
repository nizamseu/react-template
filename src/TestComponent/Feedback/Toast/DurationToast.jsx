// DurationToast

// DurationToast · Toast demo

// Description:
// Demonstrates Toast duration controls: a persistent toast that remains until manually dismissed
// (duration = 0) and an expedited toast that automatically dismisses after 2 seconds (2000ms).

// Design:
// - Two trigger buttons: "Persist (No timeout)" and "Close after 2s"
// - Floating top-right notification card with emerald success styling
// - Full dark mode support

// What it does:
// - Shows persistent notification without timer
// - Shows timed notification auto-closing in 2 seconds

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DurationToast from '@/TestComponent/Feedback/Toast/DurationToast';
//
// const MyComponent = () => {
//     return <DurationToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DurationToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [toastInfo, setToastInfo] = useState(null)

    const triggerToast = (duration) => {
        setToastInfo({ duration })
        if (duration > 0) {
            setTimeout(() => {
                setToastInfo(null)
            }, duration)
        }
    }

    return (
        <div
            className={cn('flex items-center gap-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast(0)}
            >
                Persist (Stay until closed)
            </button>
            <button
                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast(2000)}
            >
                Close after 2s
            </button>

            {toastInfo && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <div className="flex-1 pr-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {toastInfo.duration === 0 ? 'Persistent Toast' : 'Auto-closing in 2s'}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                            {toastInfo.duration === 0
                                ? 'This toast will stay visible until you click the close button.'
                                : 'This toast will automatically disappear in 2,000 milliseconds.'}
                        </div>
                    </div>
                    <button
                        aria-label="Close toast"
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                        type="button"
                        onClick={() => setToastInfo(null)}
                    >
                        <HiX className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default DurationToast
