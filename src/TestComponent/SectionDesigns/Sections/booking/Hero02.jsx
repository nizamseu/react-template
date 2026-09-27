// OpenItineraryWeekendHero

// Hero02 · Booking & Reservations › Hero sections

// Description:
// A calm, image-free editorial hero for weekend getaways. Under the eyebrow
// "A WEEKEND, WELL SPENT" it pairs the large headline "Leave the itinerary
// open." with a short line of copy and a "Find your somewhere" link, closed
// by a strip of brand values: LOCAL HOSTS / FLEXIBLE DATES / PLACES WITH CHARACTER.

// Design:
// - Single padded block: eyebrow, then a md:grid-cols-[1fr_.7fr] grid with
//   the headline left and copy + link bottom-aligned (md:items-end) right,
//   then a value strip above a top rule
// - Light sage #e5ede8 background, deep teal #132d3a text, forest #346a62
//   eyebrow and link underline, gray-600 body copy, #bdcfc5 divider
// - Serif headline text-5xl → sm:text-7xl at leading-[.95]; bold uppercase
//   text-xs eyebrow with tracking-[.15em]; text-xs value strip with "/"
//   separators; rounded-lg section, no shadow
// - Padding p-7 → sm:p-11; the two columns stack below md

// What it does:
// - Purely presentational: no content props, no state
// - "Find your somewhere" (underlined, HiArrowRight) is an anchor to #places

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpenItineraryWeekendHero from '@/TestComponent/SectionDesigns/Sections/booking/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OpenItineraryWeekendHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpenItineraryWeekendHero({
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
                'rounded-lg bg-[#e5ede8] p-7 text-[#132d3a] sm:p-11',
                className,
            )}
            {...props}
        >
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#346a62]">
                A WEEKEND, WELL SPENT
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="font-serif text-5xl leading-[.95] sm:text-7xl">
                    Leave the itinerary open.
                </h2>
                <div>
                    <p className="text-sm leading-6 text-gray-600">
                        Find a place that gives the day room to surprise you.
                    </p>
                    <a
                        href="#places"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#346a62] pb-2 text-sm font-semibold"
                    >
                        Find your somewhere <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 border-t border-[#bdcfc5] pt-4 text-xs">
                LOCAL HOSTS <span className="mx-3">/</span> FLEXIBLE DATES{' '}
                <span className="mx-3">/</span> PLACES WITH CHARACTER
            </div>
        </section>
    )
}

export default OpenItineraryWeekendHero
