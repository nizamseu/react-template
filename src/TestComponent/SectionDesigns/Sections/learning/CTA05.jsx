// PrivateMentorResidencyCTA

// CTA05 · Learning Management & EdTech › Banner CTAs

// Description:
// Dark banner for a private mentor residency (Q4 application window). The
// headline "Six Months of Dedicated 1-on-1 Direction" and copy about being paired
// with a design director, bi-weekly feedback and partner intros sit beside a
// lime "Apply for 1-on-1 Cohort" button.

// Design:
// - flex-col that becomes a row from md (max-w-xl copy left, button right,
//   md:items-center)
// - Dark palette: #12282e background, white / white-70 text, lime #c8ef70
//   eyebrow and button (#12282e label, white on hover), #3c7e5d/30 border
// - Mono xs uppercase tracking-widest eyebrow, serif text-3xl bold headline;
//   rounded-2xl section with shadow-2xl, rounded-full mono uppercase button
// - Stacks below md; padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Apply for 1-on-1 Cohort" -> #apply-residency (HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateMentorResidencyCTA from '@/TestComponent/SectionDesigns/Sections/learning/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PrivateMentorResidencyCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PrivateMentorResidencyCTA({
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
                'rounded-2xl border border-[#3c7e5d]/30 bg-[#12282e] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#c8ef70]">
                        PRIVATE MENTOR RESIDENCY &bull; Q4 APPLICATION WINDOW
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Six Months of Dedicated 1-on-1 Direction
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                        Paired with a design director suited to your career trajectory. Bi-weekly project feedback, portfolio re-architecture, and direct partner intros.
                    </p>
                </div>

                <a
                    href="#apply-residency"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8ef70] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#12282e] hover:bg-white transition-colors shrink-0"
                >
                    <span>Apply for 1-on-1 Cohort</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default PrivateMentorResidencyCTA
