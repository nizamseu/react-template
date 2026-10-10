// AdvanceTimeline

// AdvanceTimeline · Timeline demo
// Description:
// Comprehensive social activity stream and audit log timeline with user avatars, status badges, and embedded comment cards.
// Ideal for CRM feeds, project issue histories, and collaboration logs.
//
// Design:
// - Connected stem lines with avatar and icon nodes
// - Embedded quote and feedback cards inside timeline nodes
// - Color-coded status tags (Live Issue, Backend)
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Renders multi-tiered activity feed with avatars, badges, and card attachments
// - Handles rich metadata and relative timestamps
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
// import AdvanceTimeline from '@/TestComponent/DataDisplay/Timeline/AdvanceTimeline';
//
// const MyComponent = () => {
//     return <AdvanceTimeline />
// }
// ```

'use client'

import { HiTag } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AdvanceTimeline({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('w-full max-w-2xl', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
                {/* Event 1: Status Change */}
                <li className="mb-8 ml-8">
                    <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-sm ring-4 ring-white dark:ring-gray-850">
                        A
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-900 dark:text-gray-100">Angelina Gotelli</strong>
                        <span>changed status to</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Completed
                        </span>
                        <span className="text-xs text-gray-400">6h ago</span>
                    </div>
                </li>

                {/* Event 2: Comment with Card */}
                <li className="mb-8 ml-8">
                    <span className="absolute -left-3.5 overflow-hidden rounded-full ring-4 ring-white dark:ring-gray-850 shadow-sm">
                        <img
                            alt="Max Alexander"
                            className="h-7 w-7 object-cover"
                            src="/img/avatars/thumb-3.jpg"
                        />
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-900 dark:text-gray-100">Max Alexander</strong>
                        <span>commented on your project update</span>
                        <span className="text-xs text-gray-400">2d ago</span>
                    </div>
                    {/* Embedded Comment Card */}
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                        &quot;Fine, Java might be a good example of what a programming language should be like.
                        But clean atomic UI design is what modern frontends require.&quot;
                    </div>
                </li>

                {/* Event 3: Tag Attachment */}
                <li className="ml-8">
                    <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-sm ring-4 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-850">
                        <HiTag className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-900 dark:text-gray-100">Eugene Stewart</strong>
                        <span>added tags</span>
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            Live Issue
                        </span>
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400">
                            Backend
                        </span>
                        <span className="text-xs text-gray-400">3d ago</span>
                    </div>
                </li>
            </ol>
        </div>
    )
}

export default AdvanceTimeline;
