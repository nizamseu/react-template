// DisabledTabs

// DisabledTabs · Tabs demo
// Description:
// Tabs navigation component demonstrating disabled tab options. Shows how certain tab items
// can be placed in an inactive, non-selectable state across line and pill variations.
//
// Design:
// - Disabled tab triggers show cursor-not-allowed, opacity-40, and no hover response
// - Demonstrates both standard line variant and pill variant
// - Accessible aria-disabled attributes
// - Dark mode support with dark:text-gray-500 and dark:border-gray-700
//
// What it does:
// - Prevents activation or focus on disabled tabs
// - Renders two variants (line and pill) with disabled second tab
//
// Props:
// - defaultValue: string (default: "tab1")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import DisabledTabs from '@/TestComponent/Navigation/Tabs/DisabledTabs';
//
// const MyComponent = () => {
//     return <DisabledTabs />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

export function DisabledTabs({
    className,
    defaultValue = 'tab1',
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [lineTab, setLineTab] = useState(defaultValue)
    const [pillTab, setPillTab] = useState(defaultValue)

    return (
        <div
            className={cn('flex w-full max-w-2xl flex-col gap-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* 1. Line variant with disabled Tab 2 */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Line Variant with Disabled Item
                </span>
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={cn(
                            '-mb-px px-5 py-2.5 text-sm font-medium transition focus:outline-none',
                            lineTab === 'tab1'
                                ? 'border-b-2 border-[#2a85ff] font-semibold text-[#2a85ff]'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                        )}
                        type="button"
                        onClick={() => setLineTab('tab1')}
                    >
                        Home
                    </button>
                    <button
                        disabled
                        aria-disabled="true"
                        className="-mb-px cursor-not-allowed px-5 py-2.5 text-sm font-medium text-gray-400 opacity-40 dark:text-gray-600"
                        type="button"
                    >
                        Profile (Disabled)
                    </button>
                    <button
                        className={cn(
                            '-mb-px px-5 py-2.5 text-sm font-medium transition focus:outline-none',
                            lineTab === 'tab3'
                                ? 'border-b-2 border-[#2a85ff] font-semibold text-[#2a85ff]'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                        )}
                        type="button"
                        onClick={() => setLineTab('tab3')}
                    >
                        Contact
                    </button>
                </div>
            </div>

            {/* 2. Pill variant with disabled Tab 2 */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Pill Variant with Disabled Item
                </span>
                <div className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                    <button
                        className={cn(
                            'rounded-md px-4 py-1.5 text-sm font-medium transition focus:outline-none',
                            pillTab === 'tab1'
                                ? 'bg-white font-semibold text-[#2a85ff] shadow-sm dark:bg-gray-700 dark:text-blue-400'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300',
                        )}
                        type="button"
                        onClick={() => setPillTab('tab1')}
                    >
                        Home
                    </button>
                    <button
                        disabled
                        aria-disabled="true"
                        className="cursor-not-allowed rounded-md px-4 py-1.5 text-sm font-medium text-gray-400 opacity-40 dark:text-gray-600"
                        type="button"
                    >
                        Profile (Disabled)
                    </button>
                    <button
                        className={cn(
                            'rounded-md px-4 py-1.5 text-sm font-medium transition focus:outline-none',
                            pillTab === 'tab3'
                                ? 'bg-white font-semibold text-[#2a85ff] shadow-sm dark:bg-gray-700 dark:text-blue-400'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300',
                        )}
                        type="button"
                        onClick={() => setPillTab('tab3')}
                    >
                        Contact
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DisabledTabs;
