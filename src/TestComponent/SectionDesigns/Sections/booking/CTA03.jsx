// ArchitecturalOdysseyItineraryCTA

// CTA03 · Booking & Reservations › Banner CTAs

// Description:
// A dark banner inviting travelers to commission a bespoke 30-day,
// multi-residence "architectural journey across three continents" (from
// Palm Springs desert homes to Hakone hot-spring sanctuaries), with a
// "Design Custom Odyssey" button.

// Design:
// - Flex column → lg:flex-row (copy in max-w-xl | button), justify-between,
//   items centered from lg
// - Slate #14232c background, #dce7ee text with a white headline and
//   white/70 body, coral #e07d5b eyebrow and button (hover white with
//   #14232c text), rust #b65f47 border-y-2
// - Mono uppercase tracking-wider eyebrow, serif text-3xl → sm:text-4xl
//   normal-weight headline; square shell (rounded-none), rounded-lg button
// - Stacks below lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Design Custom Odyssey" (HiArrowRight) is an anchor to #custom-itinerary

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ArchitecturalOdysseyItineraryCTA from '@/TestComponent/SectionDesigns/Sections/booking/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ArchitecturalOdysseyItineraryCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ArchitecturalOdysseyItineraryCTA({
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
                'rounded-none border-y-2 border-[#b65f47] bg-[#14232c] p-8 text-[#dce7ee] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#e07d5b] uppercase tracking-wider font-bold">
                        BESPOKE EXPEDITIONS &bull; PRIVATE RESIDENCE ODYSSEYS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-white">
                        Curate a 30-Day Architectural Journey Across Three Continents
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Our regional scouts design bespoke multi-residence expeditions: from modernist post-and-beam desert homes in Palm Springs to volcanic hot spring sanctuaries in Hakone.
                    </p>
                </div>

                <a
                    href="#custom-itinerary"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#14232c] transition-colors shrink-0"
                >
                    <span>Design Custom Odyssey</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default ArchitecturalOdysseyItineraryCTA
