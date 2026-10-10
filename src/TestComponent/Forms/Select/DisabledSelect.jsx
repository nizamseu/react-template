// DisabledSelect

// DisabledSelect · Select demo

// Description:
// Demonstrates disabled Select controls, both with specific disabled options
// and with the entire dropdown component disabled.

// Design:
// - Stacked column layout with 16px vertical gap
// - Inactive gray background and muted text
// - cursor-not-allowed indicator
// - Full dark mode support

// What it does:
// - Disables individual options or the entire select dropdown
// - Prevents selection changes
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default for component demo
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledSelect from '@/TestComponent/Forms/Select/DisabledSelect';
//
// const MyComponent = () => {
//     return <DisabledSelect />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledSelect({
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
            {/* Certain options disabled */}
            <div className="relative">
                <select
                    defaultValue="purple"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff] appearance-none pr-10 cursor-pointer"
                >
                    <option disabled value="ocean">Ocean (Disabled)</option>
                    <option disabled value="blue">Blue (Disabled)</option>
                    <option value="purple">Purple (Available)</option>
                    <option disabled value="red">Red (Disabled)</option>
                    <option value="orange">Orange (Available)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>

            {/* Completely disabled select */}
            <div className="relative">
                <select
                    disabled
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 px-3.5 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed appearance-none pr-10"
                >
                    <option value="">Disabled Select</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default DisabledSelect
