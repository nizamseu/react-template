// TravelStaysBookingMegaMenuCollection

// BookingMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for a boutique stays / travel-booking website (fictional
// "Elsewhere" brand). Depending on `variant` the visitor browses architectural villas,
// a mock search bar with trending destinations, stay collections by typology, hosted
// experiences or discounted weekend deals, each with a reserve/book CTA.

// Design:
// - Five hard-coded layouts in deep teal tones (plus one light cream variant) with terracotta #e07d5b highlights, serif headlines and responsive card grids.
// - Variant 1 — "Architectural Stays": #102530 panel, three villa cards with Unsplash photo (zoom on hover), price badge, location, star rating, amenities and a "Reserve Sanctuary" link.
// - Variant 2 — "Destination Finder": light #f7f5f0 panel, white search widget (read-only Where "Kyoto, Japan", static When/Guests, "Search 420 Stays" button) and a row of trending-destination pill links.
// - Variant 3 — "Stays by Typology": #14232c panel, four collection cards (Mid-Century Modern, Wilderness Treehouses, Historic Watchtowers, Overwater Sanctuaries) with property counts and "Explore Collection" links.
// - Variant 4 — "Host Experiences": #1a2d36 panel, header with a "Host an Experience" pill link and three experience cards (location/duration, title, price per guest, rating, "Reserve" link).
// - Variant 5 — "Weekend Escapes": #0e1d24 panel, "Save Up to 35%" header with static countdown text and three deal cards (drive time, was/now price, dates) with "Instant Book Weekend" button-links.

// What it does:
// - `variant` 1-4 each return their own layout; any other value (including 5) falls through to Variant 5.
// - Every anchor and the Variant 2 search button call `closeMenu` on click; hrefs are placeholders (e.g. "#book-villa", "#dest", "#browse-type", "#instant-book").
// - Purely presentational: no real search, booking or countdown logic; all data is hard-coded and there is no state or effect.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "booking"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#b65f47'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import TravelStaysBookingMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/BookingMegaMenu';

