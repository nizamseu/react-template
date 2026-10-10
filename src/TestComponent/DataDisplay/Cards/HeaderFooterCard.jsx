// HeaderFooterCard

// HeaderFooterCard · Cards demo
// Description:
// Comprehensive card with separated header, body, and action footer zones.
// Features status badges in the header and action buttons in the footer.
//
// Design:
// - Header zone with status indicator badge (HiCheckCircle in emerald)
// - Subtle border divider separating header and footer from body
// - Action footer with primary and secondary buttons
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders complete card with header, body, and action buttons
// - Supports custom action button handlers
//
// Props:
// - title: string (default: "Card Header")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import HeaderFooterCard from '@/TestComponent/DataDisplay/Cards/HeaderFooterCard';
//
// const MyComponent = () => {
//     return <HeaderFooterCard />
// }
// ```

'use client'

import { HiCheckCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function HeaderFooterCard({
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Project Overview',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm transition',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                <h5 className="font-bold text-gray-900 dark:text-gray-100">{title}</h5>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <HiCheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {children || (
                    <p>
                        This card features distinct header and footer sections. Perfect for forms,
                        document overviews, or complex task summaries that require immediate user action.
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5 dark:border-gray-700 dark:bg-gray-800/50">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                >
                    Save Draft
                </button>
                <button
                    className="rounded-lg bg-[#2a85ff] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1f70e0]"
                    disabled={disabled || loading}
                    type="button"
                >
                    Publish Post
                </button>
            </div>
        </div>
    )
}

export default HeaderFooterCard;
