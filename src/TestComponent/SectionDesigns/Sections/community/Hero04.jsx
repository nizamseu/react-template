// FrontPorchLocalMeetupsHero

// Hero04 · Social Networks & Communities › Hero sections

// Description:
// An editorial split hero for "COMMUNITY / IN REAL LIFE", pitching the platform as "The internet,
// with a front porch." It promotes welcoming local meetups around interests people already love,
// links to "See what's happening", and pairs the copy with a photo of friends gathering outside.

// Design:
// - Two equal columns (md:grid-cols-[1fr_1fr]): text block left, cover photo right
// - Palette: cream #f7ede6 background, dark brown #27201d text, rust #a34c38 eyebrow and link
//   underline, gray-600 body copy; light and warm
// - Typography & shapes: serif headline (font-serif, text-5xl, leading .95, regular weight) with
//   a line break; uppercase tracked eyebrow; underlined text link (border-b) instead of a button;
//   rounded-lg section
// - Responsive: stacks below md with the photo underneath at h-64; from md the photo stretches to
//   the full column height; padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Text link "See what's happening" → #events (HiArrowRight icon); Unsplash photo with alt text

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FrontPorchLocalMeetupsHero from '@/TestComponent/SectionDesigns/Sections/community/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FrontPorchLocalMeetupsHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FrontPorchLocalMeetupsHero({
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
                'overflow-hidden rounded-lg bg-[#f7ede6] text-[#27201d]',
                className,
            )}
            {...props}
        >
            <div className="grid md:grid-cols-[1fr_1fr]">
                <div className="p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a34c38]">
                        COMMUNITY / IN REAL LIFE
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95]">
                        The internet,
                        <br />
                        with a front porch.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
                        Find welcoming local meetups around the interests you
                        already love.
                    </p>
                    <a
                        href="#events"
                        className="mt-6 inline-flex items-center gap-2 border-b border-[#a34c38] pb-2 text-sm font-semibold"
                    >
                        See what&apos;s happening <HiArrowRight />
                    </a>
                </div>
                <img
                    className="h-64 w-full object-cover md:h-full"
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85"
                    alt="Friends gathering together outside"
                />
            </div>
        </section>
    )
}

export default FrontPorchLocalMeetupsHero
