// SelectedWorksMegaMenu

// MegaMenu01 · Portfolios & Personal Websites › Mega menus

// Description:
// A dark "Selected Works & Commissioned Case Studies" panel for an independent designer's
// portfolio site (fictional Jamie Park, "Independent Design Director", Stockholm & Tokyo).
// It shows a pulsing "Available for select Q4 commissions" badge, four project cards
// (Apple Inc., Nike Global, Teenage Engineering, Spotify Sound Lab) with number, year,
// client, title and award, and a footer with an inquiry e-mail and an archive link.

// Design:
// - Stacked panel: header row (mono kicker + title, badge on the right), a project grid
//   of 1 column on mobile, 2 from md: and 4 from lg:, then a footer row
// - Warm charcoal #1c1816 surface, #ede4de text, coral #ef6a4b accents (kicker, 2px top
//   border, badge on #ef6a4b/20, card numbers, hover border and client name, archive link)
// - Serif text-2xl white title; font-mono kicker, badge, card meta and footer at text-xs
//   and text-[10px]; rounded-lg white/5 cards with white/10 borders, rounded-full badge
// - Header and footer rows use flex-wrap so the badge and archive link drop below the
//   text on narrow screens

// What it does:
// - Each project card is an anchor to #case-study and "Browse Complete 12-Year Archive (64
//   Projects) →" links to #all-work; both call closeMenu on click
// - "hello@jamiepark.studio" is plain text, not a mailto link; the badge dot pings via CSS
//   and the card arrow fades in on hover; the `role` field in the data is never rendered;
//   no state or effects
// - Used by CoralDesignDirectorNavbar: <MegaMenu category="portfolio" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-none border-t-2 border-[#ef6a4b] shadow-2xl bg-[#1c1816]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SelectedWorksMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/portfolio/MegaMenu01';

// // Inside CoralDesignDirectorNavbar it opens from <MegaMenu category="portfolio" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t-2 border-[#ef6a4b] shadow-2xl bg-[#1c1816]">
//         <SelectedWorksMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SelectedWorksMegaMenu({
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
                'bg-[#1c1816] text-[#ede4de] p-8 border-t-2 border-[#ef6a4b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] text-[#ef6a4b] uppercase tracking-[.25em]">
                        JAMIE PARK &bull; INDEPENDENT DESIGN DIRECTOR &bull; STOCKHOLM & TOKYO
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                        Selected Works & Commissioned Case Studies
                    </h3>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#ef6a4b]/20 px-3 py-1 text-xs text-[#ef6a4b] font-mono">
                    <span className="h-2 w-2 rounded-full bg-[#ef6a4b] animate-ping" />
                    <span>Available for select Q4 commissions</span>
                </div>
            </div>

            {/* 4 Selected Projects Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        num: '01',
                        client: 'Apple Inc.',
                        title: 'Spatial Typography & VisionOS Type Engine',
                        year: '2025',
                        role: 'Design Lead',
                        award: 'D&AD Yellow Pencil',
                    },
                    {
                        num: '02',
                        client: 'Nike Global',
                        title: 'The Speed Index: Realtime Marathon Visualizer',
                        year: '2024',
                        role: 'Art Director',
                        award: 'Awwwards Site of the Year',
                    },
                    {
                        num: '03',
                        client: 'Teenage Engineering',
                        title: 'Pocket Synthesizer Hardware UI & Companion App',
                        year: '2024',
                        role: 'Principal UI',
                        award: 'Cannes Lions Gold',
                    },
                    {
                        num: '04',
                        client: 'Spotify Sound Lab',
                        title: 'Algorithmic Mood Capsule & 3D Album Sculptures',
                        year: '2023',
                        role: 'Creative Tech',
                        award: 'FWA of the Month',
                    },
                ].map((proj) => (
                    <a
                        key={proj.num}
                        href="#case-study"
                        onClick={closeMenu}
                        className="group flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-5 hover:border-[#ef6a4b] transition-colors"
                    >
                        <div>
                            <div className="flex items-center justify-between font-mono text-[10px] text-[#ef6a4b]">
                                <span>PROJECT {proj.num}</span>
                                <span>{proj.year}</span>
                            </div>
                            <h4 className="mt-2 text-sm font-bold text-white group-hover:text-[#ef6a4b] transition-colors">
                                {proj.client}
                            </h4>
                            <p className="mt-1 text-xs text-white/70">{proj.title}</p>
                        </div>
                        <div className="mt-6 pt-3 border-t border-white/10 text-[10px] text-white/45 flex items-center justify-between">
                            <span>{proj.award}</span>
                            <HiArrowRight className="text-[#ef6a4b] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/60 font-mono">
                <span>Direct inquiry: hello@jamiepark.studio</span>
                <a href="#all-work" onClick={closeMenu} className="font-bold text-[#ef6a4b] underline hover:text-white">
                    Browse Complete 12-Year Archive (64 Projects) &rarr;
                </a>
            </div>
        </div>
    )
}

export default SelectedWorksMegaMenu
