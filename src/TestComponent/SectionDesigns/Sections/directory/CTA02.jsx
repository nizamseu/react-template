// SubmitALocalGemNeoBrutalistCTA

// CTA02 · Directories & Search Aggregators › Banner CTAs

// Description:
// Lime "Community Field Scouting" banner asking "Know an Unsung Local Gem in
// Your Neighborhood?" Visitors are invited to submit third places, tailors,
// kilns and listening bars (visited unannounced by anonymous scouts before
// listing) via a "Submit Spot for Scout Review" button.

// Design:
// - Flex column → lg:flex-row (lg:items-center, justify-between): copy left,
//   button right
// - Lime #d9f064 background, #1a2826 text (#1a2826/80 body); label and button
//   in #1a2826 with lime text; the button flips to white with dark text on hover
// - Neo-brutalist: square corners, border-2 black/10 and a hard offset shadow
//   (8px 8px, #1a2826); heading font-serif text-3xl → sm:text-4xl font-black;
//   mono uppercase label and button text
// - The button sits under the copy until lg; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Submit Spot for Scout Review" links to #submit-spot

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SubmitALocalGemNeoBrutalistCTA from '@/TestComponent/SectionDesigns/Sections/directory/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SubmitALocalGemNeoBrutalistCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SubmitALocalGemNeoBrutalistCTA({
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
                'overflow-hidden rounded-none border-2 border-black/10 bg-[#d9f064] p-8 text-[#1a2826] sm:p-12 shadow-[8px_8px_0px_0px_#1a2826]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-[#1a2826] text-[#d9f064] px-2 py-0.5">
                        COMMUNITY FIELD SCOUTING
                    </span>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black">
                        Know an Unsung Local Gem in Your Neighborhood?
                    </h2>
                    <p className="mt-2 text-sm text-[#1a2826]/80 max-w-xl">
                        Submit third places, heritage tailors, ceramic kilns, and listening bars. Our anonymous editorial scouts visit every submission unannounced before listing.
                    </p>
                </div>

                <a
                    href="#submit-spot"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1a2826] bg-[#1a2826] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#d9f064] hover:bg-white hover:text-[#1a2826] transition-colors shrink-0"
                >
                    <span>Submit Spot for Scout Review</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default SubmitALocalGemNeoBrutalistCTA
