// DesignIsAskingDarkStatementHero

// Hero04 · Portfolios & Personal Websites › Hero sections

// Description:
// Dark, text-only statement hero for a designer's personal site. A coral eyebrow
// "DESIGN IS A WAY OF ASKING" leads into a large serif question, "What if the
// thing you need doesn't exist yet?", followed by a muted line about working
// with thoughtful teams and a "See what we've made" link.

// Design:
// - Single-column block; the bottom row is flex-wrap with the statement on the
//   left and the link on the right (justify-between, items-end).
// - Dark, moody palette: espresso #241d1a background, off-white text #f5eee5,
//   coral #ef6a4b eyebrow and link underline, body copy in text-white/60.
// - Headline font-serif text-5xl → sm:text-7xl, leading-[.95], max-w-4xl;
//   xs bold uppercase eyebrow (tracking-[.16em]); rounded-lg container;
//   border-b underlined link.
// - Padding p-7 → sm:p-12; the bottom row wraps onto two lines when narrow.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "See what we've made" → #projects (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DesignIsAskingDarkStatementHero from '@/TestComponent/SectionDesigns/Sections/portfolio/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DesignIsAskingDarkStatementHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignIsAskingDarkStatementHero({
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
                'rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-12',
                className,
            )}
            {...props}
        >
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ef6a4b]">
                DESIGN IS A WAY OF ASKING
            </p>
            <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl">
                What if the thing you need doesn&apos;t exist yet?
            </h2>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                <p className="max-w-md text-sm leading-6 text-white/60">
                    I work with thoughtful teams to turn first questions into
                    useful, lasting experiences.
                </p>
                <a
                    href="#projects"
                    className="inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm"
                >
                    See what we&apos;ve made <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default DesignIsAskingDarkStatementHero
