// DisabledTimeInput

// DisabledTimeInput · TimeInput demo

// Description:
// Demonstrates a disabled TimeInput component with inactive styling and
// unclickable interaction.

// Design:
// - Grayed-out background (bg-gray-100 dark:bg-gray-700/50)
// - cursor-not-allowed
// - Full dark mode support

// What it does:
// - Renders an inactive time input field
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import DisabledTimeInput from '@/TestComponent/Forms/TimeInput/DisabledTimeInput';
//
// const MyComponent = () => {
//     return <DisabledTimeInput />
// }
// ```

'use client'

import { HiOutlineClock } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DisabledTimeInput({
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
            className={cn('max-w-xs w-full relative', className)}
        >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <HiOutlineClock className="text-lg" />
            </div>
            <input
                type="time"
                disabled={disabled}
                defaultValue="10:00"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 pl-10 pr-3.5 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                {...props}
            />
        </div>
    )
}

export default DisabledTimeInput
