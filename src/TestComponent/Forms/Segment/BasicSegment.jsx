// BasicSegment

// BasicSegment · Segment demo

// Description:
// Demonstrates a segmented control button group (Left, Center, Right)
// allowing quick switching between mutually exclusive modes.

// Design:
// - Pill-shaped background container with rounded-lg border
// - Active segment has solid white background (dark:bg-gray-700), shadow-sm, and brand blue #2a85ff text
// - Smooth transitions between segments
// - Full dark mode support

// What it does:
// - Manages single active segment value in state
// - Toggles active segment upon clicking
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultValue: string (default: "left")
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicSegment from '@/TestComponent/Forms/Segment/BasicSegment';
//
// const MyComponent = () => {
//     return <BasicSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const items = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
]

export function BasicSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = 'left',
    className,
    ...props
}) {
    const [active, setActive] = useState(defaultValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700', className)}
            {...props}
        >
            {items.map((item) => {
                const isSelected = active === item.value
                return (
                    <button
                        key={item.value}
                        type="button"
                        disabled={disabled || loading}
                        className={cn(
                            'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                            isSelected
                                ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
                        )}
                        onClick={() => setActive(item.value)}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}

export default BasicSegment
