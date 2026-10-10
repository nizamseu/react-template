// BasicSwitcher

// BasicSwitcher · Switcher demo

// Description:
// Demonstrates the basic toggle Switcher component with smooth animation,
// brand blue #2a85ff active state, and accessible switch role semantics.

// Design:
// - Pill-shaped toggle track (h-6 w-11) with circular sliding thumb (h-5 w-5)
// - Brand blue #2a85ff background when active, gray-300 dark:bg-gray-600 when inactive
// - Smooth sliding translation animation with duration-200
// - Full dark mode support

// What it does:
// - Toggles checked boolean state on click
// - Supports role="switch" and aria-checked accessibility attributes
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultChecked: boolean (default: true)
// - className: merged onto root <div> with cn()
// - ...props: spread onto button element

// Usage example:
// ```jsx
// import BasicSwitcher from '@/TestComponent/Forms/Switcher/BasicSwitcher';
//
// const MyComponent = () => {
//     return <BasicSwitcher defaultChecked={true} />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function BasicSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultChecked = true,
    className,
    ...props
}) {
    const [checked, setChecked] = useState(defaultChecked)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex items-center', className)}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled || loading}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2a85ff] focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                    checked ? 'bg-[#2a85ff]' : 'bg-gray-300 dark:bg-gray-600',
                    (disabled || loading) && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => setChecked(!checked)}
                {...props}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        checked ? 'translate-x-5' : 'translate-x-0',
                    )}
                />
            </button>
        </div>
    )
}

export default BasicSwitcher
