// ColorsSwitcher

// ColorsSwitcher · Switcher demo

// Description:
// Demonstrates Switcher components in distinct active track colors,
// such as Green, Red, Purple, and Amber, displaying custom theme support.

// Design:
// - Stacked or row layout of colorful toggle switches
// - bg-emerald-500, bg-rose-500, bg-purple-600, bg-amber-500 active colors
// - Smooth transition animation
// - Full dark mode support

// What it does:
// - Renders multi-color toggle switches with independent states
// - Demonstrates custom theme color flexibility
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ColorsSwitcher from '@/TestComponent/Forms/Switcher/ColorsSwitcher';
//
// const MyComponent = () => {
//     return <ColorsSwitcher />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const colorPresets = [
    { name: 'Emerald', activeClass: 'bg-emerald-500' },
    { name: 'Rose', activeClass: 'bg-rose-500' },
    { name: 'Purple', activeClass: 'bg-purple-600' },
    { name: 'Amber', activeClass: 'bg-amber-500' },
]

export function ColorsSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [states, setStates] = useState({
        Emerald: true,
        Rose: true,
        Purple: true,
        Amber: true,
    })

    const toggle = (name) => {
        setStates((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-wrap items-center gap-6', className)}
            {...props}
        >
            {colorPresets.map((preset) => {
                const isActive = states[preset.name]
                return (
                    <div key={preset.name} className="flex items-center gap-2">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            disabled={disabled || loading}
                            className={cn(
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                isActive ? preset.activeClass : 'bg-gray-300 dark:bg-gray-600',
                            )}
                            onClick={() => toggle(preset.name)}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                                    isActive ? 'translate-x-5' : 'translate-x-0',
                                )}
                            />
                        </button>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {preset.name}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default ColorsSwitcher
