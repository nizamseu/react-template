// WidthHeightDrawer

// WidthHeightDrawer · Drawer demo

// Description:
// Demonstrates Drawer panels with custom dimensions: a wider vertical drawer (600px)
// and a custom height bottom drawer (300px).

// Design:
// - Two action buttons for Vertical (600px) and Horizontal (300px) drawers
// - Explicit width/height constraints with overflow scrolling
// - Full dark mode support

// What it does:
// - Opens vertical drawer with max-w-[600px]
// - Opens horizontal bottom drawer with h-[300px]
// - Independent trigger management

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import WidthHeightDrawer from '@/TestComponent/Feedback/Drawer/WidthHeightDrawer';
//
// const MyComponent = () => {
//     return <WidthHeightDrawer />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function WidthHeightDrawer({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [verticalOpen, setVerticalOpen] = useState(false)
    const [horizontalOpen, setHorizontalOpen] = useState(false)

    return (
        <div
            className={cn('flex flex-wrap items-center gap-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => setVerticalOpen(true)}
            >
                Vertical Drawer (600px)
            </button>
            <button
                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => setHorizontalOpen(true)}
            >
                Horizontal Drawer (300px)
            </button>

            {/* Vertical Drawer */}
            {verticalOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setVerticalOpen(false)}
                >
                    <div
                        className="relative flex h-full w-full max-w-[600px] flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
                            <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Vertical Drawer (Width: 600px)
                            </h5>
                            <button
                                aria-label="Close drawer"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setVerticalOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-300">
                            Custom width content panel.
                        </div>
                    </div>
                </div>
            )}

            {/* Horizontal Drawer */}
            {horizontalOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity"
                    role="dialog"
                    onClick={() => setHorizontalOpen(false)}
                >
                    <div
                        className="relative flex h-[300px] w-full flex-col border-t border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
                            <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Horizontal Drawer (Height: 300px)
                            </h5>
                            <button
                                aria-label="Close drawer"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setHorizontalOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-300">
                            Custom height bottom sheet content panel.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WidthHeightDrawer
