// PasswordInput

// PasswordInput · Input demo

// Description:
// Demonstrates a password input field equipped with an eye toggle icon button
// to alternate between obscured password dots and visible plaintext.

// Design:
// - Standard rounded-lg input with right trailing icon padding (pr-10)
// - Eye icon (HiOutlineEye / HiOutlineEyeOff) in muted gray with hover effect
// - Brand blue #2a85ff focus outlines
// - Dark mode support with dark:bg-gray-800, dark:border-gray-600

// What it does:
// - Manages local visible state toggling input type between 'password' and 'text'
// - Accessible icon toggle button with aria-label
// - Completely standalone single component

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - defaultValue: string (default: "secretPassword123")
// - className: merged onto root <div> with cn()
// - ...props: spread onto input element

// Usage example:
// ```jsx
// import PasswordInput from '@/TestComponent/Forms/Input/PasswordInput';
//
// const MyComponent = () => {
//     return <PasswordInput />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PasswordInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    defaultValue = 'secretPassword123',
    className,
    ...props
}) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full', className)}
        >
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    disabled={disabled || loading}
                    defaultValue={defaultValue}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3.5 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    {...props}
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? (
                        <HiOutlineEye className="text-lg" />
                    ) : (
                        <HiOutlineEyeOff className="text-lg" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default PasswordInput
