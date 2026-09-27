// BrutalistPortfolioTeardownOfficeHoursCTA

// CTA04 · Learning Management & EdTech › Banner CTAs

// Description:
// Neo-brutalist lime banner for weekly open office hours (Thursdays 12:00 PM
// EST). The all-caps headline "GET YOUR PORTFOLIO TEARDOWN LIVE BY AGENCY
// DIRECTORS." explains that three designers a week get a live 20-minute
// critique, and a black "Submit Portfolio Link" button invites submissions.

// Design:
// - flex-col that becomes a row from lg (copy left, button right,
//   lg:items-center)
// - Bright palette: lime #c8ef70 background, #102d36 text, black border,
//   shadow, eyebrow block and button with lime label; button inverts to white
//   background / black text on hover
// - All-mono type: font-black uppercase headline text-2xl -> sm:text-4xl,
//   highlighted black eyebrow; square corners (rounded-none), 2px black border
//   and hard offset shadow (8px 8px 0 #000)
// - Stacks below lg; padding is a fixed p-8

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Submit Portfolio Link" -> #submit-portfolio (HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BrutalistPortfolioTeardownOfficeHoursCTA from '@/TestComponent/SectionDesigns/Sections/learning/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BrutalistPortfolioTeardownOfficeHoursCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BrutalistPortfolioTeardownOfficeHoursCTA({
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
                'overflow-hidden rounded-none border-2 border-black bg-[#c8ef70] p-8 text-[#102d36] shadow-[8px_8px_0px_0px_#000]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#c8ef70] px-2 py-0.5">
                        OPEN OFFICE HOURS &bull; THURSDAYS 12:00 PM EST
                    </span>
                    <h2 className="mt-3 font-mono text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        GET YOUR PORTFOLIO TEARDOWN LIVE BY AGENCY DIRECTORS.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-black/75 max-w-xl">
                        Submit your Figma file or live URL. 3 designers selected every week for brutal, constructive 20-minute live critique.
                    </p>
                </div>

                <a
                    href="#submit-portfolio"
                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#c8ef70] hover:bg-white hover:text-black transition-colors shrink-0"
                >
                    <span>Submit Portfolio Link</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default BrutalistPortfolioTeardownOfficeHoursCTA
