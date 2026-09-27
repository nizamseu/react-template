// CuriousToCapableLimeStatementHero

// Hero02 · Learning Management & EdTech › Hero sections

// Description:
// Image-free, typography-led hero on a bright lime panel. Under the eyebrow
// "LEARN BY MAKING" it sets the oversized two-line serif headline "From curious /
// to capable." beside a short pitch for practice-led courses and an underlined
// "Browse the catalog" link.

// Design:
// - Single panel: eyebrow on top, then a grid `md:grid-cols-[1fr_.7fr]` with
//   md:items-end so headline and copy column share a baseline
// - Light palette: lime #c8ef70 background, dark teal #102d36 text and link
//   underline
// - Serif headline text-5xl -> sm:text-7xl (leading .92, manual line break),
//   xs bold uppercase eyebrow (.15em tracking), text link with a 1px bottom
//   border instead of a button; rounded-lg corners
// - Grid stacks below md (copy under headline); padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Browse the catalog" -> #catalog with HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CuriousToCapableLimeStatementHero from '@/TestComponent/SectionDesigns/Sections/learning/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CuriousToCapableLimeStatementHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CuriousToCapableLimeStatementHero({
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
                'rounded-lg bg-[#c8ef70] p-8 text-[#102d36] sm:p-12',
                className,
            )}
            {...props}
        >
            <p className="text-xs font-bold uppercase tracking-[.15em]">
                LEARN BY MAKING
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="font-serif text-5xl leading-[.92] sm:text-7xl">
                    From curious
                    <br />
                    to capable.
                </h2>
                <div>
                    <p className="text-sm leading-6">
                        Practice-led courses for people who would rather make a
                        first draft than wait for perfect.
                    </p>
                    <a
                        href="#catalog"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#102d36] pb-2 text-sm font-semibold"
                    >
                        Browse the catalog <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CuriousToCapableLimeStatementHero
