// DisabledSwitcher

// DisabledSwitcher · Switcher demo

// Description:
// Demonstrates disabled Switcher buttons in both off and on states,
// verifying inactive appearance, disabled click handlers, and muted styles.

// Design:
// - Row layout with disabled unchecked and disabled checked switchers
// - Opacity-50, cursor-not-allowed
// - Full dark mode support

// What it does:
// - Renders unclickable disabled switches
// - Prevents state change
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledSwitcher from '@/TestComponent/Forms/Switcher/DisabledSwitcher';
//
// const MyComponent = () => {
//     return <DisabledSwitcher />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = true,
    loading = false,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex items-center gap-6', className)}
            {...props}
        >
            {/* Disabled Off */}
            <button
                disabled
                type="button"
                role="switch"
                aria-checked={false}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-gray-300 dark:bg-gray-600 opacity-50"
            >
                <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md translate-x-0" />
            </button>

            {/* Disabled On */}
            <button
                disabled
                type="button"
                role="switch"
                aria-checked={true}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-[#2a85ff] opacity-50"
            >
                <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md translate-x-5" />
            </button>
        </div>
    )
}

export default DisabledSwitcher
