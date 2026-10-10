// SizesCarousel

// SizesCarousel · Carousel demo
// Description:
// Multi-item carousel displaying multiple card columns simultaneously (e.g. 2 or 3 visible cards per slide).
// Ideal for product showcases, team rosters, and media galleries.
//
// Design:
// - Multi-column sliding track with gap spacing (gap-3)
// - Floating navigation controls
// - Numbered cards in varied color tints
//
// What it does:
// - Shows multiple visible cards per viewport slice
// - Shifts items incrementally on next/prev
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
// import SizesCarousel from '@/TestComponent/DataDisplay/Carousel/SizesCarousel';
//
// const MyComponent = () => {
//     return <SizesCarousel />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const cards = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
    { id: 4, title: 'Item 4' },
    { id: 5, title: 'Item 5' },
    { id: 6, title: 'Item 6' },
]

export function SizesCarousel({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [startIndex, setStartIndex] = useState(0)
    const visibleCount = 3

    const prev = () => setStartIndex((p) => Math.max(0, p - 1))
    const next = () => setStartIndex((p) => Math.min(cards.length - visibleCount, p + 1))

    const visibleCards = cards.slice(startIndex, startIndex + visibleCount)

    return (
        <div
            className={cn('relative w-full max-w-lg mx-auto py-2', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="flex items-center gap-3">
                <button
                    aria-label="Previous items"
                    className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
                        startIndex === 0 && 'cursor-not-allowed opacity-30',
                    )}
                    disabled={startIndex === 0 || disabled || loading}
                    type="button"
                    onClick={prev}
                >
                    <HiChevronLeft className="h-4 w-4" />
                </button>

                <div className="grid flex-1 grid-cols-3 gap-3 overflow-hidden">
                    {visibleCards.map((card) => (
                        <div
                            key={card.id}
                            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-2xs transition dark:border-gray-700 dark:bg-gray-800"
                        >
                            <span className="text-2xl font-bold text-[#2a85ff]">{card.id}</span>
                            <span className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {card.title}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    aria-label="Next items"
                    className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200',
                        startIndex >= cards.length - visibleCount && 'cursor-not-allowed opacity-30',
                    )}
                    disabled={startIndex >= cards.length - visibleCount || disabled || loading}
                    type="button"
                    onClick={next}
                >
                    <HiChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default SizesCarousel;
