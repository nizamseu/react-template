// DefaultTabs

// DefaultTabs · Tabs demo
// Description:
// Standard underline navigation tabs component with synchronized content panels.
// Provides tab switching for organized multi-view content presentations.
//
// Design:
// - Horizontal border-b track with active indicator underline in brand blue (#2a85ff)
// - Hover states with gray/blue transition
// - Content panel area with clean typography and spacing
// - Dark mode support with dark:border-gray-700 and dark:text-gray-200
//
// What it does:
// - Switches visible tab content panel when clicking tab triggers
// - Retains active tab state (default: "tab1")
// - Emits onTabChange callback
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
// import DefaultTabs from '@/TestComponent/Navigation/Tabs/DefaultTabs';
//
// const MyComponent = () => {
//     return <DefaultTabs defaultValue="tab1" />
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

export function DefaultTabs({
    className,
    defaultValue = 'tab1',
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [activeTab, setActiveTab] = useState(defaultValue)

    const activeItem = tabItems.find((t) => t.id === activeTab) || tabItems[0]

    return (
        <div
            className={cn('w-full max-w-2xl', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Tab Nav Header */}
            <div
                aria-label="Navigation tabs"
                className="flex border-b border-gray-200 dark:border-gray-700"
                role="tablist"
            >
                {tabItems.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            aria-controls={`panel-${tab.id}`}
                            aria-selected={isActive}
                            className={cn(
                                '-mb-px px-5 py-2.5 text-sm font-medium transition focus:outline-none',
                                isActive
                                    ? 'border-b-2 border-[#2a85ff] font-semibold text-[#2a85ff]'
                                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            id={`tab-${tab.id}`}
                            role="tab"
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content Panel */}
            <div
                aria-labelledby={`tab-${activeItem.id}`}
                className="p-4 text-sm text-gray-700 dark:text-gray-300"
                id={`panel-${activeItem.id}`}
                role="tabpanel"
            >
                <p className="leading-relaxed">{activeItem.content}</p>
            </div>
        </div>
    )
}

export default DefaultTabs;
