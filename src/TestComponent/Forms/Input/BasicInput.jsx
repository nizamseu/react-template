// BasicInput

// BasicInput · Input demo

// Description:
// The most basic usage of a text Input field. Renders a single clean input
// with placeholder text, subtle border, smooth hover/focus transitions,
// and dark mode compatibility.

// Design:
// - Single input field with rounded-lg border (w-full max-w-md)
// - Brand blue #2a85ff focus border and focus ring
// - Clean typography with text-sm, text-gray-900, dark:text-gray-100
// - Dark mode support with dark:bg-gray-800, dark:border-gray-600

// What it does:
// - Renders a standard uncontrolled or controlled text input
// - Supports value, placeholder, and standard input HTML attributes
// - Spreads additional props directly onto the input element

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - placeholder: string (default: "Basic usage")
// - className: merged onto root <div> with cn()
// - ...props: spread onto the input element

// Usage example:
// ```jsx
// import BasicInput from '@/TestComponent/Forms/Input/BasicInput';
//
// const MyComponent = () => {
//     return <BasicInput placeholder="Enter your name" />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function BasicInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    placeholder = 'Basic usage',
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
                disabled={disabled || loading}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                {...props}
            />
        </div>
    )
}

export default BasicInput
