// MakeRoomCreamStudioHero

// Hero02 · Portfolios & Personal Websites › Hero sections

// Description:
// Text-only hero for a small independent design practice. A coral eyebrow
// "INDEPENDENT DESIGN / 2026" sits above the stacked headline "Make room.", with
// a short statement about brands and digital products "with something to say",
// a "Selected work" link and a closing "Brooklyn / Everywhere" location line.

// Design:
// - Flex layout: headline block left, statement and link right, bottom-aligned
//   from md (md:flex-row md:items-end); a full-width hairline row closes it.
// - Light, editorial palette: cream #f1e9de background, text #241d1a, coral
//   #ef6a4b for the eyebrow and link underline, divider #d5c8b7.
// - Headline text-6xl → sm:text-8xl, font-black, uppercase, leading-[.82];
//   tracked uppercase xs eyebrow and 10px location line (tracking-[.18em]);
//   text-sm leading-6 body; rounded-lg container, border-b underlined link.
// - Stacks vertically below md (gap-8); padding p-7 → sm:p-11.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Selected work" → #work (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MakeRoomCreamStudioHero from '@/TestComponent/SectionDesigns/Sections/portfolio/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MakeRoomCreamStudioHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MakeRoomCreamStudioHero({
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
                'overflow-hidden rounded-lg bg-[#f1e9de] p-7 text-[#241d1a] sm:p-11',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#ef6a4b]">
                        INDEPENDENT DESIGN / 2026
                    </p>
                    <h2 className="mt-4 text-6xl font-black uppercase leading-[.82] sm:text-8xl">
                        Make
                        <br />
                        room.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6">
                        A small, independent practice for brands and digital
                        products with something to say.
                    </p>
                    <a
                        href="#work"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm font-semibold"
                    >
                        Selected work <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-10 border-t border-[#d5c8b7] pt-3 text-[10px] uppercase tracking-[.18em]">
                Brooklyn / Everywhere
            </p>
        </section>
    )
}

export default MakeRoomCreamStudioHero
