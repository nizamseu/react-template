// ExecutiveOffsiteSanctuaryCTA

// CTA05 · Booking & Reservations › Banner CTAs

// Description:
// A high-contrast banner for booking off-grid board and executive offsites in
// sanctuaries with redundant Starlink terminals, private culinary teams,
// strategy pavilions and on-demand helicopter transfers, ending in a
// "Reserve Executive Sanctuary" button.

// Design:
// - Flex column → md:flex-row (copy in max-w-xl | button), justify-between
// - Near-black teal #0e1d24 background, #dae6ec text with a white headline
//   and white/60 body, coral #e07d5b border-2, eyebrow and button (dark
//   #0e1d24 label, hover white)
// - Mono uppercase tracking-widest eyebrow, serif text-3xl font-light
//   headline; square shell (rounded-none), small-radius (rounded) button
// - Stacks below md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Reserve Executive Sanctuary" (HiArrowRight) is an anchor to
//   #executive-retreats

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ExecutiveOffsiteSanctuaryCTA from '@/TestComponent/SectionDesigns/Sections/booking/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ExecutiveOffsiteSanctuaryCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ExecutiveOffsiteSanctuaryCTA({
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
                'rounded-none border-2 border-[#e07d5b] bg-[#0e1d24] p-8 text-[#dae6ec] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e07d5b]">
                        EXECUTIVE LEADERSHIP SANCTUARIES &bull; HIGH-SPEED CONNECTIVITY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Host Off-Grid Board & Executive Offsites
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Sanctuaries equipped with redundant Starlink terminals, private culinary teams, secluded strategy pavilions, and on-demand helicopter transfers.
                    </p>
                </div>

                <a
                    href="#executive-retreats"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-[#0e1d24] hover:bg-white transition-colors shrink-0"
                >
                    <span>Reserve Executive Sanctuary</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default ExecutiveOffsiteSanctuaryCTA
