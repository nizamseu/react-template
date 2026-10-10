// PositioningCarousel

// PositioningCarousel · Carousel demo
// Description:
// Carousel component demonstrating flexible positioning arrangements for navigation arrows.
// Supports overlay arrows, bottom exterior controls, and compact pagination bars.
//
// Design:
// - Navigation controls situated cleanly below the slider track
// - Numbered badge indicator (e.g., '02 / 04')
// - Responsive container sizing with smooth transitions
//
// What it does:
// - Separates navigation arrow buttons from the slide viewport
// - Provides cleaner aesthetics without obscuring slide media
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
// import PositioningCarousel from '@/TestComponent/DataDisplay/Carousel/PositioningCarousel';
//
// const MyComponent = () => {
//     return <PositioningCarousel />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const items = [
    { title: 'Interactive Analytics', desc: 'Real-time metrics streaming' },
    { title: 'Cloud Infrastructure', desc: 'Auto-scaling cluster nodes' },
    { title: 'Security Safeguards', desc: 'Enterprise data encryption' },
    { title: 'Global Edge Network', desc: 'Ultra-low latency routing' },
]

export function PositioningCarousel({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [current, setCurrent] = useState(0)

    const prev = () => setCurrent((p) => (p > 0 ? p - 1 : items.length - 1))
    const next = () => setCurrent((p) => (p < items.length - 1 ? p + 1 : 0))

    return (
        <div
            className={cn('w-full max-w-sm mx-auto', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Slide content */}
                <div className="flex aspect-video flex-col justify-center rounded-xl bg-linear-to-br from-blue-50 to-indigo-50/50 p-6 dark:from-blue-950/30 dark:to-indigo-950/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2a85ff]">
                        Feature {current + 1}
                    </span>
                    <h5 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                        {items[current].title}
                    </h5>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {items[current].desc}
                    </p>
                </div>

                {/* External Bottom Controls */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700/60">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {String(current + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Previous feature"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            disabled={disabled || loading}
                            type="button"
                            onClick={prev}
                        >
                            <HiChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            aria-label="Next feature"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            disabled={disabled || loading}
                            type="button"
                            onClick={next}
                        >
                            <HiChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PositioningCarousel;
