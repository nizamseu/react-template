// IndependentThinkingStatementHero

// Hero02 · Corporate & Business › Hero sections

// Description:
// Light, type-led hero for the Northstar consultancy with the eyebrow "INDEPENDENT
// THINKING / SHARED PROGRESS" and the oversized headline "The next move belongs to you.".
// A short supporting line and an underlined "Where we help" link sit beside it, and a
// divider strip lists the four service areas: Strategy, Transformation, Organization, Growth.

// Design:
// - Two-column grid md:grid-cols-[1fr_.65fr] aligned to the bottom (md:items-end):
//   headline left, copy + link right; a full-width service strip below with a top border
// - Pale blue #dce9f6 background, ink #121c2c text, blue #3476c5 eyebrow and link
//   underline, gray-600 body copy, #b9cee1 divider - light, airy feel with no imagery
// - Headline text-5xl -> sm:text-7xl, font-semibold, leading-[.95]; eyebrow text-xs bold
//   uppercase tracking-[.15em]; link underlined via border-b + pb-2; rounded-lg section
// - Below md the columns stack; the service strip is flex-wrap (gap-x-8 gap-y-3);
//   padding p-7 -> sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Single text link "Where we help" -> #expertise with an HiArrowRight icon; the
//   service strip is static text (not links)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IndependentThinkingStatementHero from '@/TestComponent/SectionDesigns/Sections/corporate/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <IndependentThinkingStatementHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function IndependentThinkingStatementHero({
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
                'rounded-lg bg-[#dce9f6] p-7 text-[#121c2c] sm:p-11',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#3476c5]">
                        INDEPENDENT THINKING / SHARED PROGRESS
                    </p>
                    <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                        The next move belongs to you.
                    </h2>
                </div>
                <div>
                    <p className="text-sm leading-6 text-gray-600">
                        We bring the perspective and practical expertise to help
                        your team move with confidence.
                    </p>
                    <a
                        href="#expertise"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#3476c5] pb-2 text-sm font-semibold"
                    >
                        Where we help <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#b9cee1] pt-4 text-xs">
                STRATEGY <span>TRANSFORMATION</span>
                <span>ORGANIZATION</span>
                <span>GROWTH</span>
            </div>
        </section>
    )
}

export default IndependentThinkingStatementHero
