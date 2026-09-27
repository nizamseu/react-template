// LocalDirectoryMegaMenuCollection

// DirectoryMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for an independent city / business directory (fictional
// "Good Neighbor" brand). Depending on `variant` the visitor sees category link lists,
// a mock faceted search with nearby places, editorial field guides, a B2B directory of
// verified studios or neighbourhood walking loops.

// Design:
// - Five hard-coded layouts in dark forest-green tones (plus one light variant) with lime #d9f064 highlights and responsive grids (1 column on mobile, 3-4 from md/lg).
// - Variant 1 — "Local Guilds": #14201e panel, "4,820 Personally Verified Local Establishments" header, three category link columns (Food & Provisions, Home & Architecture, Craft & Repair) and a "Guide of the Month" card with a "Download Offline Map" link.
// - Variant 2 — "Power Search": light #f5f8f5 panel, read-only search field with a "Filters (4 active)" button, static filter chips and three nearby-place cards (distance, opening hours, rating).
// - Variant 3 — "Curated Guides": #182622 panel, three editorial guide cards with Unsplash cover image (zoom on hover), serif title and author/location.
// - Variant 4 — "Verified Studios": #12201c panel, "Post Anonymous RFP" pill link and three B2B category cards (studio count, minimum budget, example studios) with "View Studios & Verified Reviews" links.
// - Variant 5 — "District Walks": #1b2b27 panel, walking-score header and three district cards (city, loop length, highlights) with "Open GPS Walking Loop" links.

// What it does:
// - `variant` 1-4 each return their own layout; any other value (including 5) falls through to Variant 5.
// - Anchors in Variants 1, 4 and 5 call `closeMenu` on click (placeholder hrefs such as "#cat", "#rfp", "#map-loop").
// - Variants 2 and 3 contain no links and never call `closeMenu`; the Variant 2 "Filters" button has no click handler.
// - Purely presentational: no search/filter logic, state or effects; all data is hard-coded.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "directory"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of the links/CTAs (Variants 1, 4, 5) so the parent mega menu can close.
// @param {string} [props.accent='#527354'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import LocalDirectoryMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/DirectoryMegaMenu';

