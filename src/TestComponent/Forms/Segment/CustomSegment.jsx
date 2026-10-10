// CustomSegment

// CustomSegment · Segment demo

// Description:
// Demonstrates rich plan selection cards (Personal, Team, Business) using
// custom segmented card options with badge icons and plan descriptions.

// Design:
// - Responsive grid of 3 rich plan cards
// - Brand blue #2a85ff 2px active border and background tint
// - Top-right checkmark indicator (HiCheckCircle)
// - Full dark mode support

// What it does:
// - Manages plan card selection
// - Supports disabled card states (e.g. Business plan disabled)
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomSegment from '@/TestComponent/Forms/Segment/CustomSegment';
//
// const MyComponent = () => {
//     return <CustomSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const plans = [
    { value: 'Personal', desc: 'The plan for personal projects.', disabled: false },
    { value: 'Team', desc: 'The plan for collaborative teams.', disabled: false },
    { value: 'Business', desc: 'Talk to us for custom enterprise tier.', disabled: true },
]

export function CustomSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState('Team')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full', className)}
            {...props}
        >
            {plans.map((p) => {
                const isSelected = selected === p.value
                const isItemDisabled = p.disabled || disabled || loading
                return (
                    <div
                        key={p.value}
                        className={cn(
                            'relative p-4 rounded-xl border-2 transition-all select-none',
                            isItemDisabled
                                ? 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 opacity-50 cursor-not-allowed'
                                : 'cursor-pointer',
                            isSelected && !isItemDisabled
                                ? 'border-[#2a85ff] bg-blue-50/30 dark:bg-blue-950/20 shadow-sm'
                                : !isItemDisabled && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
                        )}
                        onClick={() => !isItemDisabled && setSelected(p.value)}
                    >
                        {isSelected && (
                            <HiCheckCircle className="absolute top-3 right-3 text-xl text-[#2a85ff]" />
                        )}
                        <h6 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                            {p.value}
                        </h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {p.desc}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default CustomSegment
