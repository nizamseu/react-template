// HeaderFooterBorderCard

// HeaderFooterBorderCard · Cards demo
// Description:
// Card with header and footer regions rendered without visible divider border lines.
// Delivers a clean, continuous visual flow while maintaining clear informational hierarchy.
//
// Design:
// - Header, body, and footer unified without border separators
// - Subtle padding separation between regions
// - Modern flat appearance with dark mode support
//
// What it does:
// - Groups title, content, and actions without harsh horizontal divider rules
//
// Props:
// - title: string (default: "Seamless Card")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import HeaderFooterBorderCard from '@/TestComponent/DataDisplay/Cards/HeaderFooterBorderCard';
//
// const MyComponent = () => {
//     return <HeaderFooterBorderCard />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function HeaderFooterBorderCard({
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Seamless Flow Card',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex items-center justify-between">
                <h5 className="font-bold text-gray-900 dark:text-gray-100">{title}</h5>
                <span className="text-xs text-gray-400">Oct 2026</span>
            </div>

            <div className="my-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {children || (
                    <p>
                        A continuous card layout without line borders between zones creates a
                        modern, magazine-like feel while retaining clear header, body, and footer functionality.
                    </p>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                >
                    Cancel
                </button>
                <button
                    className="rounded-lg bg-[#2a85ff] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1f70e0]"
                    disabled={disabled || loading}
                    type="button"
                >
                    Confirm Action
                </button>
            </div>
        </div>
    )
}

export default HeaderFooterBorderCard;
