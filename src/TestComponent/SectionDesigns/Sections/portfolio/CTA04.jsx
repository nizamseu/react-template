// SpeculativeWebGLCollaborationCTA

// CTA04 · Portfolios & Personal Websites › Banner CTAs

// Description:
// Dark rounded banner for a "SPECULATIVE EXPERIMENTS LAB", asking "Have an
// Unhinged WebGL / 3D Spatial Idea?". It invites sound designers, creative
// technologists and generative artists to non-commercial experiments and offers
// a "Pitch Collaborative Project" button.

// Design:
// - Flex layout: copy (max-w-xl) and button stacked, side by side from md
//   (md:flex-row md:items-center, justify-between).
// - Dark palette: espresso #241d1a background, white text (body white/70),
//   coral #ef6a4b label, border at /30 and button (hover white with #241d1a
//   text).
// - Headline font-serif text-3xl bold; mono 10px uppercase label; rounded-2xl
//   banner with shadow-xl; rounded-full button.
// - Stacks below md; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Pitch Collaborative Project" → #pitch-collab
//   (HiOutlineSparkles and HiArrowRight icons).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SpeculativeWebGLCollaborationCTA from '@/TestComponent/SectionDesigns/Sections/portfolio/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SpeculativeWebGLCollaborationCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SpeculativeWebGLCollaborationCTA({
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
                'rounded-2xl border border-[#ef6a4b]/30 bg-[#241d1a] p-8 text-white sm:p-12 shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#ef6a4b]">
                        <HiOutlineSparkles className="text-sm" /> SPECULATIVE EXPERIMENTS LAB
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Have an Unhinged WebGL / 3D Spatial Idea?
                    </h2>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        I regularly partner with sound designers, creative technologists, and generative artists on non-commercial experiments aimed at pushing web graphics beyond current paradigms.
                    </p>
                </div>

                <a
                    href="#pitch-collab"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#241d1a] transition-colors shrink-0"
                >
                    <span>Pitch Collaborative Project</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default SpeculativeWebGLCollaborationCTA
