// AsyncSelect

// AsyncSelect · Select demo

// Description:
// Demonstrates an asynchronous search-based Select component. Displays
// a loading spinner while fetching filtered results dynamically.

// Design:
// - Search input with embedded micro-spinner during query execution
// - Dropdown results panel rendering filtered options
// - Brand blue #2a85ff highlight
// - Full dark mode support

// What it does:
// - Debounces search input and simulates remote server query (500ms delay)
// - Displays filtered results in a custom menu
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AsyncSelect from '@/TestComponent/Forms/Select/AsyncSelect';
//
// const MyComponent = () => {
//     return <AsyncSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const dataset = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Strawberry']

export function AsyncSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [selected, setSelected] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const handleSearch = (val) => {
        setQuery(val)
        if (!val) {
            setResults([])
            setIsOpen(false)
            return
        }
        setSearching(true)
        setIsOpen(true)
        setTimeout(() => {
            const matches = dataset.filter((d) => d.toLowerCase().includes(val.toLowerCase()))
            setResults(matches)
            setSearching(false)
        }, 500)
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full relative', className)}
            {...props}
        >
            <div className="relative">
                <input
                    type="text"
                    value={selected ? selected : query}
                    disabled={disabled || loading}
                    placeholder="Type fruit name to search (e.g. 'ap', 'be')..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] pr-10"
                    onChange={(e) => {
                        setSelected('')
                        handleSearch(e.target.value)
                    }}
                    onFocus={() => query && setIsOpen(true)}
                />
                {searching && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="animate-spin h-4 w-4 text-[#2a85ff]" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                )}
            </div>

            {isOpen && query && !searching && (
                <div className="absolute top-full left-0 right-0 mt-1.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl z-20">
                    {results.length > 0 ? (
                        results.map((r) => (
                            <div
                                key={r}
                                className="px-3.5 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors"
                                onClick={() => {
                                    setSelected(r)
                                    setIsOpen(false)
                                }}
                            >
                                {r}
                            </div>
                        ))
                    ) : (
                        <div className="px-3.5 py-2 text-xs text-gray-400">No results found</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AsyncSelect
