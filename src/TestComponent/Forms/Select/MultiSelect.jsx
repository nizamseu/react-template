// MultiSelect

// MultiSelect · Select demo

// Description:
// Demonstrates a multi-selection Select component with tag/badge chips,
// individual chip removal buttons, and quick option addition.

// Design:
// - Interactive pill badges with cross remove icons
// - Dropdown menu or clickable tag chips
// - Brand blue #2a85ff active highlights
// - Full dark mode support

// What it does:
// - Manages multiple selected tags in state
// - Allows removing items by clicking their close badge
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - initialSelected: string[] (default: ['Ocean', 'Blue'])
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import MultiSelect from '@/TestComponent/Forms/Select/MultiSelect';
//
// const MyComponent = () => {
//     return <MultiSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const availableOptions = ['Ocean', 'Blue', 'Purple', 'Red', 'Orange', 'Yellow', 'Green']

export function MultiSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    initialSelected = ['Ocean', 'Blue'],
    className,
    ...props
}) {
    const [selected, setSelected] = useState(initialSelected)

    const removeTag = (tag) => {
        setSelected((prev) => prev.filter((t) => t !== tag))
    }

    const addTag = (tag) => {
        if (!selected.includes(tag)) {
            setSelected((prev) => [...prev, tag])
        }
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-3', className)}
            {...props}
        >
            {/* Selected Badges Area */}
            <div className="min-h-[42px] p-2 flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                {selected.length === 0 ? (
                    <span className="text-xs text-gray-400 pl-1.5">No options selected...</span>
                ) : (
                    selected.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#2a85ff] dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800"
                        >
                            {tag}
                            <button
                                type="button"
                                disabled={disabled || loading}
                                className="hover:text-red-500 focus:outline-none"
                                onClick={() => removeTag(tag)}
                            >
                                <HiX className="text-xs" />
                            </button>
                        </span>
                    ))
                )}
            </div>

            {/* Available Options Picker */}
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Add:</span>
                {availableOptions
                    .filter((opt) => !selected.includes(opt))
                    .map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            disabled={disabled || loading}
                            className="px-2.5 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors"
                            onClick={() => addTag(opt)}
                        >
                            + {opt}
                        </button>
                    ))}
            </div>
        </div>
    )
}

export default MultiSelect
