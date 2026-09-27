// MutualAidOpenCollectiveCTA

// CTA05 · Social Networks & Communities › Banner CTAs

// Description:
// A dark, understated banner for "CREATOR MUTUAL AID & TRAVEL GRANTS", headlined "Powered
// Transparently via Open Collective". It explains that community patronage funds conference
// flight bursaries, childcare stipends for workshop hosts and open-source bounties, and links to
// the public ledger.

// Design:
// - Flex layout: copy (max-w-xl) left and CTA right from md (items-center, justify-between)
// - Palette: near-black brown #1b1513 background, #f7e6de base text, white headline, white/60 body,
//   peach #ffccad eyebrow and outline button (fills peach with dark #1b1513 text on hover), rose-400
//   heart icon, white/20 border; dark, calm feel
// - Typography & shapes: 10px mono uppercase eyebrow with a heart icon, serif font-light text-3xl
//   headline; rounded-2xl banner, rounded-full outline button
// - Responsive: stacks vertically below md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "View Public Ledger on Open Collective" → #open-collective (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MutualAidOpenCollectiveCTA from '@/TestComponent/SectionDesigns/Sections/community/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MutualAidOpenCollectiveCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineHeart } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MutualAidOpenCollectiveCTA({
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
                'rounded-2xl border border-white/20 bg-[#1b1513] p-8 text-[#f7e6de] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#ffccad]">
                        <HiOutlineHeart className="text-sm text-rose-400" /> CREATOR MUTUAL AID & TRAVEL GRANTS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Powered Transparently via Open Collective
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        100% of community patronage goes toward conference flight bursaries, childcare stipends for workshop hosts, and open-source bounties. View our public ledger.
                    </p>
                </div>

                <a
                    href="#open-collective"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold text-[#ffccad] hover:bg-[#ffccad] hover:text-[#1b1513] transition-colors shrink-0"
                >
                    <span>View Public Ledger on Open Collective</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default MutualAidOpenCollectiveCTA
