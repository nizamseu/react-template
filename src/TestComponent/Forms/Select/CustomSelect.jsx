// CustomSelect

// CustomSelect · Select demo

// Description:
// Demonstrates a custom-rendered dropdown Select with flag/avatar indicators
// and styled dropdown menu items (United States, China, Japan, France).

// Design:
// - Custom interactive dropdown with country flags and country names
// - Smooth popover menu with shadow-lg and rounded-xl borders
// - Brand blue #2a85ff highlight on hovered / active item
// - Full dark mode support

// What it does:
// - Manages open/close state of custom dropdown list
// - Selects country and updates trigger display
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomSelect from '@/TestComponent/Forms/Select/CustomSelect';
//
// const MyComponent = () => {
//     return <CustomSelect />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const countries = [
    { code: 'us', label: 'United States', flag: '🇺🇸' },
    { code: 'cn', label: 'China', flag: '🇨🇳' },
    { code: 'jp', label: 'Japan', flag: '🇯🇵' },
    { code: 'fr', label: 'France', flag: '🇫🇷' },
    { code: 'de', label: 'Germany', flag: '🇩🇪' },
]

export function CustomSelect({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [selected, setSelected] = useState(countries[0])
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full relative', className)}
            {...props}
        >
            {/* Custom Trigger */}
            <button
                type="button"
                disabled={disabled || loading}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] disabled:bg-gray-100 cursor-pointer"
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">{selected.flag}</span>
                    <span className="font-medium">{selected.label}</span>
                </div>
                <svg className="h-4 w-4 text-gray-400 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </button>

            {/* Custom Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl z-20 overflow-hidden">
                    {countries.map((c) => {
                        const isChosen = selected.code === c.code
                        return (
                            <div
                                key={c.code}
                                className={cn(
                                    'flex items-center gap-2.5 px-3.5 py-2 text-sm cursor-pointer transition-colors',
                                    isChosen
                                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2a85ff] font-medium'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200',
                                )}
                                onClick={() => {
                                    setSelected(c)
                                    setIsOpen(false)
                                }}
                            >
                                <span className="text-lg">{c.flag}</span>
                                <span>{c.label}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default CustomSelect
