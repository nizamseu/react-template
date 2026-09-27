// CoralSplitDesignerIntroHero

// Hero01 · Portfolios & Personal Websites › Hero sections

// Description:
// Split-screen landing hero for the independent designer "Jamie Park". The left
// panel shows the byline "JAMIE PARK / INDEPENDENT DESIGNER", a huge stacked
// headline "Make it matter.", a one-line pitch about digital products and
// identities, and a "Selected work" link. The right panel is a colour-study photo.

// Design:
// - Two-column grid (md:grid-cols-[1.1fr_.9fr]) with min-h-[430px]; the text
//   column is flex-col justify-between (byline top, headline middle, link bottom).
// - Warm, bold palette: coral #ef6a4b background with espresso text #241d1a; the
//   image panel is #e5cfc0 with a mix-blend-multiply photo and a #241d1a
//   "Scroll to explore ↓" tag in white text, pinned bottom-right.
// - Headline text-6xl → sm:text-8xl, font-black, uppercase, leading-[.84];
//   xs bold uppercase eyebrow with tracking-[.16em]; rounded-lg, overflow-hidden,
//   no borders or shadows.
// - Below md it is a single column with the image panel (min-h-64) under the
//   text; padding grows from p-7 to sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Selected work" → #selected-work (HiArrowRight icon);
//   the image is a remote Unsplash URL.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoralSplitDesignerIntroHero from '@/TestComponent/SectionDesigns/Sections/portfolio/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CoralSplitDesignerIntroHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CoralSplitDesignerIntroHero({
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
                'overflow-hidden rounded-lg bg-[#ef6a4b] text-[#241d1a]',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[430px] md:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        JAMIE PARK / INDEPENDENT DESIGNER
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-6xl font-black uppercase leading-[.84] sm:text-8xl">
                            Make it
                            <br />
                            matter.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm">
                            Digital products and identities for people building
                            a better everyday.
                        </p>
                    </div>
                    <a
                        href="#selected-work"
                        className="flex items-center gap-2 text-xs font-bold uppercase"
                    >
                        Selected work <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64 bg-[#e5cfc0]">
                    <img
                        className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
                        src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85"
                        alt="Graphic design experiments and printed color studies"
                    />
                    <span className="absolute bottom-5 right-5 bg-[#241d1a] px-3 py-2 text-xs text-white">
                        Scroll to explore ↓
                    </span>
                </div>
            </div>
        </section>
    )
}

export default CoralSplitDesignerIntroHero
