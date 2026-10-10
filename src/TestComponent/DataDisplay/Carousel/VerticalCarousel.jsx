// VerticalCarousel

// VerticalCarousel · Carousel demo
// Description:
// Vertical orientation slider carousel with Up and Down navigation controls.
// Ideal for vertical testimonial tickers, step wizards, and compact sidebars.
//
// Design:
// - Vertical track layout with top/bottom circular navigation arrows
// - Clean centered card viewport
// - Smooth vertical transitions
//
// What it does:
// - Transitions items vertically on Up/Down arrow presses
// - Bounds checking and loop support
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
// import VerticalCarousel from '@/TestComponent/DataDisplay/Carousel/VerticalCarousel';
//
// const MyComponent = () => {
//     return <VerticalCarousel />
// }
// ```

'use client'

import { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const verticalSlides = [
    { step: 1, title: 'Step 1: Onboarding', desc: 'Create your workspace' },
    { step: 2, title: 'Step 2: Team Members', desc: 'Invite your collaborators' },
    { step: 3, title: 'Step 3: Integrations', desc: 'Connect GitHub and Slack' },
    { step: 4, title: 'Step 4: Launch', desc: 'Deploy to live cloud' },
]

export function VerticalCarousel({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const [current, setCurrent] = useState(0)

    const prev = () => setCurrent((p) => (p > 0 ? p - 1 : verticalSlides.length - 1))
    const next = () => setCurrent((p) => (p < verticalSlides.length - 1 ? p + 1 : 0))

    const activeItem = verticalSlides[current]

    return (
        <div
            className={cn('flex flex-col items-center gap-2 w-full max-w-xs mx-auto', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Up arrow */}
            <button
                aria-label="Previous step"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                disabled={disabled || loading}
                type="button"
                onClick={prev}
            >
                <HiChevronUp className="h-4 w-4" />
            </button>

            {/* Vertical Card Viewport */}
            <div className="flex h-40 w-full flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2a85ff]">
                    Vertical Carousel
                </span>
                <h5 className="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                    {activeItem.title}
                </h5>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {activeItem.desc}
                </p>
            </div>

            {/* Down arrow */}
            <button
                aria-label="Next step"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                disabled={disabled || loading}
                type="button"
                onClick={next}
            >
                <HiChevronDown className="h-4 w-4" />
            </button>
        </div>
    )
}

export default VerticalCarousel;
