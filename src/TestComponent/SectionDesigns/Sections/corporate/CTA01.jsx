// ConfidentialBoardAdvisoryCTA

// CTA01 · Corporate & Business › Banner CTAs

// Description:
// Dark banner inviting board-level clients to book a confidential advisory call. Under the
// eyebrow "CONFIDENTIAL ADVISORY MANDATES · BOARD LEVEL" it shows the serif headline
// "Strategic Counsel for Defining Moments in Enterprise History.", a paragraph on direct
// access to senior partners in London, Zurich and New York, a "Schedule Confidential
// Advisory Call" pill and a "Signed mutual NDA guaranteed prior to call" note.

// Design:
// - Left-aligned content column (max-w-2xl, relative z-10) inside a relative,
//   overflow-hidden section; button + note row flex-col -> sm:flex-row
// - Navy #0e1724 background with a 2px #84b9ff top border and white/10 bottom border,
//   shadow-2xl; sky-blue #84b9ff eyebrow and pill (text #0e1724, hover:bg-white); body
//   copy white/70, note white/50
// - Headline font-serif text-3xl -> sm:text-4xl font-light; font-mono uppercase eyebrow
//   and button; square section (rounded-none), rounded-full button
// - Below sm the button stretches full width and the note is centred; padding
//   p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA -> #request-consultation with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ConfidentialBoardAdvisoryCTA from '@/TestComponent/SectionDesigns/Sections/corporate/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ConfidentialBoardAdvisoryCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ConfidentialBoardAdvisoryCTA({
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
                'relative overflow-hidden rounded-none border-t-2 border-[#84b9ff] border-b border-white/10 bg-[#0e1724] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                    CONFIDENTIAL ADVISORY MANDATES &bull; BOARD LEVEL
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                    Strategic Counsel for Defining Moments in Enterprise History.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Direct engagement with our senior managing partners in London, Zurich, and New York. Strictly confidential discussions regarding acquisitions, recapitalizations, and sovereign alignment.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#request-consultation"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0e1724] hover:bg-white transition-colors"
                    >
                        <span>Schedule Confidential Advisory Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Signed mutual NDA guaranteed prior to call
                    </span>
                </div>
            </div>
        </section>
    )
}

export default ConfidentialBoardAdvisoryCTA
