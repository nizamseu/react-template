// NeoBrutalistDepartmentArchiveMegaMenu

// MegaMenu02 · E-commerce & Marketplaces › Mega menus

// Description:
// A neo-brutalist department dropdown for a design-object or furniture store. A ticker
// header reads "DEPARTMENTAL ARCHIVE / AUTUMN SERIES" beside "CERTIFIED CIRCULAR TRADE-IN"
// and "COPENHAGEN • TOKYO • ZURICH". Below sit three link lists ("01 / RAW MATERIALS",
// "02 / THE ARCHIVE" tagged LIMITED, "03 / MAKERS IN RESIDENCE" with country codes) and a
// featured "Solid Brass Monolith Lamp" card ($480 USD, "EDITION OF 50", "Acquire Piece").

// Design:
// - p-8 panel: a wrapping flex header row with a white/15 bottom border, then a grid that
//   is one column on mobile, two at md: and four at lg:
// - Near-black #181614 surface with #ece7df text; lime #d6f36a pulsing dot, column labels,
//   LIMITED tags, hover arrows and the solid CTA button (hover:bg-white)
// - font-mono text-[10px]/[11px] uppercase tracked labels, text-sm list links at white/70
//   brightening to white; product card is rounded-lg with a white/15 border on white/[0.03]
// - Raw-material links reveal a lime arrow on group-hover; the h-32 lamp image carries a
//   black/80 "EDITION OF 50" badge top-left

// What it does:
// - Every link calls closeMenu on click; each column shares one hash: raw materials go to
//   #spec, archive items to #archive, makers to #maker, and "Acquire Piece" to #order
// - Ticker text and the lamp image/title are display only; no state or effect
// - Used by MaterialMattersBrutalistDarkNavbar: <MegaMenu category="ecommerce" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-white/25 shadow-[8px_8px_0px_0px_#d6f36a]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeoBrutalistDepartmentArchiveMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/ecommerce/MegaMenu02';

// // Inside MaterialMattersBrutalistDarkNavbar it opens from <MegaMenu category="ecommerce" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-white/25 shadow-[8px_8px_0px_0px_#d6f36a]">
//         <NeoBrutalistDepartmentArchiveMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NeoBrutalistDepartmentArchiveMegaMenu({
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
            className={cn('bg-[#181614] text-[#ece7df] p-8', className)}
            {...props}
        >
            {/* Header ticker bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#d6f36a] animate-pulse" />
                    <span className="font-mono text-[11px] uppercase tracking-[.2em] text-white/60">
                        DEPARTMENTAL ARCHIVE / AUTUMN SERIES
                    </span>
                </div>
                <div className="flex items-center gap-6 font-mono text-[11px] text-white/40">
                    <span>CERTIFIED CIRCULAR TRADE-IN</span>
                    <span>COPENHAGEN &bull; TOKYO &bull; ZURICH</span>
                </div>
            </div>

            {/* 4-column brutalist matrix */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Col 1 */}
                <div className="space-y-4">
                    <p className="font-mono text-[10px] text-[#d6f36a] uppercase tracking-widest">
                        01 / RAW MATERIALS
                    </p>
                    <ul className="space-y-2 text-sm">
                        {['Fumed Solid Oak', 'Cast Unlacquered Brass', 'Cold-Rolled Steel', 'Belgian Heavy Linen', 'Hand-Blown Smoked Glass'].map((mat) => (
                            <li key={mat}>
                                <a
                                    href="#spec"
                                    onClick={closeMenu}
                                    className="group flex items-center justify-between py-1 text-white/70 hover:text-white transition-colors"
                                >
                                    <span>{mat}</span>
                                    <HiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d6f36a]" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 2 */}
                <div className="space-y-4">
                    <p className="font-mono text-[10px] text-[#d6f36a] uppercase tracking-widest">
                        02 / THE ARCHIVE
                    </p>
                    <ul className="space-y-2 text-sm">
                        {['Prototypes & Samples', 'Deadstock 2024 Collection', 'Exhibition One-Offs', 'Numbered Lithographs', 'Restored Vintage Pieces'].map((arch) => (
                            <li key={arch}>
                                <a
                                    href="#archive"
                                    onClick={closeMenu}
                                    className="group flex items-center justify-between py-1 text-white/70 hover:text-white transition-colors"
                                >
                                    <span>{arch}</span>
                                    <span className="font-mono text-[10px] text-[#d6f36a]">LIMITED</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 3 */}
                <div className="space-y-4">
                    <p className="font-mono text-[10px] text-[#d6f36a] uppercase tracking-widest">
                        03 / MAKERS IN RESIDENCE
                    </p>
                    <ul className="space-y-2 text-sm">
                        {[
                            { name: 'Jonas Trampedach', loc: 'DK' },
                            { name: 'Faye Toogood', loc: 'UK' },
                            { name: 'Studio Kaksikko', loc: 'FI' },
                            { name: 'Muller Van Severen', loc: 'BE' },
                            { name: 'Masaomi Takahashi', loc: 'JP' },
                        ].map((maker) => (
                            <li key={maker.name}>
                                <a
                                    href="#maker"
                                    onClick={closeMenu}
                                    className="flex items-center justify-between py-1 text-white/70 hover:text-white transition-colors"
                                >
                                    <span>{maker.name}</span>
                                    <span className="font-mono text-[10px] text-white/35">[{maker.loc}]</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 4: Featured Object Card */}
                <div className="rounded-lg border border-white/15 bg-white/[0.03] p-4 flex flex-col justify-between">
                    <div>
                        <div className="relative overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80"
                                alt="Brass Task Lamp"
                                className="h-32 w-full object-cover"
                            />
                            <span className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-[#d6f36a]">
                                EDITION OF 50
                            </span>
                        </div>
                        <h4 className="mt-3 font-semibold text-sm">Solid Brass Monolith Lamp</h4>
                        <p className="mt-1 font-mono text-xs text-white/60">$480 USD &bull; Free Global Freight</p>
                    </div>
                    <a
                        href="#order"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-center gap-2 rounded bg-[#d6f36a] px-3 py-2 text-xs font-bold text-[#181614] hover:bg-white transition-colors"
                    >
                        Acquire Piece <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NeoBrutalistDepartmentArchiveMegaMenu
