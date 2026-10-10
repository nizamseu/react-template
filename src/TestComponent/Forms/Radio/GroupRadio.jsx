// GroupRadio

// GroupRadio · Radio demo

// Description:
// Demonstrates a horizontal Radio group allowing users to choose a single
// value from a list of options (Apple, Banana, Cherry).

// Design:
// - Horizontal inline row layout (flex items-center gap-6)
// - Brand blue #2a85ff active radio dot
// - Full dark mode support

// What it does:
// - Manages active selected radio string in state
// - Ensures mutual exclusivity among options
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - initialValue: string (default: "Banana")
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import GroupRadio from '@/TestComponent/Forms/Radio/GroupRadio';
//
// const MyComponent = () => {
//     return <GroupRadio />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const options = ['Apple', 'Banana', 'Cherry']

export function GroupRadio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialValue = 'Banana',
    className,
    ...props
}) {
    const [value, setValue] = useState(initialValue)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-wrap items-center gap-6', className)}
            {...props}
        >
            {options.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="radio"
                        name="radioGroupDemo"
                        value={opt}
                        checked={value === opt}
                        disabled={disabled || loading}
                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff] cursor-pointer"
                        onChange={() => setValue(opt)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {opt}
                    </span>
                </label>
            ))}
        </div>
    )
}

export default GroupRadio
