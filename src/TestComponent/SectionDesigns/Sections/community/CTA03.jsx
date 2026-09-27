// GlobalHackathonNeoBrutalistCTA

// CTA03 · Social Networks & Communities › Banner CTAs

// Description:
// A bold, neo-brutalist registration banner for a "GLOBAL VIRTUAL HACKATHON" with a $50,000 prize
// pool: "48 Hours. 1,000 Builders. Build Something You Love." It mentions free cloud credits,
// design mentorship and angel-syndicate review for the top 5 teams, with a "Register Hackathon
// Team" button.

// Design:
// - Flex layout: copy block and CTA side by side from lg (items-center, justify-between)
// - Palette: peach #ffccad background, dark brown #27201d text, solid black 2px border and a hard
//   8px black offset shadow, black eyebrow chip and button with peach text (hover inverts to a white
//   background with black text)
// - Typography & shapes: mono uppercase eyebrow with wide tracking (.2em) on a black label, serif
//   font-black headline text-3xl → sm:text-4xl; square corners (rounded-none) and 2px borders
// - Responsive: stacks vertically below lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Register Hackathon Team" → #hackathon-register (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GlobalHackathonNeoBrutalistCTA from '@/TestComponent/SectionDesigns/Sections/community/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GlobalHackathonNeoBrutalistCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GlobalHackathonNeoBrutalistCTA({
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
                'overflow-hidden rounded-none border-2 border-black bg-[#ffccad] p-8 text-[#27201d] sm:p-12 shadow-[8px_8px_0px_0px_#000]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#ffccad] px-2 py-0.5">
                        GLOBAL VIRTUAL HACKATHON &bull; $50,000 PRIZE POOL
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black">
                        48 Hours. 1,000 Builders. Build Something You Love.
                    </h2>
                    <p className="mt-2 text-sm text-[#27201d]/80 max-w-xl">
                        Free cloud credits, design mentorship from industry icons, and instant angel syndicate review for the top 5 winning teams.
                    </p>
                </div>

                <a
                    href="#hackathon-register"
                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#ffccad] hover:bg-white hover:text-black transition-colors shrink-0"
                >
                    <span>Register Hackathon Team</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default GlobalHackathonNeoBrutalistCTA
