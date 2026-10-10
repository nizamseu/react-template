// ControlledSwitcher

// ControlledSwitcher · Switcher demo

// Description:
// Demonstrates a React controlled Switcher bound to external state with
// an external toggle trigger button and live state feedback display.

// Design:
// - Column layout with toggle switch, control button, and value indicator
// - Brand blue #2a85ff active state
// - Full dark mode support

// What it does:
// - Binds checked value directly to React useState
// - Allows toggling via both the switch itself and an external button
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ControlledSwitcher from '@/TestComponent/Forms/Switcher/ControlledSwitcher';
//
// const MyComponent = () => {
//     return <ControlledSwitcher />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function ControlledSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [checked, setChecked] = useState(false)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col gap-4 max-w-sm', className)}
            {...props}
        >
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={disabled || loading}
                    className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                        checked ? 'bg-[#2a85ff]' : 'bg-gray-300 dark:bg-gray-600',
                    )}
                    onClick={() => setChecked(!checked)}
                >
                    <span
                        className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                            checked ? 'translate-x-5' : 'translate-x-0',
                        )}
                    />
                </button>

                <button
                    type="button"
                    disabled={disabled || loading}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setChecked(!checked)}
                >
                    Toggle externally
                </button>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-700 dark:text-gray-200">State: </span>
                <span className={checked ? 'text-emerald-600 font-semibold' : 'text-gray-500'}>
                    {checked ? 'Checked (true)' : 'Unchecked (false)'}
                </span>
            </div>
        </div>
    )
}

export default ControlledSwitcher
