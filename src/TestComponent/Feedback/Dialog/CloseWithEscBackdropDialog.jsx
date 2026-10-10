// CloseWithEscBackdropDialog

// CloseWithEscBackdropDialog · Dialog demo

// Description:
// Demonstrates a modal Dialog where backdrop click and Escape key dismissal are disabled.
// The user must explicitly interact with the action buttons to close the dialog.

// Design:
// - Standard modal container with backdrop
// - Backdrop click does not close
// - Escape key does not close
// - Action buttons provide explicit exit

// What it does:
// - Disables overlay dismissal
// - Ignores Escape key events
// - Enforces intentional user actions

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CloseWithEscBackdropDialog from '@/TestComponent/Feedback/Dialog/CloseWithEscBackdropDialog';
//
// const MyComponent = () => {
//     return <CloseWithEscBackdropDialog />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function CloseWithEscBackdropDialog({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)

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
                onClick={() => setIsOpen(true)}
            >
                Open Dialog (Disable Esc & Backdrop)
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
                    role="dialog"
                >
                    <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                        <h5 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                            Dialog Title (Persistent)
                        </h5>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Clicking the backdrop or pressing the Escape key will NOT
                            close this dialog. You must click one of the buttons below.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CloseWithEscBackdropDialog
