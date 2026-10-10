// PlacementTooltip

// PlacementTooltip · Tooltip demo
// Description:
// Tooltip component demonstrating multiple spatial placement anchors.
// Supports 12 cardinal positions: Top, Bottom, Left, and Right with start, center, and end alignments.
//
// Design:
// - Precision absolute positioning for all placement vectors
// - Dynamic triangular arrows aligned directly to trigger edges
// - High-contrast dark popover with subtle drop-shadows
//
// What it does:
// - Renders a responsive placement grid showcasing Top, Bottom, Left, and Right tooltip placements
// - Shows tooltip on hover/focus per placement button
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import PlacementTooltip from '@/TestComponent/DataDisplay/Tooltip/PlacementTooltip';
//
// const MyComponent = () => {
//     return <PlacementTooltip />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const placements = [
    { id: 'top-start', label: 'Top Start', posClass: 'bottom-full left-0 mb-2', arrowClass: '-bottom-1 left-4 border-t-gray-900' },
    { id: 'top', label: 'Top', posClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2', arrowClass: '-bottom-1 left-1/2 -translate-x-1/2 border-t-gray-900' },
    { id: 'top-end', label: 'Top End', posClass: 'bottom-full right-0 mb-2', arrowClass: '-bottom-1 right-4 border-t-gray-900' },
    { id: 'bottom-start', label: 'Bottom Start', posClass: 'top-full left-0 mt-2', arrowClass: '-top-1 left-4 border-b-gray-900' },
    { id: 'bottom', label: 'Bottom', posClass: 'top-full left-1/2 -translate-x-1/2 mt-2', arrowClass: '-top-1 left-1/2 -translate-x-1/2 border-b-gray-900' },
    { id: 'bottom-end', label: 'Bottom End', posClass: 'top-full right-0 mt-2', arrowClass: '-top-1 right-4 border-b-gray-900' },
    { id: 'left', label: 'Left', posClass: 'right-full top-1/2 -translate-y-1/2 mr-2', arrowClass: '-right-1 top-1/2 -translate-y-1/2 border-l-gray-900' },
    { id: 'right', label: 'Right', posClass: 'left-full top-1/2 -translate-y-1/2 ml-2', arrowClass: '-left-1 top-1/2 -translate-y-1/2 border-r-gray-900' },
]

export function PlacementTooltip({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [hoveredId, setHoveredId] = useState(null)

    return (
        <div
            className={cn('w-full max-w-xl py-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {placements.map((p) => {
                    const isHovered = hoveredId === p.id
                    return (
                        <div
                            key={p.id}
                            className="relative text-center"
                            onMouseEnter={() => setHoveredId(p.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <button
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                type="button"
                            >
                                {p.label}
                            </button>

                            {isHovered && (
                                <div
                                    className={cn(
                                        'absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl',
                                        p.posClass,
                                    )}
                                >
                                    <span>{p.label} tooltip</span>
                                    <span
                                        className={cn(
                                            'absolute border-4 border-transparent',
                                            p.arrowClass,
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PlacementTooltip;
