// CityScoutFellowshipRecruitmentCTA

// CTA03 · Directories & Search Aggregators › Banner CTAs

// Description:
// Clean white recruitment banner for a "Paid City Scout Ambassadorship · 2026
// Fellowship": "Get Paid to Map the Soul of Your City". It invites local
// writers, photographers and architects to critique independent culture in
// Tokyo, Berlin, Paris and London via an "Apply to Be a City Scout" button.

// Design:
// - Grid 1 column → lg:grid-cols-[1.3fr_0.7fr] (gap-8, items-center): copy
//   left, button + perks note right
// - White background, gray-200 border, #1a2826 text, gray-600/500 secondary,
//   #527354 eyebrow; dark #1a2826 pill with white text (hover #527354)
// - Eyebrow font-mono 10px bold uppercase tracking-[.25em]; heading font-serif
//   text-3xl → sm:text-4xl bold; rounded-xl section with shadow-sm,
//   rounded-full button
// - The button column stacks under the copy until lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Apply to Be a City Scout" links to #apply-scout; the note below reads
//   "Monthly stipend · Editorial expense accounts"

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityScoutFellowshipRecruitmentCTA from '@/TestComponent/SectionDesigns/Sections/directory/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CityScoutFellowshipRecruitmentCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CityScoutFellowshipRecruitmentCTA({
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
                'rounded-xl border border-gray-200 bg-white p-8 text-[#1a2826] sm:p-12 shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#527354]">
                        PAID CITY SCOUT AMBASSADORSHIP &bull; 2026 FELLOWSHIP
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        Get Paid to Map the Soul of Your City
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        We compensate local writers, photographers, and architects to conduct anonymous field critiques of independent culture in Tokyo, Berlin, Paris, and London.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#apply-scout"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a2826] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#527354] transition-colors"
                    >
                        <span>Apply to Be a City Scout</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Monthly stipend &bull; Editorial expense accounts
                    </span>
                </div>
            </div>
        </section>
    )
}

export default CityScoutFellowshipRecruitmentCTA
