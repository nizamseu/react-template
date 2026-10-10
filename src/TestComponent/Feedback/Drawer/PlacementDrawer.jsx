// PlacementDrawer

// PlacementDrawer · Drawer demo

// Description:
// Demonstrates Drawer edge placement options: Top, Right, Bottom, and Left.
// Users can select an edge placement using radio buttons and slide open the panel.

// Design:
// - Radio controls for edge selection
// - Dynamic sliding position (top, right, bottom, left)
// - Brand blue #2a85ff accents
// - Full dark mode support

// What it does:
// - Manages placement state ('top' | 'right' | 'bottom' | 'left')
// - Anchors slideover panel to selected screen edge
// - Responsive overflow and backdrop handling

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import PlacementDrawer from '@/TestComponent/Feedback/Drawer/PlacementDrawer';
//
// const MyComponent = () => {
//     return <PlacementDrawer />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const placements = [
    { label: 'Top', value: 'top' },
    { label: 'Right', value: 'right' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
]

export function PlacementDrawer({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [placement, setPlacement] = useState('right')

    const getPlacementClasses = () => {
        switch (placement) {
            case 'top':
                return {
                    container: 'items-start justify-center',
                    panel: 'h-72 w-full border-b',
                }
            case 'bottom':
                return {
                    container: 'items-end justify-center',
                    panel: 'h-72 w-full border-t',
                }
            case 'left':
                return {
                    container: 'justify-start',
                    panel: 'h-full w-full max-w-md border-r',
                }
            case 'right':
            default:
                return {
                    container: 'justify-end',
                    panel: 'h-full w-full max-w-md border-l',
                }
        }
    }

    const { container, panel } = getPlacementClasses()

    return (
        <div
            className={cn('flex flex-wrap items-center gap-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex items-center gap-3">
                {placements.map((item) => (
                    <label
                        key={item.value}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                        <input
                            checked={placement === item.value}
                            className="h-4 w-4 text-[#2a85ff] accent-[#2a85ff]"
                            name="drawerPlacement"
                            type="radio"
                            value={item.value}
                            onChange={() => setPlacement(item.value)}
                        />
                        <span>{item.label}</span>
                    </label>
                ))}
            </div>

            <button
                className="rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                disabled={disabled || loading}
                type="button"
                onClick={() => setIsOpen(true)}
            >
                Open Drawer ({placement})
            </button>

            {isOpen && (
                <div
                    aria-modal="true"
                    className={cn(
                        'fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm transition-opacity',
                        container,
                    )}
                    role="dialog"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={cn(
                            'relative flex flex-col border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800',
                            panel,
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
                            <h5 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Drawer Title ({placement.toUpperCase()})
                            </h5>
                            <button
                                aria-label="Close drawer"
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Drawer Content placed on {placement} edge.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlacementDrawer
