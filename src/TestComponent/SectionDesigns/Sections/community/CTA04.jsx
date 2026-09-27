// MonthlyVirtualDemoDayCTA

// CTA04 · Social Networks & Communities › Banner CTAs

// Description:
// A dark banner promoting a "MONTHLY VIRTUAL DEMO DAY" (last Friday of every month): "Demo Your
// Side Project in Front of 4,000 Peers". It explains that five selected makers get five minutes
// each to screen-share live prototypes for feedback, beta users and seed-funding interest, and
// offers a "Submit Demo Pitch" button.

// Design:
// - Flex layout: copy (max-w-xl) left and CTA right from md (items-center, justify-between)
// - Palette: dark brown #291f1b background, white text (white/70 body), peach #ffccad eyebrow and
//   button (dark #291f1b label, hover white), white/10 border; dark theme with shadow-xl
// - Typography & shapes: mono uppercase tracked eyebrow, serif bold text-3xl headline, mono button
//   label; rounded-xl banner, rounded-full button
// - Responsive: stacks vertically below md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Submit Demo Pitch" → #apply-demo (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MonthlyVirtualDemoDayCTA from '@/TestComponent/SectionDesigns/Sections/community/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MonthlyVirtualDemoDayCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MonthlyVirtualDemoDayCTA({
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
                'rounded-xl border border-white/10 bg-[#291f1b] p-8 text-white sm:p-12 shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffccad]">
                        MONTHLY VIRTUAL DEMO DAY &bull; LAST FRIDAY OF EVERY MONTH
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Demo Your Side Project in Front of 4,000 Peers
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Five selected makers get 5 minutes each to screen-share live prototypes with no slides. Get instant community feedback, beta users, and seed funding inquiries.
                    </p>
                </div>

                <a
                    href="#apply-demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold text-[#291f1b] hover:bg-white transition-colors shrink-0"
                >
                    <span>Submit Demo Pitch</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default MonthlyVirtualDemoDayCTA
