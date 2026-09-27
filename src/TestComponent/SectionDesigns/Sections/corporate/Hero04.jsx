// ConsultingPrinciplesTileMosaicHero

// Hero04 · Corporate & Business › Hero sections

// Description:
// Light split hero with the eyebrow "BUILT AROUND YOUR BUSINESS", the headline "Better
// questions. Better outcomes." and an "Our approach" text link. The wider right side is a
// staggered 2x2 mosaic of colour tiles naming four principles: Strategy that meets
// reality, Change people can own, Progress you can measure, Partnership that lasts.

// Design:
// - Grid md:grid-cols-[.78fr_1.22fr]; text column flex-col justify-between; tile area is
//   grid-cols-2 gap-3 with the 2nd and 4th tiles pushed down (mt-8 -> sm:mt-12)
// - Cool grey #e9edf1 background, ink #182434 text, blue #3476c5 eyebrow and lead tile
//   (white text); other tiles #c4d9ee, #c9d1d8 and #d5e6f4 - soft, light palette
// - Headline text-5xl, font-semibold, leading-[.96]; tiles rounded-lg, min-h-36, with
//   text-sm labels anchored to the bottom (items-end); rounded-lg section, no imagery
// - Below md the mosaic stacks under the copy but stays two columns; padding
//   p-7 -> sm:p-10 (text) and p-4 -> sm:p-6 (tiles)

// What it does:
// - Purely presentational: no content props, no state
// - Single text link "Our approach" -> #approach with an HiArrowRight icon; the four
//   tiles are hard-coded (not mapped from an array)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ConsultingPrinciplesTileMosaicHero from '@/TestComponent/SectionDesigns/Sections/corporate/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ConsultingPrinciplesTileMosaicHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ConsultingPrinciplesTileMosaicHero({
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
                'grid overflow-hidden rounded-lg bg-[#e9edf1] text-[#182434] md:grid-cols-[.78fr_1.22fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#3476c5]">
                    BUILT AROUND YOUR BUSINESS
                </p>
                <h2 className="my-10 text-5xl font-semibold leading-[.96]">
                    Better questions. Better outcomes.
                </h2>
                <a
                    href="#approach"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Our approach <HiArrowRight />
                </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                <div className="flex min-h-36 items-end rounded-lg bg-[#3476c5] p-4 text-sm text-white">
                    Strategy that meets reality
                </div>
                <div className="mt-8 flex min-h-36 items-end rounded-lg bg-[#c4d9ee] p-4 text-sm sm:mt-12">
                    Change people can own
                </div>
                <div className="flex min-h-36 items-end rounded-lg bg-[#c9d1d8] p-4 text-sm">
                    Progress you can measure
                </div>
                <div className="mt-8 flex min-h-36 items-end rounded-lg bg-[#d5e6f4] p-4 text-sm sm:mt-12">
                    Partnership that lasts
                </div>
            </div>
        </section>
    )
}

export default ConsultingPrinciplesTileMosaicHero
