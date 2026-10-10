// SizesInput

// SizesInput · Input demo

// Description:
// Demonstrates three input sizes: Small (sm), Medium (md), and Large (lg).
// Each input size exhibits scaled padding, font sizes, and container heights.

// Design:
// - Stacked column layout with 16px vertical gap (space-y-4)
// - sm: py-1.5 px-2.5 text-xs, md: py-2 px-3.5 text-sm, lg: py-2.5 px-4 text-base
// - Brand blue #2a85ff focus outlines
// - Dark mode support with dark:bg-gray-800, dark:border-gray-600

// What it does:
// - Renders three distinct size variants of inputs together for demonstration
// - Displays differences in height and font proportion
// - Fully standalone without external dependencies

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizesInput from '@/TestComponent/Forms/Input/SizesInput';
//
// const MyComponent = () => {
//     return <SizesInput />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SizesInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4', className)}
            {...props}
        >
            <div>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Input sm"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
            <div>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Input md"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
            <div>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Input lg"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
        </div>
    )
}

export default SizesInput
