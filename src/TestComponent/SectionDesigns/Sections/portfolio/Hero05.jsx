// AvailableForProjectsSplitHero

// Hero05 · Portfolios & Personal Websites › Hero sections

// Description:
// Split hero announcing a designer's availability: the coral eyebrow
// "CURRENTLY / AVAILABLE FOR A FEW GOOD PROJECTS", the headline "Let's make the
// useful thing, beautifully.", a services line (brand systems, digital products,
// collaborative experiments) and a "Get in touch" button beside a studio photo.

// Design:
// - Two-column grid (md:grid-cols-[1.1fr_.9fr]); the image panel is relative
//   with an absolutely positioned cover image.
// - Light palette: cream #f1e9de background, text #241d1a, coral #ef6a4b
//   eyebrow, gray-600 body, blush image panel #e8b6a7 with mix-blend-multiply,
//   dark #241d1a pill button with white text.
// - Headline text-5xl font-black leading-[.9] (sentence case); xs bold
//   uppercase eyebrow (tracking-[.15em]); rounded-full button (px-5 py-3);
//   rounded-lg container with overflow-hidden.
// - Single column below md with the image panel (min-h-64) under the text;
//   padding p-7 → sm:p-11.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Get in touch" → #contact (HiArrowRight icon); the image
//   is a remote Unsplash URL.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AvailableForProjectsSplitHero from '@/TestComponent/SectionDesigns/Sections/portfolio/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AvailableForProjectsSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AvailableForProjectsSplitHero({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'grid overflow-hidden rounded-lg bg-[#f1e9de] text-[#241d1a] md:grid-cols-[1.1fr_.9fr]',
                className,
            )}
            {...props}
        >
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ef6a4b]">
                    CURRENTLY / AVAILABLE FOR A FEW GOOD PROJECTS
                </p>
                <h2 className="mt-5 text-5xl font-black leading-[.9]">
                    Let&apos;s make the useful thing, beautifully.
                </h2>
                <p className="mt-4 max-w-sm text-sm text-gray-600">
                    Brand systems, digital products, and collaborative
                    experiments.
                </p>
                <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
                >
                    Get in touch <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64 bg-[#e8b6a7]">
                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85"
                    alt="Color and type explorations pinned up in a studio"
                />
            </div>
        </section>
    )
}

export default AvailableForProjectsSplitHero
