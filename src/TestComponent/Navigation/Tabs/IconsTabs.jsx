// IconsTabs

// IconsTabs · Tabs demo
// Description:
// Navigation tabs enhanced with leading icons for Home, Profile, and Contact sections.
// Improves visual recognition and delivers a rich interface appearance.
//
// Design:
// - React-icons (HiOutlineHome, HiOutlineUser, HiOutlinePhone) aligned with text labels
// - Active tab highlighted with brand blue (#2a85ff) underline and icon color
// - Smooth transitions on tab clicks
// - Dark mode support with dark:border-gray-700 and dark:text-gray-200
//
// What it does:
// - Displays icon-prefixed tab buttons
// - Switches corresponding quote content panel on tab selection
// - Supports keyboard tabs and ARIA accessibility standards
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
// import IconsTabs from '@/TestComponent/Navigation/Tabs/IconsTabs';
//
// const MyComponent = () => {
//     return <IconsTabs />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineHome, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const tabItems = [
    {
        icon: HiOutlineHome,
        id: 'tab1',
        label: 'Home',
        content:
            'If builders built buildings the way programmers wrote programs, then the first woodpecker that came along would destroy civilization. (Gerald Weinberg)',
    },
    {
        icon: HiOutlineUser,
        id: 'tab2',
        label: 'Profile',
        content:
            'A computer lets you make more mistakes faster than any invention in human history with the possible exceptions of handguns and tequila. (Mitch Radcliffe)',
    },
    {
        icon: HiOutlinePhone,
        id: 'tab3',
        label: 'Contact',
        content:
            'In C++ its harder to shoot yourself in the foot, but when you do, you blow off your whole leg. (Bjarne Stroustrup)',
    },
]

export function IconsTabs({
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
            {/* Tab Nav Header with Icons */}
            <div
                aria-label="Icon tabs"
                className="flex border-b border-gray-200 dark:border-gray-700"
                role="tablist"
            >
                {tabItems.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            aria-controls={`panel-icon-${tab.id}`}
                            aria-selected={isActive}
                            className={cn(
                                '-mb-px flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition focus:outline-none',
                                isActive
                                    ? 'border-b-2 border-[#2a85ff] font-semibold text-[#2a85ff]'
                                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            id={`tab-icon-${tab.id}`}
                            role="tab"
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content Panel */}
            <div
                aria-labelledby={`tab-icon-${activeItem.id}`}
                className="p-4 text-sm text-gray-700 dark:text-gray-300"
                id={`panel-icon-${activeItem.id}`}
                role="tabpanel"
            >
                <p className="leading-relaxed">{activeItem.content}</p>
            </div>
        </div>
    )
}

export default IconsTabs;
