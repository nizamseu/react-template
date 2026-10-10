// ControlledSegment

// ControlledSegment · Segment demo

// Description:
// Demonstrates both Single-selection and Multi-selection controlled Segment
// controls with real-time value output display.

// Design:
// - Column layout featuring single and multi-selection segments
// - Live value preview box below each group
// - Full dark mode support

// What it does:
// - Binds selection states to React state
// - Shows single segment toggle and multi-segment tag selection
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ControlledSegment from '@/TestComponent/Forms/Segment/ControlledSegment';
//
// const MyComponent = () => {
//     return <ControlledSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const items = ['Left', 'Center', 'Right']

export function ControlledSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [single, setSingle] = useState('Left')
    const [multiple, setMultiple] = useState(['Center'])

    const toggleMulti = (val) => {
        setMultiple((prev) =>
            prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val],
        )
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-6 max-w-md', className)}
            {...props}
        >
            {/* Single Selection */}
            <div className="space-y-2">
                <h6 className="text-xs font-semibold uppercase text-gray-500">Single Selection</h6>
                <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {items.map((item) => (
                        <button
                            key={item}
                            type="button"
                            disabled={disabled || loading}
                            className={cn(
                                'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
                                single === item
                                    ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900',
                            )}
                            onClick={() => setSingle(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-gray-500">Value: <strong className="text-[#2a85ff]">{single}</strong></div>
            </div>

            {/* Multiple Selection */}
            <div className="space-y-2">
                <h6 className="text-xs font-semibold uppercase text-gray-500">Multiple Selection</h6>
                <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {items.map((item) => {
                        const isChosen = multiple.includes(item)
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
                                onClick={() => toggleMulti(item)}
                            >
                                {item} {isChosen ? '✓' : ''}
                            </button>
                        )
                    })}
                </div>
                <div className="text-xs text-gray-500">Value: <strong className="text-[#2a85ff]">{multiple.join(', ')}</strong></div>
            </div>
        </div>
    )
}

export default ControlledSegment
