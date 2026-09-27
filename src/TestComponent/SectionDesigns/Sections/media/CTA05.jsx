// AcademicFreeAccessCTA

// CTA05 · Blogs & Digital Media › Banner CTAs

// Description:
// A dark banner offering free archive access to education: "ACADEMIC
// DISPATCH · FREE LICENSE". The headline "Free Vault Access for Students,
// Educators & Public Libraries" explains that verified universities and
// public research collections get instant passes, with a "Verify with .EDU
// Email" button.

// Design:
// - Flex row from md (stacked below): copy (max-w-xl) on the left, button on
//   the right (shrink-0), vertically centred
// - Dark archival palette: background #1a1816, text #ede8e1 and white
//   (copy white/60), border #443e39, peach accent #e7a37c (kicker, button)
// - Serif text-3xl font-light headline; monospace 10px kicker with an
//   academic-cap icon; outlined rounded-full button that fills peach with
//   #1a1816 text on hover; rounded-xl banner
// - Stacks below md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Button links to `#academic-license`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AcademicFreeAccessCTA from '@/TestComponent/SectionDesigns/Sections/media/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AcademicFreeAccessCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineAcademicCap } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AcademicFreeAccessCTA({
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
                'rounded-xl border border-[#443e39] bg-[#1a1816] p-8 text-[#ede8e1] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#e7a37c]">
                        <HiOutlineAcademicCap className="text-sm" /> ACADEMIC DISPATCH &bull; FREE LICENSE
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Free Vault Access for Students, Educators & Public Libraries
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        We believe foundational cultural criticism belongs in public custody. Instant academic passes granted to all verified university institutions and public research collections.
                    </p>
                </div>

                <a
                    href="#academic-license"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e7a37c] px-6 py-3.5 font-mono text-xs font-bold text-[#e7a37c] hover:bg-[#e7a37c] hover:text-[#1a1816] transition-colors shrink-0"
                >
                    <span>Verify with .EDU Email</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default AcademicFreeAccessCTA
