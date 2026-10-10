// SizeSegment

// SizeSegment · Segment demo

// Description:
// Demonstrates Segment buttons with size scaling across Extra Small (xs),
// Small (sm), Medium (md), and Large (lg).

// Design:
// - Interactive size switcher controlling segment element proportions
// - Dynamic padding and text size scaling
// - Full dark mode support

// What it does:
// - Toggles between xs, sm, md, and lg sizes
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizeSegment from '@/TestComponent/Forms/Segment/SizeSegment';
//
// const MyComponent = () => {
//     return <SizeSegment />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const sizes = [
    { value: 'xs', label: 'Extra Small', style: 'px-2.5 py-1 text-xs' },
    { value: 'sm', label: 'Small', style: 'px-3 py-1.5 text-xs' },
    { value: 'md', label: 'Medium', style: 'px-4 py-2 text-sm' },
    { value: 'lg', label: 'Large', style: 'px-5 py-2.5 text-base' },
]

export function SizeSegment({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [currentSize, setCurrentSize] = useState('md')

    const activeObj = sizes.find((s) => s.value === currentSize) || sizes[2]

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-4 max-w-md', className)}
            {...props}
        >
            <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {sizes.map((s) => {
                    const isSelected = currentSize === s.value
                    return (
                        <button
                            key={s.value}
                            type="button"
                            disabled={disabled || loading}
                            className={cn(
                                'font-semibold rounded-lg transition-all',
                                activeObj.style,
                                isSelected
                                    ? 'bg-white dark:bg-gray-700 text-[#2a85ff] shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900',
                            )}
                            onClick={() => setCurrentSize(s.value)}
                        >
                            {s.label}
                        </button>
                    )
                })}
            </div>
            <div className="text-xs text-gray-500">
                Active size: <strong className="text-[#2a85ff]">{currentSize}</strong>
            </div>
        </div>
    )
}

export default SizeSegment
