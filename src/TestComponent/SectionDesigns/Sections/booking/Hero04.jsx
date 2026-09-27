// SlowCoastSummerGuideHero

// Hero04 · Booking & Reservations › Hero sections

// Description:
// A cinematic full-bleed photo hero for a coastal summer travel guide. Over a
// sunlit Mediterranean coastline it anchors the eyebrow "THE SLOW COAST /
// SUMMER GUIDE", the headline "Go where the day takes its time." and an
// underlined "Explore the coast" link to the bottom-left corner.

// Design:
// - Relative, isolated flex section (min-h-[410px], items-end) with the photo
//   absolutely positioned behind at opacity-50; content capped at max-w-3xl
// - Dark teal #132d3a base showing through the image, white text with a
//   white/75 eyebrow and a white underline on the link
// - Serif headline text-5xl → sm:text-7xl at leading-[.94]; bold uppercase
//   text-xs eyebrow with tracking-[.16em]; rounded-lg shell with overflow-hidden
// - Padding p-7 → sm:p-12 and a larger headline from sm up; single column
//   at every size

// What it does:
// - Purely presentational: no content props, no state
// - "Explore the coast" (HiArrowRight) is an anchor to #guide

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SlowCoastSummerGuideHero from '@/TestComponent/SectionDesigns/Sections/booking/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SlowCoastSummerGuideHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SlowCoastSummerGuideHero({
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
                'relative isolate flex min-h-[410px] items-end overflow-hidden rounded-lg bg-[#132d3a] text-white',
                className,
            )}
            {...props}
        >
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85"
                alt="Sunlit Mediterranean coastline"
            />
            <div className="max-w-3xl p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-white/75">
                    THE SLOW COAST / SUMMER GUIDE
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.94] sm:text-7xl">
                    Go where the day takes its time.
                </h2>
                <a
                    href="#guide"
                    className="mt-6 inline-flex items-center gap-2 border-b border-white pb-2 text-sm"
                >
                    Explore the coast <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default SlowCoastSummerGuideHero
