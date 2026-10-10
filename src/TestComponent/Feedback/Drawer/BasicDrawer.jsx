// BasicDrawer

// BasicDrawer · Drawer demo

// Description:
// Basic usage of a slide-out Drawer panel. Provides a supplementary sidebar overlay
// anchored to the right viewport edge for off-canvas content and navigation.

// Design:
// - Fixed right-edge slideover panel (max-w-md w-full)
// - Semi-transparent backdrop with blur
// - Clean header with title and close icon button
// - Full dark mode support (dark:bg-gray-800, dark:border-gray-700)

// What it does:
// - Toggles drawer open/close state
// - Closes on backdrop click, Escape key, or close icon click
// - Smooth transition overlay

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicDrawer from '@/TestComponent/Feedback/Drawer/BasicDrawer';
//
// const MyComponent = () => {
//     return <BasicDrawer />
// }
// ```

'use client'

import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicDrawer({
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
                Open Drawer
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
                        {/* Header */}
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

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            <p>
                                Drawer Content. You can place forms, filters, profile settings,
                                or supplementary documentation right here.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BasicDrawer
