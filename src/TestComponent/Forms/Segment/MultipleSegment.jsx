// MultipleSegment

// MultipleSegment · Segment demo

// Description:
// Demonstrates a multi-select Segment component where users can select
// any combination of segments simultaneously (e.g. Left, Center, Right).

// Design:
// - Pill-shaped segmented control with multiple toggleable buttons
// - Active items highlighted with solid white background, shadow-sm, and check indicator
// - Full dark mode support

// What it does:
// - Manages multiple selected values array in state
// - Toggles inclusion of an item on click
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import MultipleSegment from '@/TestComponent/Forms/Segment/MultipleSegment';
//
// const MyComponent = () => {
//     return <MultipleSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const items = ['Left', 'Center', 'Right']

export function MultipleSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialValues = ['Left', 'Right'],
    className,
    ...props
}) {
    const [selected, setSelected] = useState(initialValues)

    const toggle = (item) => {
        setSelected((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
        )
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700', className)}
            {...props}
        >
            {items.map((item) => {
                const isChosen = selected.includes(item)
                return (
                    <button
                        key={item}
                        type="button"
                        disabled={disabled || loading}
                        className={cn(
                            'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                            isChosen
                                ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900',
                        )}
                        onClick={() => toggle(item)}
                    >
                        {item} {isChosen ? '✓' : ''}
                    </button>
                )
            })}
        </div>
    )
}

export default MultipleSegment
