// CustomIconToast

// CustomIconToast · Toast demo

// Description:
// Demonstrates Toast notifications featuring custom leading media: a custom gift icon (HiOutlineGift)
// and a circular user avatar placeholder.

// Design:
// - Two action trigger buttons: "Custom Icon" and "Avatar"
// - Floating top-right card with custom leading graphic
// - Full dark mode support and smooth animation

// What it does:
// - Displays toast with custom icon or circular avatar
// - Auto-dismisses after 3.5 seconds

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomIconToast from '@/TestComponent/Feedback/Toast/CustomIconToast';
//
// const MyComponent = () => {
//     return <CustomIconToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineGift, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomIconToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [toastData, setToastData] = useState(null)

    const triggerToast = (mode) => {
        if (mode === 'icon') {
            setToastData({
                desc: 'Something special you may like.',
                media: <HiOutlineGift className="h-6 w-6 text-indigo-500" />,
                title: 'You received a Gift!',
            })
        } else {
            setToastData({
                desc: 'Sent you a friend request.',
                media: (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                        EG
                    </div>
                ),
                title: 'Emily Gale',
            })
        }
        setTimeout(() => {
            setToastData(null)
        }, 3500)
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
                onClick={() => triggerToast('icon')}
            >
                Custom Icon
            </button>
            <button
                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => triggerToast('avatar')}
            >
                Avatar
            </button>

            {toastData && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <div className="mt-0.5 shrink-0">{toastData.media}</div>
                    <div className="flex-1 pr-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {toastData.title}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                            {toastData.desc}
                        </div>
                    </div>
                    <button
                        aria-label="Close toast"
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                        type="button"
                        onClick={() => setToastData(null)}
                    >
                        <HiX className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default CustomIconToast
