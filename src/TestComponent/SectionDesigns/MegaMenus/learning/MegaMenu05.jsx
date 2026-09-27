// MentorshipResidencyMegaMenu

// MegaMenu05 · Learning Management & EdTech › Mega menus

// Description:
// A dark mentor-booking dropdown for a mentorship or coaching academy. The header,
// "FIELDNOTE • 1-ON-1 MENTORSHIP RESIDENCY" over "Book direct 45-minute critique
// sessions with industry directors", sits beside "🟢 14 Mentors Online Now". Three
// mentor cards (e.g. Tobias Van Schneider, Ex-Design Lead @ Spotify) show a rating,
// CORE EXPERTISE, a rate and "Book Slot"; a footer offers "Submit File for 24h Critique".

// Design:
// - p-8 panel with a #3c7e5d top border; the header stacks on mobile and is a
//   bottom-aligned row at md:; the mentor grid is one column on mobile, three at md:
// - Dark #12282e surface, #e8f1f5 text; soft green #95c77b for the eyebrow, roles,
//   avatar rings, card hover borders, the "Book Slot" button and the footer link
// - Serif text-2xl title; font-mono status line, rates and expertise label; rounded-lg
//   cards (white/10 border, white/[0.04] fill) hold a black/20 expertise box
// - The footer is a wrapping flex row with a white/10 top border

// What it does:
// - "Book Slot" links go to #book-mentor and the footer critique link to #async-critique;
//   all call closeMenu on click
// - Mentor details and the online status line are display only; no state or effect
// - Used by MentorResidencyThreeColumnGridNavbar: <MegaMenu category="learning" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-[#3c7e5d] shadow-2xl bg-[#12282e]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MentorshipResidencyMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/learning/MegaMenu05';

// // Inside MentorResidencyThreeColumnGridNavbar it opens from <MegaMenu category="learning" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-[#3c7e5d] shadow-2xl bg-[#12282e]">
//         <MentorshipResidencyMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function MentorshipResidencyMegaMenu({
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
                'bg-[#12282e] text-[#e8f1f5] p-8 border-t border-[#3c7e5d]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#95c77b]">
                        FIELDNOTE &bull; 1-ON-1 MENTORSHIP RESIDENCY
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                        Book direct 45-minute critique sessions with industry directors
                    </h3>
                </div>
                <div className="text-xs text-white/70 font-mono">
                    🟢 14 Mentors Online Now &bull; Response Time &lt; 2 hrs
                </div>
            </div>

            {/* 3 Mentor Profile Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'Tobias Van Schneider',
                        role: 'Ex-Design Lead @ Spotify',
                        focus: 'Portfolio Review & Brand Identity',
                        rate: '$180 / session',
                        rating: '5.0 (82 reviews)',
                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    },
                    {
                        name: 'Aniko Fehervari',
                        role: 'Principal Creative Dev @ MediaMonks',
                        focus: 'WebGL Shaders & Three.js Optimization',
                        rate: '$160 / session',
                        rating: '4.9 (64 reviews)',
                        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                    },
                    {
                        name: 'Soren Bækgaard',
                        role: 'VP Product Design @ Klarna',
                        focus: 'Design Systems & Career Strategy',
                        rate: '$190 / session',
                        rating: '5.0 (110 reviews)',
                        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                    },
                ].map((mentor) => (
                    <div
                        key={mentor.name}
                        className="rounded-lg border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between hover:border-[#95c77b] transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-4">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="h-14 w-14 rounded-full object-cover border border-[#95c77b]/50"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-white">{mentor.name}</h4>
                                    <p className="text-xs text-[#95c77b]">{mentor.role}</p>
                                    <span className="text-[11px] text-white/50 block mt-0.5">{mentor.rating}</span>
                                </div>
                            </div>
                            <div className="mt-4 rounded bg-black/20 p-3 text-xs">
                                <span className="text-white/40 block text-[10px] font-mono">CORE EXPERTISE</span>
                                <span className="font-medium text-white/90">{mentor.focus}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                            <span className="font-mono text-xs text-white/80">{mentor.rate}</span>
                            <a
                                href="#book-mentor"
                                onClick={closeMenu}
                                className="rounded bg-[#95c77b] px-3 py-1.5 text-xs font-bold text-[#12282e] hover:bg-white transition-colors"
                            >
                                Book Slot
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Critique Callout */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/70">
                <span>Need immediate feedback on your Figma file or site? Request an Async 15-min Loom critique.</span>
                <a href="#async-critique" onClick={closeMenu} className="font-bold text-[#95c77b] underline hover:text-white">
                    Submit File for 24h Critique &rarr;
                </a>
            </div>
        </div>
    )
}

export default MentorshipResidencyMegaMenu
