// DisabledSegment

// DisabledSegment · Segment demo

// Description:
// Demonstrates a Segment control with a disabled middle option ("Center"),
// preventing user selection while allowing other options to function.

// Design:
// - Pill-shaped segmented control with active, idle, and disabled options
// - Disabled option styled with opacity-40 and cursor-not-allowed
// - Full dark mode support

// What it does:
// - Disables specific segments while other segments remain clickable
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledSegment from '@/TestComponent/Forms/Segment/DisabledSegment';
//
// const MyComponent = () => {
//     return <DisabledSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function DisabledSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState('left')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700', className)}
            {...props}
        >
            <button
                type="button"
                className={cn(
                    'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    active === 'left'
                        ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                        : 'text-gray-600 dark:text-gray-400',
                )}
                onClick={() => setActive('left')}
            >
                Left
            </button>

            <button
                disabled
                type="button"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed"
            >
                Center (Disabled)
            </button>

            <button
                type="button"
                className={cn(
                    'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    active === 'right'
                        ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                        : 'text-gray-600 dark:text-gray-400',
                )}
                onClick={() => setActive('right')}
            >
                Right
            </button>
        </div>
    )
}

export default DisabledSegment
