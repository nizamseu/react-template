// AffixTag

// AffixTag · Tag demo
// Description:
// Tag component with affix decorators (prefix status dot, icon prefix, suffix status dot, and removable close button).
// Enables rich visual categorization and dismissible filter tags.
//
// Design:
// - Prefix icon / dot aligned smoothly with typography
// - Suffix dismissible button with hover effect
// - Clean rounded-md borders with dark mode support
//
// What it does:
// - Renders tags with varied prefix and suffix decorations
// - Supports clicking the remove icon to dismiss tag
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import AffixTag from '@/TestComponent/DataDisplay/Tag/AffixTag';
//
// const MyComponent = () => {
//     return <AffixTag />
// }
// ```

'use client'

import { useState } from 'react';
import { HiPlusCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AffixTag({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [tagDismissed, setTagDismissed] = useState(false)

    return (
        <div
            className={cn('flex flex-wrap items-center gap-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* 1. Default prefix dot */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Tag 1</span>
            </span>

            {/* 2. Emerald prefix dot */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Tag 2</span>
            </span>

            {/* 3. Prefix Icon */}
            <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <HiPlusCircle className="h-3.5 w-3.5 text-[#2a85ff]" />
                <span>Tag 3</span>
            </span>

            {/* 4. Suffix Dot */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <span>Tag 4</span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>

            {/* 5. Suffix Close Icon */}
            {!tagDismissed && (
                <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <span>Removable</span>
                    <button
                        aria-label="Remove tag"
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        type="button"
                        onClick={() => setTagDismissed(true)}
                    >
                        <HiX className="h-3 w-3" />
                    </button>
                </span>
            )}
        </div>
    )
}

export default AffixTag;
