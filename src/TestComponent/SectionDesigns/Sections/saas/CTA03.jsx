// ZeroEgressCloudSavingsCTA

// CTA03 · SaaS Platforms › Banner CTAs

// Description:
// A dark pricing-comparison banner. It has the eyebrow "Transparent egress &
// compute economics", the headline "Slash 42% Off Your Hyperscaler Cloud Bill" and
// copy about zero egress fees and $142,000 average annual savings. A side box
// compares AWS / GCP egress ($0.09 / GB, struck through) with Northstar Mesh
// ($0.00 / GB) and offers a "Calculate Team Savings" button.

// Design:
// - <section> with flex-col -> lg:flex-row (lg:items-center, justify-between):
//   copy (max-w-xl) on the left and a shrink-0 comparison box on the right.
// - Dark base #121c24 with a #263640 border and shadow-xl. Mint #65e6b4 marks the
//   eyebrow and the Northstar price, rose-400 the struck-through price. The button
//   is #17a878 (hover emerald-600), and the box is black/40 with a white/10 border.
// - Typography: mono uppercase eyebrow, a text-3xl font-black headline and a mono
//   xs comparison box. The section and box are rounded-xl, the button rounded-lg.
// - Responsive: the box drops below the copy until lg. Its width is full below sm
//   and fixed at sm:w-80 from sm. Padding goes p-8 -> sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#roi-calculator` with a HiArrowRight icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ZeroEgressCloudSavingsCTA from '@/TestComponent/SectionDesigns/Sections/saas/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ZeroEgressCloudSavingsCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ZeroEgressCloudSavingsCTA({
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
                'rounded-xl border border-[#263640] bg-[#121c24] p-8 text-white sm:p-12 shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#65e6b4] uppercase tracking-wider font-bold">
                        TRANSPARENT EGRESS & COMPUTE ECONOMICS
                    </span>
                    <h2 className="mt-2 text-3xl font-black">
                        Slash 42% Off Your Hyperscaler Cloud Bill
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Zero data egress fees between availability zones, predictable per-minute billing, and automated instance right-sizing save our customers an average of $142,000 annually.
                    </p>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/10 p-5 font-mono text-xs space-y-3 shrink-0 sm:w-80">
                    <div className="flex justify-between text-white/60">
                        <span>AWS / GCP EGRESS:</span>
                        <span className="line-through text-rose-400">$0.09 / GB</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>NORTHSTAR MESH:</span>
                        <span className="text-[#65e6b4] font-bold">$0.00 / GB</span>
                    </div>
                    <a
                        href="#roi-calculator"
                        className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#17a878] py-2.5 font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                        <span>Calculate Team Savings</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ZeroEgressCloudSavingsCTA
