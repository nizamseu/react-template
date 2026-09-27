// PlanMakeShipProductTourHero

// Hero05 · SaaS Platforms › Hero sections

// Description:
// A light split hero inviting visitors to a two-minute product tour. It has the
// eyebrow "A product tour, not a pitch", the headline "See your work take shape.",
// short copy and a "Watch the product tour" text link. On the right, a dark
// video-style panel shows three numbered steps (01 Plan, 02 Make, 03 Ship) and a
// round mint play button.

// Design:
// - Grid <section> `lg:grid-cols-[.8fr_1.2fr]` (gap-7). The copy column is
//   vertically centred. The right panel (relative, min-h-60) holds a 3-column step
//   grid, and the play button is absolutely positioned at the bottom right.
// - Light sage background #edf3ee with ink #111a22 text, a green #137d62 eyebrow
//   and gray-600 body copy. The dark panel is #111a22, with white/10 step tiles and
//   mint #65e6b4 step numbers and play button.
// - Typography: xs bold uppercase eyebrow, tracking-[.15em]; headline
//   text-4xl -> sm:text-5xl semibold, leading-none. The section and panel are
//   rounded-lg, the step tiles rounded, and the play button a rounded-full h-12
//   w-12 circle.
// - Responsive: the copy and panel stack below lg and sit side by side from lg.
//   Padding goes p-6 -> sm:p-9, and the step grid stays 3 columns.

// What it does:
// - No content props, no state. The play <button> (aria-label "Play product tour",
//   HiPlay icon) has no onClick handler, so it is decorative only.
// - One text link to `#tour` with a HiArrowRight icon. Steps are mapped from
//   ['Plan', 'Make', 'Ship'] with zero-padded indices (01-03).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PlanMakeShipProductTourHero from '@/TestComponent/SectionDesigns/Sections/saas/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PlanMakeShipProductTourHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiPlay } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PlanMakeShipProductTourHero({
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
                'grid gap-7 rounded-lg bg-[#edf3ee] p-6 text-[#111a22] sm:p-9 lg:grid-cols-[.8fr_1.2fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#137d62]">
                    A PRODUCT TOUR, NOT A PITCH
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-none sm:text-5xl">
                    See your work take shape.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    A two-minute tour of the space where good teams keep good
                    work moving.
                </p>
                <a
                    href="#tour"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Watch the product tour <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-60 overflow-hidden rounded-lg bg-[#111a22] p-5 text-white">
                <div className="grid grid-cols-3 gap-2">
                    {['Plan', 'Make', 'Ship'].map((step, i) => (
                        <div
                            key={step}
                            className="rounded bg-white/10 p-3 text-xs"
                        >
                            <span className="text-[#65e6b4]">0{i + 1}</span>
                            <p className="mt-3">{step}</p>
                        </div>
                    ))}
                </div>
                <button
                    aria-label="Play product tour"
                    className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#65e6b4] text-[#111a22]"
                >
                    <HiPlay />
                </button>
            </div>
        </section>
    )
}

export default PlanMakeShipProductTourHero
