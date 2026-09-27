// SeasideStaySearchHero

// Hero01 · Booking & Reservations › Hero sections

// Description:
// A full-bleed photo hero for a small-stays travel brand. Over a faded
// seaside-village photo it shows the eyebrow "STAY A LITTLE LONGER", the
// headline "A place that changes the pace." and a white search bar with a
// destination field, an "Add dates" button and a "Find a stay" CTA.

// Design:
// - Relative, isolated section with the Unsplash photo absolutely positioned
//   behind (object-cover, opacity-45); a min-h-[430px] flex column pins the
//   eyebrow to the top, headline + search to the middle and the trust line
//   "Thoughtful stays · Honest pricing · Local hosts" to the bottom
// - Dark teal #132d3a base with white text (white/80 and white/70 muted
//   copy); the search bar is white with #182833 text, a gray-200 divider
//   and a coral #e07d5b CTA with white label
// - Serif headline text-5xl → sm:text-7xl at leading-[.95]; bold uppercase
//   text-xs eyebrow with tracking-[.17em]; rounded-lg section and search
//   bar, rounded-md CTA, no shadows
// - Padding p-7 → sm:p-12; the search bar stacks vertically on mobile and
//   becomes a single row (sm:flex-row) from sm up

// What it does:
// - Purely presentational: no content props, no state; the destination input
//   (aria-label "Destination") is uncontrolled and the "Add dates" button
//   (HiCalendar icon) has no click handler
// - "Find a stay" (HiArrowRight) is an anchor to #search

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SeasideStaySearchHero from '@/TestComponent/SectionDesigns/Sections/booking/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SeasideStaySearchHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SeasideStaySearchHero({
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
                'relative isolate overflow-hidden rounded-lg bg-[#132d3a] text-white',
                className,
            )}
            {...props}
        >
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1500&q=85"
                alt="Colorful seaside village on a sunny day"
            />
            <div className="flex min-h-[430px] flex-col justify-between p-7 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[.17em]">
                    STAY A LITTLE LONGER
                </p>
                <div>
                    <h2 className="max-w-2xl font-serif text-5xl leading-[.95] sm:text-7xl">
                        A place that changes the pace.
                    </h2>
                    <p className="mt-4 max-w-md text-sm text-white/80">
                        Small stays and local experiences, found by people who
                        know the place.
                    </p>
                    <div className="mt-7 flex max-w-xl flex-col gap-2 rounded-lg bg-white p-2 text-[#182833] sm:flex-row">
                        <input
                            aria-label="Destination"
                            placeholder="Where to?"
                            className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                        />
                        <button className="flex items-center justify-center gap-2 border-l border-gray-200 px-4 text-sm">
                            <HiCalendar /> Add dates
                        </button>
                        <a
                            href="#search"
                            className="flex items-center justify-center gap-2 rounded-md bg-[#e07d5b] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Find a stay <HiArrowRight />
                        </a>
                    </div>
                </div>
                <p className="text-xs text-white/70">
                    Thoughtful stays · Honest pricing · Local hosts
                </p>
            </div>
        </section>
    )
}

export default SeasideStaySearchHero
