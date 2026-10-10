// FooterDrawer

// FooterDrawer · Drawer demo

// Description:
// Demonstrates a Drawer panel featuring an actionable bottom footer bar with
// secondary and primary confirm buttons.

// Design:
// - Pinned footer bar with subtle top border
// - Brand blue #2a85ff confirm button and clean Cancel button
// - Full dark mode support

// What it does:
// - Keeps action triggers visible at the bottom of the drawer
// - Handles cancel and confirmation dismissals

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import FooterDrawer from '@/TestComponent/Feedback/Drawer/FooterDrawer';
//
// const MyComponent = () => {
//     return <FooterDrawer />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FooterDrawer({
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
                Open Drawer (With Footer)
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
                            <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Drawer Title
                            </h5>
                            <button
                                aria-label="Close drawer"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Configure your preferences in this side panel and click
                            Confirm below to save changes.
                        </div>

                        {/* Pinned Footer */}
                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4 dark:border-gray-700">
                            <button
                                className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-lg bg-[#2a85ff] px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#2072db] transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FooterDrawer