// function StaysMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <TravelStaysBookingMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="booking"
// // <MegaMenu category="booking" variant={2} accent="#b65f47" label="Destination Finder" />
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineSearch,
    HiOutlineSparkles,
    HiOutlineStar,
    HiOutlineUsers,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TravelStaysBookingMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#b65f47',
    className,
    ...props
}) {
    // VARIANT 1: Sanctuary Escapes & Architectural Stays (elsewhere.)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#102530] text-[#e3edf2] p-8 border-t-2 border-[#e07d5b]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#e07d5b]">
                            ELSEWHERE SANCTUARIES &bull; ARCHITECTURAL RESIDENCES
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">
                            Rare Stays Designed to Stay with You
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                        <span>100% CARBON-NEUTRAL STAYS</span>
                        <span>&bull;</span>
                        <span>PRIVATE CHEF ON DEMAND</span>
                    </div>
                </div>

                {/* 3 Architectural Villas */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'The Clifftop Monolith',
                            loc: 'Big Sur, California',
                            price: '$680 / night',
                            rating: '4.98 (42 stays)',
                            amenity: 'Private saltwater pool &bull; Off-grid solar',
                            img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            name: 'Hakone Forest Ryokan',
                            loc: 'Kanagawa, Japan',
                            price: '$540 / night',
                            rating: '5.00 (36 stays)',
                            amenity: 'Private volcanic onsen &bull; Kaiseki included',
                            img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            name: 'Dolomites Glass Pavilion',
                            loc: 'South Tyrol, Italy',
                            price: '$720 / night',
                            rating: '4.96 (51 stays)',
                            amenity: '360° Alpine panorama &bull; Cedar sauna',
                            img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
                        },
                    ].map((villa) => (
                        <div
                            key={villa.name}
                            className="group overflow-hidden rounded-lg border border-white/10 bg-white/5 flex flex-col justify-between hover:border-[#e07d5b] transition-all"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={villa.img}
                                    alt={villa.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] text-[#e07d5b]">
                                    {villa.price}
                                </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-[11px] text-white/50">
                                        <span>{villa.loc}</span>
                                        <span className="flex items-center gap-1 text-amber-300">
                                            <HiOutlineStar className="fill-amber-400" /> {villa.rating}
                                        </span>
                                    </div>
                                    <h4 className="mt-1 text-base font-serif font-bold text-white group-hover:text-[#e07d5b] transition-colors">
                                        {villa.name}
                                    </h4>
                                    <p className="mt-1 text-xs text-white/60">{villa.amenity}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                    <span className="text-white/40">Verified Architecture</span>
                                    <a
                                        href="#book-villa"
                                        onClick={closeMenu}
                                        className="font-bold text-[#e07d5b] underline hover:text-white"
                                    >
                                        Reserve Sanctuary
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 2: Instant Travel Search & Destination Matrix
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#f7f5f0] text-[#1c2c34] p-8 border-t border-[#d8e2e6]',
                    className,
                )}
                {...props}
            >
                {/* Search Bar Widget */}
                <div className="rounded-xl bg-white p-3 shadow-md border border-[#d8e2e6] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">WHERE</span>
                        <input
                            type="text"
                            readOnly
                            value="Kyoto, Japan"
                            className="w-full font-bold text-gray-900 outline-none cursor-pointer mt-0.5"
                        />
                    </div>
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">WHEN</span>
                        <span className="block font-bold text-gray-900 mt-0.5">Oct 14 — Oct 21</span>
                    </div>
                    <div className="p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">GUESTS</span>
                        <span className="block font-bold text-gray-900 mt-0.5">2 Adults &bull; Entire Stay</span>
                    </div>
                    <div className="flex items-center justify-end p-1">
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#e07d5b] px-6 py-2.5 font-bold text-white hover:bg-[#c96242] transition-colors"
                        >
                            <HiOutlineSearch /> Search 420 Stays
                        </button>
                    </div>
                </div>

                {/* Popular Destination Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Trending Now:</span>
                    {['Lofoten Islands', 'Amalfi Coast', 'Scottish Highlands', 'Joshua Tree', 'Patagonia Fjords', 'Oaxaca Valley'].map((dest) => (
                        <a
                            key={dest}
                            href="#dest"
                            onClick={closeMenu}
                            className="rounded-full bg-gray-200/70 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-[#e07d5b] hover:text-white transition-colors"
                        >
                            {dest}
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 3: Thematic Stays & Architectural Typologies
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#14232c] text-[#dce7ee] p-8 border-t border-[#b65f47]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-[.25em]">
                            CURATED COLLECTIONS BY TYPOLOGY
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">Stays by Design Philosophy</h3>
                    </div>
                    <span className="text-xs text-white/50">Each property personally scouted and verified</span>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            type: 'Mid-Century Modern',
                            desc: 'Desert post-and-beam homes and Palm Springs icons.',
                            count: '24 Properties',
                        },
                        {
                            type: 'Wilderness Treehouses',
                            desc: 'Architectural cedar pods high in the Pacific Northwest canopy.',
                            count: '18 Properties',
                        },
                        {
                            type: 'Historic Watchtowers',
                            desc: 'Converted medieval stone bastions in Tuscany and Provence.',
                            count: '14 Properties',
                        },
                        {
                            type: 'Overwater Sanctuaries',
                            desc: 'Off-grid stilt pavilions over untouched coral lagoons.',
                            count: '11 Properties',
                        },
                    ].map((col) => (
                        <div
                            key={col.type}
                            className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between hover:border-[#e07d5b] transition-colors"
                        >
                            <div>
                                <span className="font-mono text-[10px] text-[#e07d5b]">{col.count}</span>
                                <h4 className="mt-2 font-bold text-sm text-white">{col.type}</h4>
                                <p className="mt-1 text-xs text-white/60">{col.desc}</p>
                            </div>
                            <a
                                href="#browse-type"
                                onClick={closeMenu}
                                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#e07d5b] font-semibold"
                            >
                                <span>Explore Collection</span>
                                <HiArrowRight />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 4: Immersive Experiences & Host Masterclasses
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#1a2d36] text-white p-8 border-t border-[#e07d5b]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-[.25em]">
                            BEYOND ACCOMMODATION &bull; IMMERSIVE FIELD NOTES
                        </span>
                        <h3 className="mt-1 font-serif text-2xl">Led by Local Craftsmen, Foragers & Scientists</h3>
                    </div>
                    <a
                        href="#host"
                        onClick={closeMenu}
                        className="rounded-full bg-[#e07d5b] px-4 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-[#1a2d36] transition-colors"
                    >
                        Host an Experience
                    </a>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Tea Ceremony & Raku Pottery with Master Chiba',
                            loc: 'Uji, Kyoto &bull; 4 Hours',
                            price: '$190 / guest',
                            rating: '5.0 (48 reviews)',
                        },
                        {
                            title: 'Deep Sea Freediving & Marine Rewilding',
                            loc: 'Azores Archipelago &bull; Full Day',
                            price: '$260 / guest',
                            rating: '4.98 (32 reviews)',
                        },
                        {
                            title: 'High-Altitude Stargazing with Astrophysicists',
                            loc: 'Atacama Desert &bull; Night Session',
                            price: '$220 / guest',
                            rating: '5.0 (64 reviews)',
                        },
                    ].map((exp) => (
                        <div
                            key={exp.title}
                            className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                        >
                            <div>
                                <span className="font-mono text-[10px] text-white/50">{exp.loc}</span>
                                <h4 className="mt-2 font-bold text-sm text-white">{exp.title}</h4>
                                <span className="block mt-2 font-mono text-xs text-[#e07d5b] font-bold">{exp.price}</span>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                                <span className="text-white/50">{exp.rating}</span>
                                <a href="#book-exp" onClick={closeMenu} className="font-bold text-[#e07d5b] underline">
                                    Reserve &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Last-Minute Weekend Escapes & Secret Season
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#0e1d24] text-[#dae6ec] p-8 border-t-2 border-[#e07d5b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-[.25em]">
                        THIS WEEKEND ONLY &bull; SPONTANEOUS SANCTUARIES
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Save Up to 35% on Unbooked Dates</h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#e07d5b]">
                    <span>DEALS EXPIRE IN: 14h 22m 04s</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'The Glass Monolith',
                        drive: '2h Drive from NYC &bull; Catskills',
                        deal: 'Was $650 &rarr; Now $420/nt',
                        avail: 'Fri 16 – Sun 18 Oct',
                    },
                    {
                        name: 'Cotswolds Converted Mill',
                        drive: '90m from London &bull; Gloucestershire',
                        deal: 'Was £520 &rarr; Now £340/nt',
                        avail: 'Fri 16 – Sun 18 Oct',
                    },
                    {
                        name: 'Kamakura Bamboo Retreat',
                        drive: '1h from Tokyo Station &bull; Kanagawa',
                        deal: 'Was ¥78,000 &rarr; Now ¥52,000/nt',
                        avail: 'Sat 17 – Mon 19 Oct',
                    },
                ].map((deal) => (
                    <div
                        key={deal.name}
                        className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                    >
                        <div>
                            <span className="font-mono text-[10px] text-white/50">{deal.drive}</span>
                            <h4 className="mt-1 font-serif text-base font-bold text-white">{deal.name}</h4>
                            <div className="mt-2 font-mono text-xs font-bold text-[#e07d5b]">{deal.deal}</div>
                            <span className="text-xs text-white/70 block mt-1">Available: {deal.avail}</span>
                        </div>
                        <a
                            href="#instant-book"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-center rounded bg-[#e07d5b] py-2 text-xs font-bold text-white hover:bg-white hover:text-[#0e1d24] transition-colors"
                        >
                            Instant Book Weekend
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TravelStaysBookingMegaMenuCollection
