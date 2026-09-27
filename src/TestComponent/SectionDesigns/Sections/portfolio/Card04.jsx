// DesignSprintRetainerPricingCard

// Card04 · Portfolios & Personal Websites › Cards

// Description:
// Dark service/pricing card for a two-week "Sprint Retainer" with Jamie Park:
// a "1 SLOT LEFT FOR Q4" badge, the title "Brand Identity & Digital
// Foundation" priced at $14,000, a short pitch, a four-item deliverables
// checklist and a full-width "Apply for Next Available Sprint" button.

// Design:
// - Header row (border-b), title and price on one baseline row, description,
//   checklist panel (bg-black/40, rounded-xl) and a full-width button.
// - Dark palette: surface #241d1a, white text, coral #ef6a4b (border at /40,
//   label, badge on #ef6a4b/20, price, check icons, button), secondary text
//   white/60-80.
// - font-serif text-2xl bold title; font-mono xl bold price and mono checklist;
//   rounded-2xl card with shadow-2xl; rounded-full button.
// - No breakpoint classes: title and price share one flex row at all widths.

// What it does:
// - No content props, no state; the button hovers to a white background with black
//   text but has no onClick or link, so it does nothing yet.
// - Four hard-coded checklist rows with HiCheck icons (design system tokens,
//   WebGL/motion concept, Figma file and guidelines, video handover).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DesignSprintRetainerPricingCard from '@/TestComponent/SectionDesigns/Sections/portfolio/Card04';

// const ServicesGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <DesignSprintRetainerPricingCard />
//     </div>
// )
// ```

'use client'

import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignSprintRetainerPricingCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-[#ef6a4b]/40 bg-[#241d1a] p-6 text-white shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b] font-bold">
                    SPRINT RETAINER &bull; 2-WEEK IMMERSIVE
                </span>
                <span className="rounded bg-[#ef6a4b]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ef6a4b]">
                    1 SLOT LEFT FOR Q4
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-bold text-white">
                        Brand Identity & Digital Foundation
                    </h3>
                    <span className="font-mono text-xl font-bold text-[#ef6a4b]">$14,000</span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                    A hyper-focused 14-day sprint directly with Jamie Park. No account managers, no layers, pure high-velocity creative execution.
                </p>

                {/* Deliverables checklist */}
                <div className="mt-4 space-y-2 rounded-xl bg-black/40 p-3.5 text-xs font-mono border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Complete Design System Tokens</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Hero WebGL / Motion Concept</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Figma Production File + Guidelines</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Live Video Handover & Dev Sync</span>
                        <HiCheck className="text-[#ef6a4b]" />
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-[#ef6a4b] py-2.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                >
                    Apply for Next Available Sprint
                </button>
            </div>
        </article>
    )
}

export default DesignSprintRetainerPricingCard
