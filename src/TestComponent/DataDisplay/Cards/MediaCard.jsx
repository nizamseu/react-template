// MediaCard

// MediaCard · Cards demo
// Description:
// Rich article and media card component with top banner image, category tag, headline, and author info.
// Perfect for blogs, knowledge bases, news feeds, and e-commerce product highlights.
//
// Design:
// - Full-bleed top image banner with rounded top corners
// - Category label pill (e.g., 'Design System')
// - Author profile avatar with name and publish date in the footer
// - Dark mode support with dark:border-gray-700 and dark:bg-gray-800
//
// What it does:
// - Presents rich editorial media content within an interactive card
// - Handles image loading and text formatting
//
// Props:
// - title: string (default: "Modern Design Architecture")
// - category: string (default: "Design System")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import MediaCard from '@/TestComponent/DataDisplay/Cards/MediaCard';
//
// const MyComponent = () => {
//     return <MediaCard />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function MediaCard({
    category = 'Design System',
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Modern Component Architecture',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'group w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Top Media Banner */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    alt={title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src="/img/others/img-1.jpg"
                />
            </div>

            {/* Card Content Body */}
            <div className="p-5">
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400">
                    {category}
                </span>

                <h4 className="mt-2.5 text-base font-bold text-gray-900 transition group-hover:text-[#2a85ff] dark:text-gray-100">
                    {title}
                </h4>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    Explore modern techniques for structuring scalable design systems with pure
                    Tailwind CSS and atomic components.
                </p>

                {/* Author Footer */}
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700/60">
                    <img
                        alt="Kristen Fisher"
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                        src="/img/avatars/thumb-1.jpg"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            Kristen Fisher
                        </span>
                        <span className="text-[10px] text-gray-400">Oct 10, 2026 · 4 min read</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MediaCard;
