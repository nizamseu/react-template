// MintWorkspaceStatementHero

// Hero02 · SaaS Platforms › Hero sections

// Description:
// A bold, typographic hero on a mint background. It has the eyebrow "Software that
// gets out of the way", the oversized headline "Make room for the work.", a short
// pitch for "one connected workspace for planning, shipping, and learning what
// worked" and a dark "Start your trial" button. It is text only, with no imagery
// or product mockup.

// Design:
// - Single <section>: the eyebrow is on top, then a grid `md:grid-cols-[1fr_.7fr]`
//   with `md:items-end`, so the headline and the copy + CTA column share a
//   baseline.
// - Bright, light feel: mint background #65e6b4 with ink #111a22 text. The CTA
//   button is #111a22 with white text.
// - Typography: xs bold uppercase eyebrow, tracking-[.16em]; headline
//   text-5xl -> sm:text-7xl semibold with tight leading-[.92]; body text-sm
//   leading-6. The section is rounded-lg and the button rounded-md, with no borders
//   or shadows.
// - Responsive: the headline and copy stack below md and sit side by side from md.
//   Padding goes p-8 -> sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#try` ("Start your trial") with a HiArrowRight icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MintWorkspaceStatementHero from '@/TestComponent/SectionDesigns/Sections/saas/Hero02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MintWorkspaceStatementHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MintWorkspaceStatementHero({
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
                'rounded-lg bg-[#65e6b4] p-8 text-[#111a22] sm:p-12',
                className,
            )}
            {...props}
        >
            <p className="text-xs font-bold uppercase tracking-[.16em]">
                SOFTWARE THAT GETS OUT OF THE WAY
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="text-5xl font-semibold leading-[.92] sm:text-7xl">
                    Make room
                    <br />
                    for the work.
                </h2>
                <div>
                    <p className="text-sm leading-6">
                        One connected workspace for planning, shipping, and
                        learning what worked.
                    </p>
                    <a
                        href="#try"
                        className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#111a22] px-5 py-3 text-sm text-white"
                    >
                        Start your trial <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default MintWorkspaceStatementHero
