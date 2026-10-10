// WithApiCarousel

// WithApiCarousel · Carousel demo
// Description:
// Programmatic API-driven carousel component with slide index indicators ("Slide X of Y") and jump controls.
// Enables external state hooks to monitor active slide position and trigger transitions.
//
// Design:
// - Slide card with bold number typography and vibrant tint
// - Floating navigation arrows with smooth hover response
// - Text summary showing "Slide X of Y" below slider track
//
// What it does:
// - Exposes current slide index and total count
// - Supports programmatic jump buttons
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
// import WithApiCarousel from '@/TestComponent/DataDisplay/Carousel/WithApiCarousel';
//
// const MyComponent = () => {
//     return <WithApiCarousel />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const slides = [1, 2, 3, 4, 5]

export function WithApiCarousel({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [current, setCurrent] = useState(0)

    const prev = () => setCurrent((p) => (p > 0 ? p - 1 : slides.length - 1))
    const next = () => setCurrent((p) => (p < slides.length - 1 ? p + 1 : 0))

    return (
        <div
            className={cn('w-full max-w-xs mx-auto', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Slide Card */}
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                    <span className="text-5xl font-extrabold text-[#2a85ff]">
                        {slides[current]}
                    </span>
                </div>

                {/* Left/Right Buttons */}
                <button
                    aria-label="Previous slide"
                    className="absolute left-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                    onClick={prev}
                >
                    <HiChevronLeft className="h-5 w-5" />
                </button>
                <button
                    aria-label="Next slide"
                    className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                    disabled={disabled || loading}
                    type="button"
                    onClick={next}
                >
                    <HiChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Slide Index Status Indicator */}
            <div className="mt-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                Slide {current + 1} of {slides.length}
            </div>
        </div>
    )
}

export default WithApiCarousel;
