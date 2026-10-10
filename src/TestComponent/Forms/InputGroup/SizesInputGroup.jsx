// SizesInputGroup

// SizesInputGroup · InputGroup demo

// Description:
// Demonstrates chained InputGroup composites across multiple sizes:
// Small (sm), Medium (md), and Large (lg).

// Design:
// - Stacked column layout with 16px vertical gap
// - sm: text-xs, py-1.5, px-2.5
// - md: text-sm, py-2, px-3.5
// - lg: text-base, py-2.5, px-4
// - Brand blue #2a85ff primary action button
// - Full dark mode support

// What it does:
// - Chains addons, inputs, and action buttons scaled proportionately
// - Demonstrates dimensional scaling across all joined elements
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import SizesInputGroup from '@/TestComponent/Forms/InputGroup/SizesInputGroup';
//
// const MyComponent = () => {
//     return <SizesInputGroup />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SizesInputGroup({
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
            className={cn('max-w-lg w-full space-y-4', className)}
            {...props}
        >
            {/* Small InputGroup */}
            <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-2.5 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs">
                    @
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Small Input"
                    className="flex-1 min-w-0 block w-full px-2.5 py-1.5 rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    className="inline-flex items-center px-3 py-1.5 rounded-none rounded-r-md bg-[#2a85ff] hover:bg-[#2075e8] text-white text-xs font-medium transition-colors"
                >
                    Submit
                </button>
            </div>

            {/* Medium InputGroup */}
            <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm">
                    @
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Medium Input"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    className="inline-flex items-center px-4 py-2 rounded-none rounded-r-lg bg-[#2a85ff] hover:bg-[#2075e8] text-white text-sm font-medium transition-colors"
                >
                    Submit
                </button>
            </div>

            {/* Large InputGroup */}
            <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 text-base">
                    @
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Large Input"
                    className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    className="inline-flex items-center px-5 py-2.5 rounded-none rounded-r-lg bg-[#2a85ff] hover:bg-[#2075e8] text-white text-base font-medium transition-colors"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default SizesInputGroup
