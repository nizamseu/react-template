// CustomStyleDrawer

// CustomStyleDrawer · Drawer demo

// Description:
// Demonstrates a custom styled Drawer panel featuring an inverted background header,
// supporting subtitle copy, and full-width action buttons.

// Design:
// - Dark/accent header bar (bg-gray-100 dark:bg-gray-900)
// - Subtitle caption underneath the title
// - Full-width action buttons in footer
// - Full dark mode support

// What it does:
// - Demonstrates customized panel sections
// - Handles open and dismiss events

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomStyleDrawer from '@/TestComponent/Feedback/Drawer/CustomStyleDrawer';
//
// const MyComponent = () => {
//     return <CustomStyleDrawer />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomStyleDrawer({
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
                Open Custom Style Drawer
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
                        {/* Custom Styled Header */}
                        <div className="flex items-start justify-between border-b border-gray-200 bg-gray-100 p-5 dark:border-gray-700 dark:bg-gray-900">
                            <div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    Drawer Title
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    To iterate is human, to recurse divine.
                                </p>
                            </div>
                            <button
                                aria-label="Close drawer"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-300">
                            Drawer Content with custom styling.
                        </div>

                        {/* Full Width Footer */}
                        <div className="flex gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 rounded-lg bg-[#2a85ff] py-2 text-xs font-semibold text-white shadow hover:bg-[#2072db] transition"
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

export default CustomStyleDrawer