// function GuildsMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <LocalDirectoryMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="directory"
// // <MegaMenu category="directory" variant={1} accent="#d9f064" label="Local Guilds" />
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineCheck,
    HiOutlineFilter,
    HiOutlineLocationMarker,
    HiOutlineMap,
    HiOutlineSearch,
    HiOutlineStar,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LocalDirectoryMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#527354',
    className,
    ...props
}) {
    // VARIANT 1: City Neighborhoods & Local Guilds (GOOD NEIGHBOR.)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#14201e] text-[#e3ece9] p-8 border-t-2 border-[#d9f064]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                            GOOD NEIGHBOR &bull; INDEPENDENT CITY DIRECTORY
                        </span>
                        <h3 className="mt-1 font-bold text-2xl text-white">4,820 Personally Verified Local Establishments</h3>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-[#d9f064]">
                        <HiOutlineCheck /> ZERO SPONSORED ADS &bull; ANONYMOUS FIELD CRITIQUES
                    </div>
                </div>

                {/* 4 Category Matrix */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                            01 / FOOD & PROVISIONS
                        </span>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['Heritage Sourdough Bakeries', 'Third-Wave Micro Roasters', 'Natural Low-Intervention Wine', 'Heirloom Produce Markets'].map((c) => (
                                <li key={c}>
                                    <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                        &bull; {c}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                            02 / HOME & ARCHITECTURE
                        </span>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['Mid-Century Vintage Dealers', 'Ceramic Studios & Kilns', 'Architectural Salvage', 'Japanese Joinery & Carpentry'].map((c) => (
                                <li key={c}>
                                    <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                        &bull; {c}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="font-mono text-xs font-bold text-[#d9f064] uppercase">
                            03 / CRAFT & REPAIR
                        </span>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['Bespoke Shoemakers & Cobblers', 'Mechanical Watch Restorers', 'Loom & Weaving Ateliers', 'Vintage Audio Repair'].map((c) => (
                                <li key={c}>
                                    <a href="#cat" onClick={closeMenu} className="block py-1 text-white/70 hover:text-white">
                                        &bull; {c}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Spotlight City Guide */}
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-wider block">
                                GUIDE OF THE MONTH
                            </span>
                            <h4 className="mt-2 text-sm font-bold text-white">Shimokitazawa, Tokyo &bull; 28 Venues</h4>
                            <p className="mt-1 text-xs text-white/60">
                                The definitive pocket index of independent vinyl dens, kissaten cafes, and vintage clothing archives.
                            </p>
                        </div>
                        <a
                            href="#guide-pdf"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs font-bold text-[#d9f064] underline hover:text-white"
                        >
                            <span>Download Offline Map</span>
                            <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Faceted Power Search & Quick Filter Hub
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#f5f8f5] text-[#1c2c26] p-8 border-t border-[#d5e0d7]',
                    className,
                )}
                {...props}
            >
                <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
                    <HiOutlineSearch className="text-lg text-gray-400" />
                    <input
                        type="text"
                        readOnly
                        value="Search by neighborhood, specialty craft, or opening hours..."
                        className="flex-1 bg-transparent text-xs text-gray-800 outline-none cursor-pointer"
                    />
                    <button type="button" className="flex items-center gap-1 text-xs font-bold text-[#527354]">
                        <HiOutlineFilter /> Filters (4 active)
                    </button>
                </div>

                {/* Filter Tags */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {['Open After 10 PM', 'Dog Friendly Patio', 'Organic / Demeter Certified', 'Wheelchair Accessible', 'Step-Free Entrance', 'Outdoor Seating'].map((f) => (
                        <span key={f} className="rounded-full bg-white px-3 py-1 border border-gray-200 font-medium text-gray-700">
                            ✓ {f}
                        </span>
                    ))}
                </div>

                {/* Nearest 3 Places */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Monocle Coffee Roasters', loc: '0.2 miles &bull; Shoreditch', open: 'Open until 7 PM', rating: '4.9 ★' },
                        { name: 'Tate Modern Bookshop', loc: '0.6 miles &bull; Bankside', open: 'Open until 6 PM', rating: '4.8 ★' },
                        { name: 'Leila’s Shop & Provisions', loc: '0.8 miles &bull; Arnold Circus', open: 'Open until 5 PM', rating: '5.0 ★' },
                    ].map((p) => (
                        <div key={p.name} className="rounded-lg bg-white p-4 border border-gray-200 flex items-center justify-between">
                            <div>
                                <h5 className="font-bold text-xs text-gray-900">{p.name}</h5>
                                <span className="text-[11px] text-gray-500 block">{p.loc}</span>
                                <span className="font-mono text-[10px] text-emerald-700">{p.open}</span>
                            </div>
                            <span className="font-mono text-xs font-bold text-gray-800">{p.rating}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 3: Curated Field Guides & 100 Best Lists
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#182622] text-[#d6e5df] p-8 border-t border-[#527354]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                            EDITORIAL FIELD GUIDES &bull; TOP 25 SERIES
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">Curated by Architects, Chefs & Critics</h3>
                    </div>
                    <span className="text-xs text-white/50">Updated Bi-Weekly</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'The 25 Best Architectural Coffee Houses in the Pacific Northwest',
                            author: 'By Marcus Vance &bull; Portland & Seattle',
                            img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            title: 'Natural Wine Cellars & Cave à Mangers Along the Canal Saint-Martin',
                            author: 'By Chloe Laurent &bull; Paris 10ème',
                            img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            title: 'Secret Soba Masters & Hidden Noren Curtains of Kyoto',
                            author: 'By Kenjiro Morita &bull; Gion & Arashiyama',
                            img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
                        },
                    ].map((g) => (
                        <div key={g.title} className="group overflow-hidden rounded bg-black/40 border border-white/10">
                            <img
                                src={g.img}
                                alt={g.title}
                                className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="p-4">
                                <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#d9f064] transition-colors">
                                    {g.title}
                                </h4>
                                <span className="mt-1 block text-[11px] text-white/50">{g.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 4: B2B Verified Studio Directory & Comparisons
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#12201c] text-white p-8 border-t border-white/15',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                            VERIFIED CREATIVE PARTNERS &bull; B2B DIRECTORY
                        </span>
                        <h3 className="mt-1 text-2xl font-bold font-serif">Independent Studios & Specialized Agencies</h3>
                    </div>
                    <a
                        href="#rfp"
                        onClick={closeMenu}
                        className="rounded-full bg-[#d9f064] px-4 py-1.5 text-xs font-bold text-[#12201c] hover:bg-white"
                    >
                        Post Anonymous RFP (Get 3 Proposals)
                    </a>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            category: 'BRAND IDENTITY & ART DIRECTION',
                            studios: '34 Verified Studios &bull; Min Project: $25k',
                            examples: ['Pentagram Alums', 'Studio Koto', 'Order NY'],
                        },
                        {
                            category: 'CREATIVE DEV & THREE.JS SHADERS',
                            studios: '28 Verified Studios &bull; Min Project: $30k',
                            examples: ['Locomotive Montreal', 'Active Theory', 'Resn'],
                        },
                        {
                            category: 'HARDWARE & INDUSTRIAL DESIGN',
                            studios: '18 Verified Studios &bull; Min Project: $40k',
                            examples: ['Layer Design', 'Minimal Inc.', 'Teague'],
                        },
                    ].map((cat) => (
                        <div key={cat.category} className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                            <div>
                                <span className="font-mono text-[10px] text-[#d9f064] block">{cat.category}</span>
                                <span className="text-xs text-white/50 mt-1 block">{cat.studios}</span>
                                <ul className="mt-3 space-y-1 text-xs text-white/80">
                                    {cat.examples.map((ex) => (
                                        <li key={ex}>&bull; {ex}</li>
                                    ))}
                                </ul>
                            </div>
                            <a href="#view-studios" onClick={closeMenu} className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-[#d9f064] underline">
                                View Studios & Verified Reviews &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Interactive District Map & Neighborhood Walk
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#1b2b27] text-[#d9e6e2] p-8 border-t border-[#527354]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#d9f064] uppercase tracking-[.25em]">
                        SPATIAL EXPLORER &bull; DISTRICT WALKS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Neighbourhoods with High Craft Density</h3>
                </div>
                <div className="font-mono text-xs text-white/60">
                    Average Walking Score: 98/100 &bull; Transit Connected
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        district: 'Mitte & Kreuzberg',
                        city: 'Berlin &bull; 4.2 km Walking Loop',
                        highlights: '14 galleries, 6 third-wave roasters, 3 brutalist chapels',
                    },
                    {
                        district: 'Yanaka & Nezu',
                        city: 'Tokyo &bull; 3.8 km Walking Loop',
                        highlights: 'Ancient wooden nagaya houses, wagashi makers, cat cafes',
                    },
                    {
                        district: 'Red Hook & Gowanus',
                        city: 'Brooklyn, NY &bull; 5.1 km Walking Loop',
                        highlights: 'Working shipyards, glassblowing workshops, natural cideries',
                    },
                ].map((d) => (
                    <div key={d.district} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#d9f064]">{d.city}</span>
                            <h4 className="mt-1 text-base font-bold text-white">{d.district}</h4>
                            <p className="mt-2 text-xs text-white/60">{d.highlights}</p>
                        </div>
                        <a
                            href="#map-loop"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs text-[#d9f064] underline hover:text-white"
                        >
                            <span>Open GPS Walking Loop</span>
                            <HiOutlineMap />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LocalDirectoryMegaMenuCollection
