// PrivateCapitalMegaMenu

// MegaMenu05 · Corporate & Business › Mega menus

// Description:
// A private-markets panel for an investment firm's site ("NORTHSTAR CAPITAL PARTNERS •
// PRIVATE MARKETS"). Under "Discreet Long-Term Capital for Category Leaders" and a
// "$18.4B AUM • 82 Active Portfolio Companies" line it shows two strategy cards (Growth
// Equity in Mission-Critical Software, Clean Energy & Infrastructure Transition) and an
// "LP PORTAL" card for the "Accredited Investor Room" with a "Sign in with Security Key"
// button.

// Design:
// - Header stacks on mobile and becomes a row from md:; three hand-written cards in
//   grid-cols-1 md:grid-cols-3 gap-6
// - Darkest navy #0a0f17 surface, #c9d6e6 text, 2px sky-blue #84b9ff top border; #84b9ff
//   card labels (STRATEGY 01 / 02, LP PORTAL) and button (#0a0f17 text, hover:bg-white)
// - Serif text-2xl heading and serif bold text-base card titles; mono text-[10px] labels;
//   plain rounded (not rounded-lg) white/5 cards with white/10 borders, no hover effect

// What it does:
// - "Sign in with Security Key" goes to #lp-login and calls closeMenu on click; it is a
//   plain link with no real authentication
// - The two strategy cards are static (not links); no state or effect
// - Used by PrivateCapitalGridNavbar: <MegaMenu category="corporate" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-[#84b9ff]/40 shadow-2xl bg-[#0a0f17]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateCapitalMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/corporate/MegaMenu05';

// // Inside PrivateCapitalGridNavbar it opens from <MegaMenu category="corporate" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-[#84b9ff]/40 shadow-2xl bg-[#0a0f17]">
//         <PrivateCapitalMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function PrivateCapitalMegaMenu({
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
                'bg-[#0a0f17] text-[#c9d6e6] p-8 border-t-2 border-[#84b9ff]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-[.25em]">
                        NORTHSTAR CAPITAL PARTNERS &bull; PRIVATE MARKETS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Discreet Long-Term Capital for Category Leaders</h3>
                </div>
                <div className="font-mono text-xs text-white/60">
                    $18.4B AUM &bull; 82 Active Portfolio Companies
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded border border-white/10 bg-white/5">
                    <span className="font-mono text-[10px] text-[#84b9ff] block">STRATEGY 01</span>
                    <h4 className="mt-1 font-serif text-base font-bold text-white">Growth Equity in Mission-Critical Software</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Minority and majority investments in founder-led enterprise infrastructure with €10M–€50M ARR.
                    </p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-white/5">
                    <span className="font-mono text-[10px] text-[#84b9ff] block">STRATEGY 02</span>
                    <h4 className="mt-1 font-serif text-base font-bold text-white">Clean Energy & Infrastructure Transition</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Direct asset development across green hydrogen, battery storage, and Nordic grid interconnectors.
                    </p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#84b9ff] block">LP PORTAL</span>
                        <h4 className="mt-1 font-serif text-base font-bold text-white">Accredited Investor Room</h4>
                        <p className="mt-2 text-xs text-white/60">Secure audited quarterly statements and capital calls.</p>
                    </div>
                    <a
                        href="#lp-login"
                        onClick={closeMenu}
                        className="mt-3 inline-flex items-center justify-center rounded bg-[#84b9ff] py-1.5 text-xs font-bold text-[#0a0f17] hover:bg-white"
                    >
                        Sign in with Security Key
                    </a>
                </div>
            </div>
        </div>
    )
}

export default PrivateCapitalMegaMenu
