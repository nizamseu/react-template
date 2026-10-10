// PlacementToast

// PlacementToast · Toast demo

// Description:
// Demonstrates Toast placement across 6 different viewport regions:
// Top-Start, Top-Center, Top-End, Bottom-Start, Bottom-Center, and Bottom-End.

// Design:
// - 3x2 responsive button grid for choosing placement
// - Floating position calculated dynamically using fixed coordinates
// - Success status icon with clean typography and shadow elevation

// What it does:
// - Positions toast at selected viewport coordinates
// - Auto-dismisses after 3 seconds

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import PlacementToast from '@/TestComponent/Feedback/Toast/PlacementToast';
//
// const MyComponent = () => {
//     return <PlacementToast />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const positions = [
    { label: 'Top Start', posClass: 'top-6 left-6', value: 'top-start' },
    { label: 'Top Center', posClass: 'top-6 left-1/2 -translate-x-1/2', value: 'top-center' },
    { label: 'Top End', posClass: 'top-6 right-6', value: 'top-end' },
    { label: 'Bottom Start', posClass: 'bottom-6 left-6', value: 'bottom-start' },
    { label: 'Bottom Center', posClass: 'bottom-6 left-1/2 -translate-x-1/2', value: 'bottom-center' },
    { label: 'Bottom End', posClass: 'bottom-6 right-6', value: 'bottom-end' },
]

export function PlacementToast({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [activeToast, setActiveToast] = useState(null)

    const triggerToast = (item) => {
        setActiveToast(item)
        setTimeout(() => {
            setActiveToast(null)
        }, 3000)
    }

    return (
        <div
            className={cn('w-full max-w-xl', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {positions.map((item) => (
                    <button
                        key={item.value}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-[#2a85ff] hover:text-[#2a85ff] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-[#2a85ff] transition"
                        disabled={disabled || loading}
                        type="button"
                        onClick={() => triggerToast(item)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {activeToast && (
                <div
                    aria-live="polite"
                    className={cn(
                        'fixed z-50 flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 animate-in fade-in duration-200',
                        activeToast.posClass,
                    )}
                    role="status"
                >
                    <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <div className="flex-1 pr-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Message ({activeToast.label})
                        </div>
                        <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                            Toast positioned at {activeToast.value}.
                        </div>
                    </div>
                    <button
                        aria-label="Close toast"
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                        type="button"
                        onClick={() => setActiveToast(null)}
                    >
                        <HiX className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default PlacementToast
