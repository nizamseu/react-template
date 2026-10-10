// BasicCarousel

// BasicCarousel · Carousel demo
// Description:
// Horizontal slider carousel component with navigation arrows and dot indicators.
// Displays image or content cards sequentially within a fixed viewport.
//
// Design:
// - Smooth sliding transition between items
// - Floating navigation arrows with rounded-full white buttons
// - Bottom pagination dot indicators in brand blue (#2a85ff)
// - Dark mode support with dark:bg-gray-800
//
// What it does:
// - Navigates next/previous slides upon arrow click
// - Supports clicking pagination dots to jump to specific slide
// - Bounds check preventing out-of-range navigation
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
// import BasicCarousel from '@/TestComponent/DataDisplay/Carousel/BasicCarousel';
//
// const MyComponent = () => {
//     return <BasicCarousel />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const slides = [
    { id: 1, title: 'Card Slide 1', bg: 'bg-blue-50 text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-400' },
    { id: 2, title: 'Card Slide 2', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { id: 3, title: 'Card Slide 3', bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { id: 4, title: 'Card Slide 4', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' },
    { id: 5, title: 'Card Slide 5', bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
]

export function BasicCarousel({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const prevSlide = () => {
        if (!disabled && !loading) {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))
        }
    }

    const nextSlide = () => {
        if (!disabled && !loading) {
            setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
        }
    }

    return (
        <div
            className={cn('relative w-full max-w-sm mx-auto', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Active Slide Card */}
                <div
                    className={cn(
                        'flex aspect-video w-full flex-col items-center justify-center rounded-xl p-6 text-center transition-all duration-300',
                        slides[currentIndex].bg,
                    )}
                >
                    <span className="text-4xl font-extrabold">{slides[currentIndex].id}</span>
                    <span className="mt-2 text-sm font-semibold">{slides[currentIndex].title}</span>
                </div>

                {/* Left/Right Arrows */}
                <button
                    aria-label="Previous slide"
                    className="absolute left-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 dark:bg-gray-800/90 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                    onClick={prevSlide}
                >
                    <HiChevronLeft className="h-5 w-5" />
                </button>
                <button
                    aria-label="Next slide"
                    className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 dark:bg-gray-800/90 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                    onClick={nextSlide}
                >
                    <HiChevronRight className="h-5 w-5" />
                </button>

                {/* Bottom Pagination Dots */}
                <div className="mt-3 flex items-center justify-center gap-1.5 pb-1">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={cn(
                                'h-2 rounded-full transition-all duration-200',
                                currentIndex === idx
                                    ? 'w-6 bg-[#2a85ff]'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600',
                            )}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BasicCarousel;
