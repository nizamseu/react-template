// Q4CommissionIntroCallCTA

// CTA01 · Portfolios & Personal Websites › Banner CTAs

// Description:
// Full-width coral banner announcing a design director's Q4 2026 commission
// availability ("1 RESERVATION OPEN"). A serif headline "Let's Build Something
// That Redefines Your Category." and a note on 8-to-12 week creative direction
// programs lead to a "Schedule 20-Min Intro Call" button and an NDA note.

// Design:
// - Single column of content (max-w-2xl) inside a relative z-10 wrapper; the
//   CTA row places the button beside the "NDA executed prior to review" note.
// - Warm palette: coral #ef6a4b background, text #241d1a (at /80 and /70),
//   button #241d1a (hover black) with white text; border-y-2 black and
//   shadow-2xl.
// - Headline font-serif text-3xl → sm:text-5xl font-black tracking-tight;
//   mono xs eyebrow, button and note; square banner (rounded-none) with a
//   rounded-full button.
// - Below sm the CTA row stacks with a full-width button and centred note;
//   from sm they sit side by side; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Schedule 20-Min Intro Call" → #book-intro
//   (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import Q4CommissionIntroCallCTA from '@/TestComponent/SectionDesigns/Sections/portfolio/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <Q4CommissionIntroCallCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function Q4CommissionIntroCallCTA({
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
                'relative overflow-hidden rounded-none border-y-2 border-black bg-[#ef6a4b] p-8 text-[#241d1a] sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#241d1a]/80">
                    Q4 2026 COMMISSION AVAILABILITY &bull; 1 RESERVATION OPEN
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Let’s Build Something That Redefines Your Category.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#241d1a]/80">
                    Typically engaged for comprehensive 8-to-12 week creative direction programs: foundational brand identity, custom typography systems, and boundary-pushing WebGL digital flagships.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#book-intro"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241d1a] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors"
                    >
                        <span>Schedule 20-Min Intro Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-[#241d1a]/70 text-center sm:text-left">
                        NDA executed prior to review
                    </span>
                </div>
            </div>
        </section>
    )
}

export default Q4CommissionIntroCallCTA
