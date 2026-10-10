// DisabledInput

// DisabledInput · Input demo

// Description:
// Demonstrates a disabled text input field with muted background,
// grayed out borders, not-allowed cursor, and prevented user interaction.

// Design:
// - Light mode: bg-gray-100, border-gray-300, text-gray-500
// - Dark mode: dark:bg-gray-700/50, dark:border-gray-600, dark:text-gray-400
// - Cursor not-allowed on hover
// - Rounded-lg corners with standard md size padding

// What it does:
// - Renders an input element with the disabled attribute
// - Prevents focus, selection, and keyboard input
// - Fully standalone component

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - placeholder: string (default: "Disabled Input")
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import DisabledInput from '@/TestComponent/Forms/Input/DisabledInput';
//
// const MyComponent = () => {
//     return <DisabledInput />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledInput({
    variant = 'primary',
    size = 'md',
    disabled = true,
    loading = false,
    placeholder = 'Disabled Input',
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full', className)}
        >
            <input
                type="text"
                disabled={disabled}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 px-3.5 py-2 text-sm text-gray-400 dark:text-gray-500 placeholder-gray-400 dark:placeholder-gray-500 cursor-not-allowed select-none focus:outline-none"
                {...props}
            />
        </div>
    )
}

export default DisabledInput
