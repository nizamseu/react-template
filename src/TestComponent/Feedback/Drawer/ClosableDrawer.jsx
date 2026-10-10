// ClosableDrawer

// ClosableDrawer · Drawer demo

// Description:
// Demonstrates a Drawer panel without a close icon in the header (closable = false).
// The user dismisses the drawer by clicking the backdrop or pressing Escape.

// Design:
// - Header with title only (no close icon button)
// - Clean typography and dark mode support
// - Semi-transparent backdrop with blur

// What it does:
// - Omits close icon button in the header
// - Closes on backdrop click or Escape key

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ClosableDrawer from '@/TestComponent/Feedback/Drawer/ClosableDrawer';
//
// const MyComponent = () => {
//     return <ClosableDrawer />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function ClosableDrawer({
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
                Open Drawer (No Close Icon)
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
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-600 dark:text-gray-300">
                            Drawer Content without top-right close icon. Click the
                            backdrop to dismiss.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClosableDrawer
