// PeerQAMegaMenu

// MegaMenu04 · Social Networks & Communities › Mega menus

// Description:
// A dark Q&A / peer-review panel for a developer or design community ("COMMUNITY PROBLEM
// SOLVER • CODE & DESIGN REVIEWS"). Under "Get Unstuck with Peer Feedback" and a "Post a
// Question / Request Review" button it shows three review cards (CODE REVIEW, DESIGN
// TEARDOWN, PITCH DECK REVIEW) with a title, ✓ SOLVED or ● ACTIVE status, a reply count
// and a "View Thread →" link.

// Design:
// - Header stacks on mobile and becomes a row from md: with the CTA on the right; cards in
//   grid-cols-1 md:grid-cols-3 gap-6, mapped from a static array
// - Dark #291f1b surface, white text, terracotta #a34c38 top border; peach #ffccad for the
//   eyebrow, card type labels, CTA pill and thread links; status in emerald-400 (solved)
//   or amber-400 (active); white/5 cards with white/10 borders, white/15 header rule
// - Mono uppercase text-[10px] eyebrow (tracking-[.25em]), bold text-2xl heading, bold
//   text-sm card titles; rounded-full CTA with #291f1b text (hover:bg-white), rounded-lg
//   cards with no hover effect

// What it does:
// - "Post a Question / Request Review" (#ask) and every "View Thread →" (#view-qa) call
//   closeMenu on click; status labels and reply counts are static text
// - No state or effect
// - Used by PeerQAFloatingPillNavbar: <MegaMenu category="community" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-lg border border-[#a34c38] shadow-2xl bg-[#291f1b]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PeerQAMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/community/MegaMenu04';

// // Inside PeerQAFloatingPillNavbar it opens from <MegaMenu category="community" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-lg border border-[#a34c38] shadow-2xl bg-[#291f1b]">
//         <PeerQAMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function PeerQAMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#291f1b] text-white p-8 border-t border-[#a34c38]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ffccad]">
                        COMMUNITY PROBLEM SOLVER &bull; CODE & DESIGN REVIEWS
                    </span>
                    <h3 className="mt-1 text-2xl font-bold">Get Unstuck with Peer Feedback</h3>
                </div>
                <a
                    href="#ask"
                    onClick={closeMenu}
                    className="rounded-full bg-[#ffccad] px-4 py-2 text-xs font-bold text-[#291f1b] hover:bg-white transition-colors"
                >
                    Post a Question / Request Review
                </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        type: 'CODE REVIEW',
                        title: 'GLSL Raymarching Shader Artifacts on Mobile GPUs',
                        replies: '6 Solutions',
                        solved: true,
                    },
                    {
                        type: 'DESIGN TEARDOWN',
                        title: 'Evaluating Accessibility Contrast on Glassmorphic HUD',
                        replies: '14 Critiques',
                        solved: true,
                    },
                    {
                        type: 'PITCH DECK REVIEW',
                        title: 'Seed Round Deck for Open-Source Dev Tool ($2M Ask)',
                        replies: '8 Founder Notes',
                        solved: false,
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#ffccad]">
                                <span>{item.type}</span>
                                <span className={item.solved ? 'text-emerald-400' : 'text-amber-400'}>
                                    {item.solved ? '✓ SOLVED' : '● ACTIVE'}
                                </span>
                            </div>
                            <h5 className="mt-2 font-bold text-sm leading-snug">{item.title}</h5>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                            <span>{item.replies}</span>
                            <a href="#view-qa" onClick={closeMenu} className="font-semibold text-[#ffccad] hover:underline">
                                View Thread &rarr;
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PeerQAMegaMenu
