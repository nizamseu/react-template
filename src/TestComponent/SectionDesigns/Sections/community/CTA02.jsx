// CityChapterAmbassadorCTA

// CTA02 · Social Networks & Communities › Banner CTAs

// Description:
// A light recruitment banner for the "CHAPTER AMBASSADOR FELLOWSHIP • 2026 COHORT", headlined
// "Launch a CommonRoom Community in Your City". It explains the support on offer (up to $1,500 in
// quarterly venue stipends, ticketing software, merch kits, speaker intros) and invites visitors to
// "Apply to Lead a Chapter", noting the active cities (Tokyo, Berlin, London, New York, Seoul).

// Design:
// - Grid lg:grid-cols-[1.3fr_0.7fr] (items-center): copy on the left, CTA + city note on the right
// - Palette: off-white #fcf8f5 background, beige #ebded7 border, dark brown #2c1d18 text (70% for
//   the body), rust #a34c38 eyebrow and button (hover black), black/50 note; light and warm
// - Typography & shapes: mono uppercase tracked eyebrow, font-black headline text-3xl →
//   sm:text-4xl, mono button label; rounded-xl banner, rounded-full button
// - Responsive: single column below lg with the full-width button under the copy; padding p-8 →
//   sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Apply to Lead a Chapter" → #apply-ambassador (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityChapterAmbassadorCTA from '@/TestComponent/SectionDesigns/Sections/community/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CityChapterAmbassadorCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CityChapterAmbassadorCTA({
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
                'rounded-xl border border-[#ebded7] bg-[#fcf8f5] p-8 text-[#2c1d18] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#a34c38]">
                        CHAPTER AMBASSADOR FELLOWSHIP &bull; 2026 COHORT
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black leading-tight">
                        Launch a CommonRoom Community in Your City
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#2c1d18]/70">
                        We provide up to $1,500 in quarterly venue stipends, event ticketing software, branded merchandise kits, and direct intros to world-class visiting speakers.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#apply-ambassador"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a34c38] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-black transition-colors"
                    >
                        <span>Apply to Lead a Chapter</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-black/50 text-center">
                        Active in Tokyo, Berlin, London, New York, Seoul
                    </span>
                </div>
            </div>
        </section>
    )
}

export default CityChapterAmbassadorCTA
