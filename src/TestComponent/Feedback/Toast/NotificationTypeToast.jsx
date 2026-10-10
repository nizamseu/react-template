// NotificationTypeToast

// NotificationTypeToast · Toast demo

// Description:
// Demonstrates Toast notifications themed by semantic status types:
// Success (green), Info (blue), Danger (red), and Warning (amber) with corresponding icons.

// Design:
// - Four distinct action trigger buttons
// - Floating top-right notification card with corresponding icon and border
// - Clean typography and shadow elevation
// - Full dark mode support

// What it does:
// - Displays a themed toast according to the clicked button type
// - Auto-dismisses after 3.5 seconds

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import NotificationTypeToast from '@/TestComponent/Feedback/Toast/NotificationTypeToast';
//
// const MyComponent = () => {
//     return <NotificationTypeToast />
// }
// ```

'use client'

import { useState } from 'react';
import {
    HiCheckCircle,
    HiInformationCircle,
    HiExclamation,
    HiXCircle,
    HiX,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const toastConfig = {
    danger: {
        icon: <HiXCircle className="h-5 w-5 text-rose-500" />,
        title: 'Danger',
    },
    info: {
        icon: <HiInformationCircle className="h-5 w-5 text-[#2a85ff]" />,
        title: 'Info',
    },
    success: {
        icon: <HiCheckCircle className="h-5 w-5 text-emerald-500" />,
        title: 'Success',
    },
    warning: {
        icon: <HiExclamation className="h-5 w-5 text-amber-500" />,
        title: 'Warning',
    },
}

export function NotificationTypeToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [currentToast, setCurrentToast] = useState(null)

    const triggerToast = (type) => {
        setCurrentToast(type)
        setTimeout(() => {
            setCurrentToast(null)
        }, 3500)
    }

    return (
        <div
            className={cn('flex flex-wrap items-center gap-2', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast('success')}
            >
                Success
            </button>
            <button
                className="rounded-lg bg-[#2a85ff] px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-[#2072db] transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast('info')}
            >
                Info
            </button>
            <button
                className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast('danger')}
            >
                Danger
            </button>
            <button
                className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-amber-600 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast('warning')}
            >
                Warning
            </button>

            {currentToast && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <div className="mt-0.5 shrink-0">
                        {toastConfig[currentToast]?.icon}
                    </div>
                    <div className="flex-1 pr-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {toastConfig[currentToast]?.title}
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            The fat cat sat on the mat bat away with paws annoy owner.
                        </div>
                    </div>
                    <button
                        aria-label="Close toast"
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                        type="button"
                        onClick={() => setCurrentToast(null)}
                    >
                        <HiX className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default NotificationTypeToast
