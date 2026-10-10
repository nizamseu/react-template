// ControlledTabs

// ControlledTabs · Tabs demo
// Description:
// Fully controlled navigation tabs driven by external component state.
// Demonstrates external programmatic tab transitions coupled with standard interactive tab triggers.
//
// Design:
// - External action toolbar with quick-switch buttons above the tabs
// - Active tab indicator underlined in brand blue (#2a85ff)
// - Synchronized active content panel with quote copywriting
// - Dark mode support with dark:border-gray-700 and dark:text-gray-200
//
// What it does:
// - Binds active tab to external state
// - Allows external buttons to switch tabs programmatically
// - Emits onChange events on direct tab click
//
// Props:
// - value: string (default: "tab1")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import ControlledTabs from '@/TestComponent/Navigation/Tabs/ControlledTabs';
//
// const MyComponent = () => {
//     return <ControlledTabs />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const tabItems = [
    {
        id: 'tab1',
        label: 'Home',
        content:
            'If builders built buildings the way programmers wrote programs, then the first woodpecker that came along would destroy civilization. (Gerald Weinberg)',
    },
    {
        id: 'tab2',
        label: 'Profile',
        content:
            'A computer lets you make more mistakes faster than any invention in human history with the possible exceptions of handguns and tequila. (Mitch Radcliffe)',
    },
    {
        id: 'tab3',
        label: 'Contact',
        content:
            'In C++ its harder to shoot yourself in the foot, but when you do, you blow off your whole leg. (Bjarne Stroustrup)',
    },
]

export function ControlledTabs({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    value: initialValue = 'tab1',
    variant = 'primary',
    ...props
}) {
    const [currentTab, setCurrentTab] = useState(initialValue)

    const activeItem = tabItems.find((t) => t.id === currentTab) || tabItems[0]

    return (
        <div
            className={cn('w-full max-w-2xl', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* External Controller Actions */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Switch Programmatically:
                </span>
                {tabItems.map((tab) => (
                    <button
                        key={tab.id}
                        className={cn(
                            'rounded-md border px-2.5 py-1 text-xs font-medium transition',
                            currentTab === tab.id
                                ? 'border-[#2a85ff] bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
                        )}
                        type="button"
                        onClick={() => setCurrentTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Standard Tab Navigation Header */}
            <div
                aria-label="Controlled tabs"
                className="flex border-b border-gray-200 dark:border-gray-700"
                role="tablist"
            >
                {tabItems.map((tab) => {
                    const isActive = currentTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            aria-controls={`panel-controlled-${tab.id}`}
                            aria-selected={isActive}
                            className={cn(
                                '-mb-px px-5 py-2.5 text-sm font-medium transition focus:outline-none',
                                isActive
                                    ? 'border-b-2 border-[#2a85ff] font-semibold text-[#2a85ff]'
                                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            id={`tab-controlled-${tab.id}`}
                            role="tab"
                            type="button"
                            onClick={() => setCurrentTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content Panel */}
            <div
                aria-labelledby={`tab-controlled-${activeItem.id}`}
                className="p-4 text-sm text-gray-700 dark:text-gray-300"
                id={`panel-controlled-${activeItem.id}`}
                role="tabpanel"
            >
                <p className="leading-relaxed">{activeItem.content}</p>
            </div>
        </div>
    )
}

export default ControlledTabs;
