// InternalScrollDialog

// InternalScrollDialog · Dialog demo

// Description:
// Demonstrates a modal Dialog with internal scrolling content. When modal content
// exceeds available viewport height, the body area scrolls smoothly while header and footer stay pinned.

// Design:
// - Scrollable body with max-h-80 overflow-y-auto
// - Clean divider borders separating content and action buttons
// - Fixed footer with Cancel / Okay actions
// - Full dark mode support

// What it does:
// - Displays extensive text inside a scroll container
// - Header and footer remain accessible during scroll

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import InternalScrollDialog from '@/TestComponent/Feedback/Dialog/InternalScrollDialog';
//
// const MyComponent = () => {
//     return <InternalScrollDialog />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InternalScrollDialog({
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
                Open Internal Scroll Dialog
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
                            <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Terms & Conditions
                            </h5>
                            <button
                                aria-label="Close dialog"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-80 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 space-y-3">
                            <p>
                                There are only two kinds of programming languages: those
                                people always bitch about and those nobody uses. (Bjarne
                                Stroustrup) Walking on water and developing software from
                                a specification are easy if both are frozen. (Edward V
                                Berard)
                            </p>
                            <p>
                                If debugging is the process of removing bugs, then
                                programming must be the process of putting them in.
                                (Edsger W. Dijkstra) Any fool can use a computer. Many
                                do. (Ted Nelson)
                            </p>
                            <p>
                                If the automobile had followed the same development cycle
                                as the computer, a Rolls-Royce would today cost $100,
                                get a million miles per gallon, and explode once a year.
                                (Robert X. Cringely)
                            </p>
                            <p>
                                It has been said that the great scientific disciplines
                                are synthesized from three components: observation,
                                experiment, and mathematics.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 border-t border-gray-100 p-4 dark:border-gray-700">
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
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InternalScrollDialog
