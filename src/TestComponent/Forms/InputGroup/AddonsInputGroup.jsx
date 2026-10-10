// AddonsInputGroup

// AddonsInputGroup · InputGroup demo

// Description:
// Demonstrates chained Input elements with static text addons prepended,
// appended, or placed in-between two inputs (@, .example.com, http://, to).

// Design:
// - Stacked column layout with 16px vertical gap (space-y-4)
// - Addons styled with bg-gray-100 dark:bg-gray-700/60, border-gray-300 dark:border-gray-600
// - Seamless joint borders without double border lines (first:rounded-l-lg, last:rounded-r-lg)
// - Brand blue #2a85ff focus outlines

// What it does:
// - Chains static labels and inputs into unified composite groups
// - Supports multiple addon combinations
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AddonsInputGroup from '@/TestComponent/Forms/InputGroup/AddonsInputGroup';
//
// const MyComponent = () => {
//     return <AddonsInputGroup />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function AddonsInputGroup({
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
            {/* Prepend Addon */}
            <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    @
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="username"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>

            {/* Append Addon */}
            <div className="flex rounded-lg shadow-sm">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="subdomain"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    .example.com
                </span>
            </div>

            {/* Both Prepend & Append Addons */}
            <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    https://
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="yoursite"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    .com
                </span>
            </div>

            {/* Between Inputs Addon */}
            <div className="flex rounded-lg shadow-sm">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Min"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <span className="inline-flex items-center px-3 border-y border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    to
                </span>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Max"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
        </div>
    )
}

export default AddonsInputGroup
