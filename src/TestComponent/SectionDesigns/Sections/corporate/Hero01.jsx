// NorthstarAdvisorySplitImageHero

// Hero01 · Corporate & Business › Hero sections

// Description:
// Dark two-column landing hero for the fictional "NORTHSTAR / ADVISORY" consultancy.
// The left column stacks an eyebrow, the headline "Complex change. Clear direction.",
// a one-line value statement and an "Explore our work" button; the right column is a
// full-height city-architecture photo tagged "Independent thinking since 2008".

// Design:
// - Grid with min-h-[420px], split 1fr / 1fr from md; the text column uses flex-col
//   justify-between (eyebrow top, headline block middle, pillar line bottom)
// - Dark navy #121c2c with white text; sky-blue #84b9ff for the eyebrow and the filled
//   button (button text #121c2c); muted copy in white/65 and white/40; the photo badge
//   reuses #121c2c as its background
// - Headline text-5xl -> sm:text-6xl, font-semibold, leading-[.98]; eyebrow text-xs bold
//   uppercase with tracking-[.16em]; rounded-lg section (overflow-hidden), rounded-md button
// - Below md the columns stack and the image block keeps a min-h-64; text padding
//   p-7 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Explore our work" -> #work with an HiArrowRight icon; Unsplash image
//   absolutely positioned with object-cover and a descriptive alt text; static pillar
//   line "Strategy · People · Transformation"

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarAdvisorySplitImageHero from '@/TestComponent/SectionDesigns/Sections/corporate/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarAdvisorySplitImageHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NorthstarAdvisorySplitImageHero({
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
                'overflow-hidden rounded-lg bg-[#121c2c] text-white',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[420px] md:grid-cols-[1fr_1fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#84b9ff]">
                        NORTHSTAR / ADVISORY
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-lg text-5xl font-semibold leading-[.98] sm:text-6xl">
                            Complex change. Clear direction.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                            We help ambitious teams turn their next challenge
                            into lasting progress.
                        </p>
                        <a
                            href="#work"
                            className="mt-6 inline-flex items-center gap-3 rounded-md bg-[#84b9ff] px-5 py-3 text-sm font-semibold text-[#121c2c]"
                        >
                            Explore our work <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs text-white/40">
                        Strategy · People · Transformation
                    </p>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
                        alt="Modern city architecture seen from below"
                    />
                    <span className="absolute bottom-5 right-5 bg-[#121c2c] px-4 py-3 text-xs">
                        Independent thinking since 2008
                    </span>
                </div>
            </div>
        </section>
    )
}

export default NorthstarAdvisorySplitImageHero
