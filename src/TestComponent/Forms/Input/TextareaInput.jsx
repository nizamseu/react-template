// TextareaInput

// TextareaInput · Input demo

// Description:
// Demonstrates a multiline textarea input with custom rows, placeholder,
// responsive resizing, and smooth focus states.

// Design:
// - Multiline textarea with 4 default rows
// - Rounded-lg borders with smooth hover and focus transitions
// - Brand blue #2a85ff focus outlines
// - Dark mode support with dark:bg-gray-800, dark:border-gray-600

// What it does:
// - Renders a standard HTML textarea component
// - Supports controlled or uncontrolled text entry
// - Self-contained single component

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - rows: number (default: 4)
// - placeholder: string (default: "Text area example")
// - className: merged onto root <div> with cn()
// - ...props: spread onto textarea element

// Usage example:
// ```jsx
// import TextareaInput from '@/TestComponent/Forms/Input/TextareaInput';
//
// const MyComponent = () => {
//     return <TextareaInput rows={5} placeholder="Write your message..." />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function TextareaInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    rows = 4,
    placeholder = 'Text area example',
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
            <textarea
                rows={rows}
                disabled={disabled || loading}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                {...props}
            />
        </div>
    )
}

export default TextareaInput
