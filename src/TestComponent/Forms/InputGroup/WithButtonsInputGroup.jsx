// WithButtonsInputGroup

// WithButtonsInputGroup · InputGroup demo

// Description:
// Demonstrates Input groups combined directly with actionable buttons,
// including text buttons ("Search"), icon buttons (HiOutlineSearch),
// and prepended action buttons (HiOutlineMicrophone).

// Design:
// - Stacked column layout with 16px vertical gap (space-y-4)
// - Seamless inline combination of input fields with attached buttons
// - Brand blue #2a85ff primary action button
// - Full dark mode support

// What it does:
// - Chains search inputs directly to action trigger buttons
// - Supports text and icon variations
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import WithButtonsInputGroup from '@/TestComponent/Forms/InputGroup/WithButtonsInputGroup';
//
// const MyComponent = () => {
//     return <WithButtonsInputGroup />
// }
// ```

'use client'

import { HiOutlineSearch, HiOutlineMicrophone } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function WithButtonsInputGroup({
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
            {/* Input with Text Button */}
            <div className="flex rounded-lg shadow-sm">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Input text to search"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    className="inline-flex items-center px-4 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                    Search
                </button>
            </div>

            {/* Input with Search Icon Button */}
            <div className="flex rounded-lg shadow-sm">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Input text to search"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <button
                    type="button"
                    disabled={disabled || loading}
                    aria-label="Search"
                    className="inline-flex items-center px-3.5 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                    <HiOutlineSearch className="text-lg" />
                </button>
            </div>

            {/* Prepended Microphone Solid Button with Input */}
            <div className="flex rounded-lg shadow-sm">
                <button
                    type="button"
                    disabled={disabled || loading}
                    aria-label="Microphone input"
                    className="inline-flex items-center px-3.5 py-2 rounded-none rounded-l-lg border border-r-0 border-[#2a85ff] bg-[#2a85ff] text-white hover:bg-[#2075e8] transition-colors"
                >
                    <HiOutlineMicrophone className="text-lg" />
                </button>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Speak or type search"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
        </div>
    )
}

export default WithButtonsInputGroup
