// CustomStyleDialog

// CustomStyleDialog · Dialog demo

// Description:
// Demonstrates a modal Dialog featuring customized card styling, including custom margin offset
// and a contrasting background footer bar.

// Design:
// - Dialog body with generous padding (p-6)
// - Dedicated contrasting footer container (bg-gray-50 dark:bg-gray-700/50)
// - Brand blue #2a85ff submit button
// - Full dark mode support

// What it does:
// - Displays a stylized modal card with segmented body and footer sections
// - Handles open and dismiss events cleanly

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomStyleDialog from '@/TestComponent/Feedback/Dialog/CustomStyleDialog';
//
// const MyComponent = () => {
//     return <CustomStyleDialog />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomStyleDialog({
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
                Open Custom Style Dialog
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            aria-label="Close dialog"
                            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            <HiX className="h-5 w-5" />
                        </button>

                        <div className="p-6">
                            <h5 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                                Custom Styled Modal
                            </h5>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                This dialog features a contrasting footer panel, custom
                                padding structure, and refined border treatments.
                            </p>
                        </div>

                        {/* Distinct Colored Footer */}
                        <div className="flex justify-end gap-2 bg-gray-50 px-6 py-4 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-700/60">
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
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomStyleDialog
