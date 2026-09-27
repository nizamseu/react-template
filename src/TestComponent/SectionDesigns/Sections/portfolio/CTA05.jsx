// DirectStudioChannelsContactCTA

// CTA05 · Portfolios & Personal Websites › Banner CTAs

// Description:
// Dark contact banner labelled "DIRECT STUDIO CHANNELS • NO INTERMEDIARIES",
// with the headline "Reach Out Directly via Encrypted Signal or Studio Email"
// and a note that Jamie Park reviews inquiries within 24 hours (Stockholm CET).
// Two buttons offer the studio email and Signal / Telegram.

// Design:
// - Flex layout: copy (max-w-xl) and button group stacked, side by side from
//   md; the button group itself switches to a row from sm.
// - Dark palette: #181412 background, text #ede4de with a white headline,
//   coral #ef6a4b label and filled button, white/30 outlined email button,
//   body white/60; border-2 white/20.
// - Headline font-serif text-3xl font-light; mono xs label and buttons;
//   square banner (rounded-none) with rounded-full buttons that hover to
//   white with black text.
// - Below sm the buttons are full width and stacked; below md the whole
//   banner stacks; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - mailto link → jamie@park.studio and an in-page anchor "Signal / Telegram"
//   → #signal (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DirectStudioChannelsContactCTA from '@/TestComponent/SectionDesigns/Sections/portfolio/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DirectStudioChannelsContactCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DirectStudioChannelsContactCTA({
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
                'rounded-none border-2 border-white/20 bg-[#181412] p-8 text-[#ede4de] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ef6a4b]">
                        DIRECT STUDIO CHANNELS &bull; NO INTERMEDIARIES
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Reach Out Directly via Encrypted Signal or Studio Email
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Skip agency bureaucratic pipelines. All inquiries reviewed directly by Jamie Park within 24 hours. Stockholm CET timezone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <a
                        href="mailto:jamie@park.studio"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <span>jamie@park.studio</span>
                    </a>
                    <a
                        href="#signal"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <span>Signal / Telegram</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default DirectStudioChannelsContactCTA
