// CustomCloseToast

// CustomCloseToast · Toast demo

// Description:
// Demonstrates a Toast notification featuring customized inline action buttons (Confirm and Close)
// within the notification body to trigger subsequent actions before dismissing.

// Design:
// - Floating top-right notification card with footer action buttons
// - Brand blue #2a85ff primary Confirm button and neutral Close button
// - Full dark mode support

// What it does:
// - Renders an interactive actionable toast
// - Dismisses on either action button click

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomCloseToast from '@/TestComponent/Feedback/Toast/CustomCloseToast';
//
// const MyComponent = () => {
//     return <CustomCloseToast />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function CustomCloseToast({
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
                Show Actionable Toast
            </button>

            {visible && (
                <div
                    aria-live="polite"
                    className="fixed right-6 top-6 z-50 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
                    role="status"
                >
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Action Required
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        The file import was processed with warnings. Would you like to
                        confirm and continue?
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                            type="button"
                            onClick={() => setVisible(false)}
                        >
                            Close
                        </button>
                        <button
                            className="rounded-md bg-[#2a85ff] px-3 py-1 text-xs font-semibold text-white shadow hover:bg-[#2072db] transition"
                            type="button"
                            onClick={() => setVisible(false)}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomCloseToast
