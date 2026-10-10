// DisabledRadio

// DisabledRadio · Radio demo

// Description:
// Demonstrates disabled Radio options in both unchecked and checked states,
// along with a disabled radio group to verify inactive appearance.

// Design:
// - Stacked layout with standalone disabled radios and disabled group
// - Muted borders, inactive background, cursor-not-allowed
// - Full dark mode support

// What it does:
// - Renders unclickable disabled radio buttons
// - Prevents any interaction or selection changes
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledRadio from '@/TestComponent/Forms/Radio/DisabledRadio';
//
// const MyComponent = () => {
//     return <DisabledRadio />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledRadio({
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
            className={cn('space-y-4 max-w-md', className)}
            {...props}
        >
            <div className="flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-not-allowed select-none opacity-60">
                    <input
                        disabled
                        type="radio"
                        name="disabledDemo"
                        className="h-4 w-4 border-gray-300 dark:border-gray-600 bg-gray-100 cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        Disabled Radio
                    </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-not-allowed select-none opacity-60">
                    <input
                        defaultChecked
                        disabled
                        type="radio"
                        name="disabledDemo"
                        className="h-4 w-4 border-gray-300 dark:border-gray-600 accent-gray-400 cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        Disabled Checked Radio
                    </span>
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                {['Apple', 'Banana', 'Cherry'].map((opt, i) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-not-allowed select-none opacity-60">
                        <input
                            disabled
                            type="radio"
                            defaultChecked={i === 0}
                            name="disabledGroupDemo"
                            className="h-4 w-4 border-gray-300 dark:border-gray-600 accent-gray-400 cursor-not-allowed"
                        />
                        <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                            {opt}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default DisabledRadio
