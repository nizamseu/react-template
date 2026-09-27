// ResearchInstituteMegaMenu

// MegaMenu04 · Corporate & Business › Mega menus

// Description:
// The research-arm panel for a corporate or institute site ("NORTHSTAR INSTITUTE OF
// APPLIED COMPUTING & POLICY"). Under "Peer-Reviewed Research Papers" and a "340+ Patents
// Awarded • Academic Affiliates: MIT, ETH Zurich, Cambridge" line it lists three paper
// cards with date, citation count, title and authors, each ending in a "Download
// Open-Access Preprint" link.

// Design:
// - Header stacks on mobile and becomes a row from md:; cards in grid-cols-1
//   md:grid-cols-3 gap-6, mapped from a static array
// - Dark #0d1520 surface, #d6e3f2 text, #3476c5 blue top border; sky-blue #84b9ff eyebrow,
//   citation counts and download links; white/5 cards with white/10 borders, white/15
//   header rule
// - Serif bold text-2xl heading; mono text-[10px] uppercase eyebrow (tracking-[.25em])
//   and date/citation row; bold text-sm paper titles; rounded-lg cards, no hover border

// What it does:
// - Each "Download Open-Access Preprint" link goes to #pdf and calls closeMenu on click
// - Paper titles look like links (hover:underline cursor-pointer) but have no href or
//   handler; no state or effect
// - Used by ResearchInstituteFloatingPillNavbar: <MegaMenu category="corporate" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-none border-t border-[#3476c5] shadow-2xl bg-[#0d1520]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ResearchInstituteMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/corporate/MegaMenu04';

// // Inside ResearchInstituteFloatingPillNavbar it opens from <MegaMenu category="corporate" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t border-[#3476c5] shadow-2xl bg-[#0d1520]">
//         <ResearchInstituteMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ResearchInstituteMegaMenu({
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
                'bg-[#0d1520] text-[#d6e3f2] p-8 border-t border-[#3476c5]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#84b9ff]">
                        NORTHSTAR INSTITUTE OF APPLIED COMPUTING & POLICY
                    </span>
                    <h3 className="mt-1 text-2xl font-bold font-serif text-white">Peer-Reviewed Research Papers</h3>
                </div>
                <div className="font-mono text-xs text-white/60">
                    340+ Patents Awarded &bull; Academic Affiliates: MIT, ETH Zurich, Cambridge
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Cryptographic Guarantees for Synthetic Data Generation in Healthcare',
                        authors: 'Dr. Evelyn Ward, Dr. Hiroshi Tanaka',
                        date: 'September 2026',
                        citations: '142 Citations',
                    },
                    {
                        title: 'Decentralized Grid Balancing Under 90% Renewable Intermittency',
                        authors: 'Prof. Lars Lindgren, Elena Rostova',
                        date: 'August 2026',
                        citations: '98 Citations',
                    },
                    {
                        title: 'Sub-Millisecond Byzantine Consensus Across Terrestrial Satellite Links',
                        authors: 'Dr. Marcus Vance, Clara Diaz',
                        date: 'July 2026',
                        citations: '210 Citations',
                    },
                ].map((paper) => (
                    <div
                        key={paper.title}
                        className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
                                <span>{paper.date}</span>
                                <span className="text-[#84b9ff]">{paper.citations}</span>
                            </div>
                            <h4 className="mt-2 text-sm font-bold text-white hover:underline cursor-pointer">
                                {paper.title}
                            </h4>
                            <p className="mt-2 text-xs text-white/50">{paper.authors}</p>
                        </div>
                        <a
                            href="#pdf"
                            onClick={closeMenu}
                            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#84b9ff] font-semibold"
                        >
                            <span>Download Open-Access Preprint</span>
                            <HiArrowRight />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResearchInstituteMegaMenu
