// BasicDialog

// BasicDialog · Dialog demo

// Description:
// Basic usage of a modal Dialog overlay component. Forces user interaction
// by presenting critical information or confirmation requests in a focused overlay.

// Design:
// - Semi-transparent backdrop overlay with blur (bg-black/50 backdrop-blur-sm)
// - Centered modal card with rounded-xl border and deep shadow
// - Action buttons (Cancel / Okay) with brand blue #2a85ff
// - Full dark mode support (dark:bg-gray-800, dark:border-gray-700)

// What it does:
// - Manages open/close modal state
// - Supports clicking backdrop or pressing Escape to close
// - Provides primary and secondary action triggers

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicDialog from '@/TestComponent/Feedback/Dialog/BasicDialog';
//
// const MyComponent = () => {
//     return <BasicDialog />
// }
// ```

'use client'

import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicDialog({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

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
                Open Dialog
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
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

                        <h5 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                            Dialog Title
                        </h5>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered alteration in some
                            form, by injected humour, or randomised words which don&apos;t
                            look even slightly believable.
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

export default BasicDialog
