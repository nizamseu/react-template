// LocalHostExperiencesHero

// Hero05 · Booking & Reservations › Hero sections

// Description:
// A warm split hero selling small-group experiences led by locals. The text
// side shows the eyebrow "HOSTED BY THE LOCALS", the headline "Come for the
// view. Stay for the stories." and a "Meet your local host" pill button; the
// other side is a photo of travelers exploring a street with a guide.

// Design:
// - Two-column grid sm:grid-cols-[.85fr_1.15fr]: padded text block on the
//   left, object-cover image on the right
// - Sand #f0e6d8 background, deep teal #132d3a text and CTA fill, terracotta
//   #b65f47 eyebrow, gray-600 body copy, white CTA label
// - Serif headline text-5xl at leading-[.96]; bold uppercase text-xs eyebrow
//   with tracking-[.15em]; rounded-lg shell with overflow-hidden,
//   rounded-full CTA
// - Stacks below sm with the image fixed at h-64; from sm up the image fills
//   the column height (sm:h-full); padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - "Meet your local host" (HiArrowRight) is an anchor to #experiences

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LocalHostExperiencesHero from '@/TestComponent/SectionDesigns/Sections/booking/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <LocalHostExperiencesHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LocalHostExperiencesHero({
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
                'grid overflow-hidden rounded-lg bg-[#f0e6d8] text-[#132d3a] sm:grid-cols-[.85fr_1.15fr]',
                className,
            )}
            {...props}
        >
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#b65f47]">
                    HOSTED BY THE LOCALS
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.96]">
                    Come for the view. Stay for the stories.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    Book small-group experiences led by people who know the
                    place by heart.
                </p>
                <a
                    href="#experiences"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#132d3a] px-5 py-3 text-sm text-white"
                >
                    Meet your local host <HiArrowRight />
                </a>
            </div>
            <img
                className="h-64 w-full object-cover sm:h-full"
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=85"
                alt="Travelers exploring a local street with a guide"
            />
        </section>
    )
}

export default LocalHostExperiencesHero
