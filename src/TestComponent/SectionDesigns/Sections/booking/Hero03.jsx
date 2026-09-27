// CabinSplitScreenHero

// Hero03 · Booking & Reservations › Hero sections

// Description:
// A split-screen hero promoting small stays. The left panel carries the
// eyebrow "PLAN LESS / FEEL MORE", the two-line headline "Find the place.
// Leave the rest." and a "See the stays" link; the right panel shows a cabin
// among trees with a white "Dates open through November" availability badge.

// Design:
// - Two-column grid md:grid-cols-[.8fr_1.2fr]: a text column (flex column,
//   justify-between) and an image column (relative, min-h-64, photo
//   absolutely filling it with object-cover)
// - Dark teal #132d3a background with white text, peach #f0aa8d eyebrow,
//   white/65 body copy; the badge is white with #132d3a text
// - Serif headline text-5xl at leading-[.95] with a manual line break; bold
//   uppercase text-xs eyebrow with tracking-[.15em]; rounded-lg shell with
//   overflow-hidden, square-cornered badge with a HiCalendar icon
// - Padding p-7 → sm:p-11; below md the columns stack (text first, image below)

// What it does:
// - Purely presentational: no content props, no state
// - "See the stays" (HiArrowRight) is an anchor to #stays

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CabinSplitScreenHero from '@/TestComponent/SectionDesigns/Sections/booking/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CabinSplitScreenHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiCalendar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CabinSplitScreenHero({
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
                'grid overflow-hidden rounded-lg bg-[#132d3a] text-white md:grid-cols-[.8fr_1.2fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#f0aa8d]">
                    PLAN LESS / FEEL MORE
                </p>
                <h2 className="my-10 font-serif text-5xl leading-[.95]">
                    Find the place.
                    <br />
                    Leave the rest.
                </h2>
                <p className="max-w-sm text-sm text-white/65">
                    Small stays, open calendars, and local people who make a
                    place feel real.
                </p>
                <a
                    href="#stays"
                    className="mt-6 inline-flex items-center gap-2 text-sm"
                >
                    See the stays <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85"
                    alt="Cozy cabin tucked among trees"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-4 py-3 text-xs text-[#132d3a]">
                    <HiCalendar /> Dates open through November
                </div>
            </div>
        </section>
    )
}

export default CabinSplitScreenHero
