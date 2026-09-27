// GlobalAdvisoryPracticesMegaMenu

// MegaMenu01 · Corporate & Business › Mega menus

// Description:
// The "NORTHSTAR ADVISORY • GLOBAL STRATEGY & TRANSFORMATION" panel for a consulting or
// professional-services site. Under "Counsel for Defining Moments in Enterprise History"
// and an office-city strip (ZURICH … SINGAPORE) it lists three practice columns (M&A &
// Capital Strategy, AI & Digital Transformation, ESG & Energy Transition) of four service
// links each, plus an "EXECUTIVE BRIEFING • 2026" card with a "Download Executive
// Briefing (PDF)" link.

// Design:
// - Flex-wrap header, then grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6: three link
//   columns plus the briefing card as the fourth cell (the JSX comment says "4 Practice
//   Columns")
// - Dark navy #0e1724 surface, #d9e4f2 text, 2px sky-blue #84b9ff top border; #84b9ff for
//   the eyebrow, icon-led column heads (briefcase, trending-up, scale), link hover and the
//   briefing link; white/5 briefing card with a white/10 border
// - Serif text-2xl heading and serif briefing title; mono text-[10px] uppercase eyebrow
//   (tracking-[.25em]); bold uppercase text-xs column heads; rounded-lg card
// - One column on mobile, two from md:, four from lg:; the mono city strip (flex gap-6)
//   does not wrap

// What it does:
// - Service links go to #ma, #digital or #esg by column and the briefing link to
//   #download-briefing; all call closeMenu on click (no real PDF behind it)
// - City names are plain text; no state or effect
// - Used by AdvisoryPracticesMegaMenuNavbar: <MegaMenu category="corporate" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-none border-t-2 border-[#84b9ff] border-b border-white/10 shadow-2xl bg-[#0e1724]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GlobalAdvisoryPracticesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/corporate/MegaMenu01';

// // Inside AdvisoryPracticesMegaMenuNavbar it opens from <MegaMenu category="corporate" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t-2 border-[#84b9ff] border-b border-white/10 shadow-2xl bg-[#0e1724]">
//         <GlobalAdvisoryPracticesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineBriefcase,
    HiOutlineScale,
    HiOutlineTrendingUp,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GlobalAdvisoryPracticesMegaMenu({
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
                'bg-[#0e1724] text-[#d9e4f2] p-8 border-t-2 border-[#84b9ff]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#84b9ff]">
                        NORTHSTAR ADVISORY &bull; GLOBAL STRATEGY & TRANSFORMATION
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                        Counsel for Defining Moments in Enterprise History
                    </h3>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs text-white/50">
                    <span>ZURICH</span>
                    <span>LONDON</span>
                    <span>NEW YORK</span>
                    <span>TOKYO</span>
                    <span>SINGAPORE</span>
                </div>
            </div>

            {/* 4 Practice Columns */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                        <HiOutlineBriefcase className="text-base" /> M&A & Capital Strategy
                    </div>
                    <ul className="mt-4 space-y-2 text-xs">
                        {['Cross-Border Transactions', 'Carve-Outs & Spin-Offs', 'Post-Merger Integration', 'Due Diligence & Valuation'].map((s) => (
                            <li key={s}>
                                <a href="#ma" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                        <HiOutlineTrendingUp className="text-base" /> AI & Digital Transformation
                    </div>
                    <ul className="mt-4 space-y-2 text-xs">
                        {['Enterprise LLM Architectures', 'Cloud Migration at Scale', 'Data Governance & Sovereign AI', 'Legacy Core Modernization'].map((s) => (
                            <li key={s}>
                                <a href="#digital" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                        <HiOutlineScale className="text-base" /> ESG & Energy Transition
                    </div>
                    <ul className="mt-4 space-y-2 text-xs">
                        {['Scope 1-3 Decarbonization', 'EU CSRD Regulatory Compliance', 'Renewable Infrastructure Capital', 'Supply Chain Circularity'].map((s) => (
                            <li key={s}>
                                <a href="#esg" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Executive Report Card */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-wider block">
                            EXECUTIVE BRIEFING &bull; 2026
                        </span>
                        <h4 className="mt-2 font-serif text-base text-white">The Geopolitics of Sovereign Technology</h4>
                        <p className="mt-2 text-xs text-white/60">
                            Comprehensive 48-page strategic study for Global 2000 CEOs and board directors.
                        </p>
                    </div>
                    <a
                        href="#download-briefing"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-between text-xs font-bold text-[#84b9ff] underline hover:text-white"
                    >
                        <span>Download Executive Briefing (PDF)</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default GlobalAdvisoryPracticesMegaMenu
