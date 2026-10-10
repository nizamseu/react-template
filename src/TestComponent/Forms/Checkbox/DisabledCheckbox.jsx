// DisabledCheckbox

// DisabledCheckbox · Checkbox demo

// Description:
// Demonstrates disabled checkboxes in both unchecked and checked states,
// verifying inactive styles, unclickable cursor, and muted colors.

// Design:
// - Stacked or inline row of disabled checkboxes
// - Grayed-out border (border-gray-200 dark:border-gray-700), muted label text
// - cursor-not-allowed indicator
// - Full dark mode support

// What it does:
// - Renders disabled standalone and group checkboxes
// - Prevents any interaction or state change
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledCheckbox from '@/TestComponent/Forms/Checkbox/DisabledCheckbox';
//
// const MyComponent = () => {
//     return <DisabledCheckbox />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledCheckbox({
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
            className={cn('flex flex-wrap items-center gap-6', className)}
            {...props}
        >
            <label className="inline-flex items-center gap-2 cursor-not-allowed select-none opacity-60">
                <input
                    disabled
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                    Disabled
                </span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-not-allowed select-none opacity-60">
                <input
                    defaultChecked
                    disabled
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-gray-400 cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                    Checked Disabled
                </span>
            </label>
        </div>
    )
}

export default DisabledCheckbox
