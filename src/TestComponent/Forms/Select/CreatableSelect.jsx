// CreatableSelect

// CreatableSelect · Select demo

// Description:
// Demonstrates a Creatable Select allowing users to pick existing options
// or type and create brand new custom options on the fly.

// Design:
// - Input field with inline tag chips and "+ Create option" prompt
// - Brand blue #2a85ff highlight
// - Full dark mode support

// What it does:
// - Lets users select from existing items or hit Enter to add new custom items
// - Manages dynamically expanded option lists
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CreatableSelect from '@/TestComponent/Forms/Select/CreatableSelect';
//
// const MyComponent = () => {
//     return <CreatableSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CreatableSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [options, setOptions] = useState(['Design', 'Development', 'Marketing'])
    const [selected, setSelected] = useState(['Design'])
    const [inputVal, setInputVal] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputVal.trim()) {
            e.preventDefault()
            const newItem = inputVal.trim()
            if (!options.includes(newItem)) {
                setOptions((prev) => [...prev, newItem])
            }
            if (!selected.includes(newItem)) {
                setSelected((prev) => [...prev, newItem])
            }
            setInputVal('')
        }
    }

    const remove = (item) => {
        setSelected((prev) => prev.filter((i) => i !== item))
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-3', className)}
            {...props}
        >
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-[#2a85ff] focus-within:ring-1 focus-within:ring-[#2a85ff]">
                {selected.map((item) => (
                    <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#2a85ff] dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800"
                    >
                        {item}
                        <button type="button" className="hover:text-red-500" onClick={() => remove(item)}>
                            <HiX className="text-xs" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputVal}
                    disabled={disabled || loading}
                    placeholder={selected.length === 0 ? "Type and press Enter to create..." : "Type more..."}
                    className="flex-1 min-w-[140px] border-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">Enter</kbd> to create a new tag.
            </p>
        </div>
    )
}

export default CreatableSelect
