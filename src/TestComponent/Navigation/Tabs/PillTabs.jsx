// PillTabs

// PillTabs · Tabs demo
// Description:
// Segmented pill-style navigation tabs with rounded capsule highlights.
// Ideal for compact interfaces, secondary filters, or modern dashboard view switches.
//
// Design:
// - Encapsulated container with rounded-lg gray track (bg-gray-100 dark:bg-gray-800)
// - Active tab styled with crisp white capsule (or dark:bg-gray-700) and soft shadow
// - Brand blue (#2a85ff) typography for active state
// - Content panel below with consistent quote copywriting
//
// What it does:
// - Toggles active tab within a segmented capsule container
// - Updates content panel smoothly
// - Fully keyboard accessible
//
// Props:
// - defaultValue: string (default: "tab1")
// - variant: "pill" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import PillTabs from '@/TestComponent/Navigation/Tabs/PillTabs';
//
// const MyComponent = () => {
//     return <PillTabs />
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

export function PillTabs({
    className,
    defaultValue = 'tab1',
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'pill',
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
            {/* Pill Container */}
            <div
                aria-label="Pill tabs"
                className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
                role="tablist"
            >
                {tabItems.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            aria-controls={`panel-pill-${tab.id}`}
                            aria-selected={isActive}
                            className={cn(
                                'rounded-md px-5 py-2 text-sm font-medium transition focus:outline-none',
                                isActive
                                    ? 'bg-white font-semibold text-[#2a85ff] shadow-sm dark:bg-gray-700 dark:text-blue-400'
                                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            id={`tab-pill-${tab.id}`}
                            role="tab"
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Panel */}
            <div
                aria-labelledby={`tab-pill-${activeItem.id}`}
                className="mt-4 rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-850 dark:text-gray-300"
                id={`panel-pill-${activeItem.id}`}
                role="tabpanel"
            >
                <p className="leading-relaxed">{activeItem.content}</p>
            </div>
        </div>
    )
}

export default PillTabs;
