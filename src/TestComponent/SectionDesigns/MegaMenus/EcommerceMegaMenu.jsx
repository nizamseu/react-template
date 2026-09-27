// EcommerceMegaMenuCollection

// EcommerceMegaMenu · Section designs › Mega menus

// Description:
// The panel content for online-store navbars, normally rendered by MegaMenu (category="ecommerce").
// It shows one of five storefront designs: shop departments with item counts, featured products
// with prices, a luxury fashion atelier, a pre-loved auction and trade-in market, or artisan
// product bundles. Every link is a hash anchor that closes the menu when clicked.

// Design:
// - Self-contained Tailwind layouts with hard-coded palettes, Unsplash images and static demo data; each variant sets its own background and uses a responsive grid (one column on small screens, several at md/lg).
// - Variant 1 — "Editorial Lookbook Drop": cream #f9f7f4 (the only variant with dark: styles); 3 columns with a campaign image banner ("Shop the Lookbook"), two department lists (Living & Home, Wear & Utility) with badges and item counts, and a "Curators' Pick" product card with rating and "View Cart" link.
// - Variant 2 — "Neo-Brutalist Department Archive": dark #181614 with lime #d6f36a mono labels; status ticker header and a 4-column matrix (Raw Materials, The Archive, Makers in Residence, brass lamp card with "Acquire Piece").
// - Variant 3 — "Maison Haute Couture Atelier": ivory #fbfaf8 with bronze #9a704b; Roman-numeral collection list (I.–IV.), two-image lookbook diptych and a bespoke services box (salon appointment, WhatsApp atelier).
// - Variant 4 — "Circular Pre-Loved Market": olive-black #202315 with lime; live impact/carbon banner, auction card (countdown, current bid, "Place Bid"), condition-grade category links and a trade-in estimator CTA.
// - Variant 5 — "Artisan Provisions (Sunday Supply)": warm beige #f5ede4; serif header with a maker quote, two priced product bundles with "View Details" links and a maker spotlight card.

// What it does:
// - variant selects the layout through if (variant === 1..4); any other value (5, 0, 6, ...) renders the Variant 5 design.
// - Every <a> (hash links such as #drop-04, #cart, #bid, #sell-trade) calls closeMenu on click; there is no state, effect or other event handling.
// - Variant 1 department links build their hash from the item name (lower-cased, spaces replaced by dashes).
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#9a704b'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import EcommerceMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/EcommerceMegaMenu';

// // Normally rendered for you by <MegaMenu category="ecommerce" variant={3} />
// export default function ShopMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-xl border border-[#e8e4dc] shadow-2xl">
//             <EcommerceMegaMenuCollection variant={3} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineShoppingBag,
    HiOutlineSparkles,
    HiOutlineStar,
    HiOutlineTag,
    HiOutlineRefresh,
    HiOutlineSearch,
    HiOutlineHeart,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EcommerceMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#9a704b',
    className,
    ...props
}) {
    // VARIANT 1: Editorial Lookbook & Curated Drops (Awwwards SOTD Lookbook Style)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#f9f7f4] text-[#1c1b19] dark:bg-[#1c1b19] dark:text-[#f3eee6]',
                    className,
                )}
                {...props}
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr]">
                    {/* Featured Campaign Banner */}
                    <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden p-8 text-white">
                        <img
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                            alt="Spring Edit Campaign"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                                <HiOutlineSparkles className="text-amber-300" /> Drop 04 / S/S 2026
                            </span>
                            <h3 className="mt-3 font-serif text-3xl font-normal leading-tight">
                                Tactile Objects for Daily Rituals
                            </h3>
                            <p className="mt-2 text-xs text-white/80 line-clamp-2">
                                Handcrafted stoneware, organic Belgian linen, and architectural brass essentials.
                            </p>
                            <a
                                href="#drop-04"
                                onClick={closeMenu}
                                className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white underline decoration-2 underline-offset-4 hover:text-[#d6f36a]"
                            >
                                Shop the Lookbook <HiArrowRight />
                            </a>
                        </div>
                    </div>

                    {/* Department Columns */}
                    <div className="grid grid-cols-2 gap-6 p-8 border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9a704b] dark:text-[#d6f36a]">
                                Living & Home
                            </p>
                            <ul className="mt-4 space-y-2.5 text-xs">
                                {[
                                    { name: 'Ceramics & Vases', badge: 'Hot', count: '38 items' },
                                    { name: 'Linen Tablecloths', count: '14 items' },
                                    { name: 'Aroma Diffusers & Incense', badge: 'New', count: '22 items' },
                                    { name: 'Sculptural Lighting', count: '19 items' },
                                    { name: 'Hand-blown Glassware', count: '31 items' },
                                    { name: 'Makers & Studios Index', count: '12 artisans' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={closeMenu}
                                            className="group flex items-center justify-between py-1 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors"
                                        >
                                            <span className="font-medium group-hover:translate-x-1 transition-transform">
                                                {item.name}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                {item.badge && (
                                                    <span className="rounded bg-[#9a704b]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#9a704b] dark:bg-[#d6f36a]/20 dark:text-[#d6f36a]">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-black/40 dark:text-white/40">
                                                    {item.count}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9a704b] dark:text-[#d6f36a]">
                                Wear & Utility
                            </p>
                            <ul className="mt-4 space-y-2.5 text-xs">
                                {[
                                    { name: 'Everyday Canvas Totes', count: '18 items' },
                                    { name: 'Organic Cotton Robes', badge: 'Restock', count: '12 items' },
                                    { name: 'Vegetable-Tanned Leather', count: '16 items' },
                                    { name: 'Merino Wool Throws', count: '9 items' },
                                    { name: 'Minimalist Timepieces', count: '8 items' },
                                    { name: 'Archive Overstock Sale', badge: '-30%', count: '25 items' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={closeMenu}
                                            className="group flex items-center justify-between py-1 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors"
                                        >
                                            <span className="font-medium group-hover:translate-x-1 transition-transform">
                                                {item.name}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                {item.badge && (
                                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-black/40 dark:text-white/40">
                                                    {item.count}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Spotlight Product Card */}
                    <div className="p-8 bg-[#f2eee8] dark:bg-[#23211e] flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/50 dark:text-white/50">
                                Curators' Pick
                            </span>
                            <div className="mt-3 overflow-hidden rounded-lg bg-white dark:bg-black/40 shadow-sm border border-black/5 dark:border-white/5">
                                <img
                                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80"
                                    alt="Nordic Clay Vessel"
                                    className="h-36 w-full object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-serif font-bold">Nordic Fluted Vase</span>
                                        <span className="font-mono font-bold">$115</span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-black/60 dark:text-white/60">
                                        Glazed stoneware by Studio Arhoj.
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-amber-500 text-xs">
                                        <HiOutlineStar className="fill-amber-400" />
                                        <HiOutlineStar className="fill-amber-400" />
                                        <HiOutlineStar className="fill-amber-400" />
                                        <HiOutlineStar className="fill-amber-400" />
                                        <HiOutlineStar className="fill-amber-400" />
                                        <span className="ml-1 text-[10px] text-black/50 dark:text-white/50">(48 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                            <span className="text-black/60 dark:text-white/60">Free global delivery $150+</span>
                            <a
                                href="#cart"
                                onClick={closeMenu}
                                className="font-semibold underline hover:text-[#9a704b]"
                            >
                                View Cart (0)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Dark Luxury Boutique & Neo-Brutalist Matrix (MATERIAL/MATTERS)
    if (variant === 2) {
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

    // VARIANT 3: Maison 08 Luxury Fashion Atelier & Split Haute Couture Grid
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#fbfaf8] text-[#1e1c1a] p-8 border-t border-[#e8e4dc]',
                    className,
                )}
                {...props}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Numbered Collections */}
                    <div className="lg:col-span-4 space-y-6 border-r border-[#e8e4dc] pr-8">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#9a704b]">
                                SALON PERMANENT &bull; MAISON 08
                            </span>
                            <h3 className="mt-2 font-serif text-2xl font-light italic">
                                Collections Automne-Hiver
                            </h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { roman: 'I.', title: 'Prêt-à-Porter Tailoring', desc: 'Sculpted wool overcoats & silk shirts' },
                                { roman: 'II.', title: 'Cuir & Maroquinerie', desc: 'Hand-burnished calfskin luggage & bags' },
                                { roman: 'III.', title: 'Bijoux Sculpturaux', desc: 'Recycled 18k solid gold & raw stones' },
                                { roman: 'IV.', title: 'Haute Parfumerie', desc: 'Smoked cedar, vetiver & black tea extrait' },
                            ].map((cat) => (
                                <li key={cat.title}>
                                    <a
                                        href="#maison-cat"
                                        onClick={closeMenu}
                                        className="group block rounded-md p-2 hover:bg-black/[0.03] transition-colors"
                                    >
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-serif italic text-sm text-[#9a704b]">{cat.roman}</span>
                                            <span className="text-xs font-semibold uppercase tracking-wider group-hover:underline">
                                                {cat.title}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-black/50 pl-5">{cat.desc}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Center: Lookbook Diptych */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        <div className="group relative overflow-hidden rounded bg-black/5">
                            <img
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                                alt="Maison Look 01"
                                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                                <span className="text-[10px] font-mono tracking-widest text-white/80">LOOK 12</span>
                                <span className="font-serif text-sm">Cashmere Trench & No. 04 Belt</span>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded bg-black/5">
                            <img
                                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
                                alt="Maison Look 02"
                                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                                <span className="text-[10px] font-mono tracking-widest text-white/80">ACCESSOIRES</span>
                                <span className="font-serif text-sm">The Trapeze Calfskin Bag</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Atelier Services */}
                    <div className="lg:col-span-3 space-y-5 bg-[#f4f0e8] p-6 rounded-lg">
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9a704b]">
                                BESPOKE CLIENT SERVICES
                            </span>
                            <h4 className="mt-1 font-serif text-lg">Personal Styling & Monogramming</h4>
                            <p className="mt-2 text-xs text-black/60 leading-relaxed">
                                Book a private salon fitting in Paris, New York, or via virtual HD preview.
                            </p>
                        </div>
                        <div className="space-y-2 text-xs">
                            <a
                                href="#salon"
                                onClick={closeMenu}
                                className="flex items-center justify-between border-b border-black/10 py-2 font-medium hover:text-[#9a704b]"
                            >
                                <span>Book Salon Appointment</span>
                                <HiArrowRight />
                            </a>
                            <a
                                href="#concierge"
                                onClick={closeMenu}
                                className="flex items-center justify-between border-b border-black/10 py-2 font-medium hover:text-[#9a704b]"
                            >
                                <span>WhatsApp Atelier Direct</span>
                                <HiArrowRight />
                            </a>
                        </div>
                        <div className="text-[10px] text-black/50">
                            White-glove complimentary courier across 42 countries.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 4: Circular & Pre-Loved Marketplace (GOOD CIRCULAR)
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#202315] text-[#f4f7ea] p-8 border-t-2 border-[#d6f36a]',
                    className,
                )}
                {...props}
            >
                {/* Top Live Impact Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#2a301c] px-5 py-3 border border-[#d6f36a]/20">
                    <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6f36a] text-[#202315] font-bold text-xs">
                            ♻
                        </span>
                        <span className="text-xs font-semibold">
                            Live Impact: 14,820 designer garments rescued this month
                        </span>
                    </div>
                    <span className="font-mono text-xs text-[#d6f36a]">
                        Carbon Offset: -42.8 tonnes CO₂e
                    </span>
                </div>

                {/* 3 Columns: Drop of Day, Fast Filters, Trade-in Box */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Col 1: Flash Pre-loved Drop */}
                    <div className="rounded-lg bg-[#2a301c] p-5 border border-white/10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="rounded bg-[#d6f36a] px-2 py-0.5 font-bold text-[#202315]">
                                    AUCTION / DROP 28
                                </span>
                                <span className="text-[#d6f36a]">ENDS IN 03:22:15</span>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
                                alt="Vintage Leather Jacket"
                                className="mt-4 h-40 w-full rounded object-cover"
                            />
                            <h4 className="mt-3 font-bold text-sm">1998 Helmut Lang Distressed Biker Jacket</h4>
                            <p className="mt-1 text-xs text-white/60">Condition: Pristine Archive &bull; Size: 48 (EU)</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                            <div>
                                <span className="text-[10px] text-white/50 block font-mono">CURRENT BID</span>
                                <span className="font-mono text-lg font-bold text-[#d6f36a]">$620</span>
                            </div>
                            <a
                                href="#bid"
                                onClick={closeMenu}
                                className="rounded-full bg-[#d6f36a] px-4 py-1.5 text-xs font-bold text-[#202315] hover:bg-white transition-colors"
                            >
                                Place Bid
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Categories by Condition */}
                    <div className="space-y-4">
                        <p className="font-mono text-[11px] text-[#d6f36a] uppercase tracking-wider">
                            EXPLORE BY VERIFIED CONDITION
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 text-xs">
                            {[
                                { title: 'Pristine / With Tags', desc: 'Unworn designer samples & deadstock', count: '142 items' },
                                { title: 'Gently Loved (Grade A)', desc: 'Near zero signs of wear, dry-cleaned', count: '390 items' },
                                { title: 'Vintage Character (Grade B)', desc: 'Beautiful natural patina, authentic wear', count: '210 items' },
                                { title: 'Restored & Upcycled', desc: 'Mended by artisan tailors with sashiko', count: '64 items' },
                            ].map((cond) => (
                                <a
                                    key={cond.title}
                                    href="#condition"
                                    onClick={closeMenu}
                                    className="group flex flex-col rounded-md border border-white/10 bg-white/5 p-3 hover:border-[#d6f36a] transition-all"
                                >
                                    <div className="flex items-center justify-between font-semibold">
                                        <span className="group-hover:text-[#d6f36a] transition-colors">{cond.title}</span>
                                        <span className="font-mono text-[10px] text-white/40">{cond.count}</span>
                                    </div>
                                    <span className="text-[11px] text-white/60 mt-0.5">{cond.desc}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: Instant Trade-In Estimator */}
                    <div className="rounded-lg bg-gradient-to-br from-[#2a301c] to-[#1c1f13] p-6 border border-[#d6f36a]/30 flex flex-col justify-between">
                        <div>
                            <span className="inline-block rounded bg-[#d6f36a]/20 px-2 py-0.5 font-mono text-[10px] text-[#d6f36a]">
                                CIRCULAR TRADE-IN
                            </span>
                            <h4 className="mt-2 text-xl font-bold">Sell Your Designer Pieces</h4>
                            <p className="mt-2 text-xs text-white/70 leading-relaxed">
                                Send us photos of your authentic items. Receive an immediate payout or get <strong>+20% bonus</strong> in circular store credit.
                            </p>
                            <div className="mt-4 space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-white/80">
                                    <HiOutlineTag className="text-[#d6f36a]" /> Free prepaid shipping kit sent to your door
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <HiOutlineRefresh className="text-[#d6f36a]" /> Instant bank deposit upon authentication
                                </div>
                            </div>
                        </div>
                        <a
                            href="#sell-trade"
                            onClick={closeMenu}
                            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-[#d6f36a] py-2.5 text-xs font-bold text-[#202315] hover:bg-white transition-colors"
                        >
                            Estimate My Trade-in Value <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 5: Sunday Supply - Artisan Market & Sensory Goods
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#f5ede4] text-[#2d2520] p-8 border-t border-[#d8c8ba]',
                className,
            )}
            {...props}
        >
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#d8c8ba] pb-4 gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#9a704b]">
                        SUNDAY SUPPLY &bull; PROVISIONS FOR THE SLOW HOME
                    </span>
                    <h3 className="mt-1 font-serif text-2xl">
                        Handcrafted by Independent Makers & Quiet Studios
                    </h3>
                </div>
                <p className="max-w-md text-xs text-[#2d2520]/70 italic font-serif">
                    "Every object carries the fingerprint of its craftsperson — made to grow gentler with age."
                </p>
            </div>

            {/* 3 Sensory Bundles & Artisan Feature */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bundle 1 */}
                <div className="rounded-lg bg-white/70 p-5 border border-[#d8c8ba]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="relative h-44 overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80"
                                alt="Morning Coffee Ritual"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-[#2d2520]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                                The Morning Ritual
                            </span>
                        </div>
                        <h4 className="mt-3 font-serif text-base font-bold">Stoneware Pour-Over & Linen Set</h4>
                        <p className="mt-1 text-xs text-[#2d2520]/70">
                            Includes wheel-thrown dripper, washed flax filter cloth, and heirloom single-origin beans.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#d8c8ba]/40 pt-3">
                        <span className="font-mono text-xs font-bold">$78 Complete Set</span>
                        <a
                            href="#bundle-1"
                            onClick={closeMenu}
                            className="text-xs font-semibold text-[#9a704b] underline hover:text-[#2d2520]"
                        >
                            View Details
                        </a>
                    </div>
                </div>

                {/* Bundle 2 */}
                <div className="rounded-lg bg-white/70 p-5 border border-[#d8c8ba]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="relative h-44 overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80"
                                alt="Botanical Candle and Bath"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-[#2d2520]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                                Bath & Sanctuary
                            </span>
                        </div>
                        <h4 className="mt-3 font-serif text-base font-bold">Wild Cypress & Sea Salt Soak</h4>
                        <p className="mt-1 text-xs text-[#2d2520]/70">
                            Harvested Pacific sea salts blended with cold-pressed Hinoki and cedarwood oils.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#d8c8ba]/40 pt-3">
                        <span className="font-mono text-xs font-bold">$44 Jar (500g)</span>
                        <a
                            href="#bundle-2"
                            onClick={closeMenu}
                            className="text-xs font-semibold text-[#9a704b] underline hover:text-[#2d2520]"
                        >
                            View Details
                        </a>
                    </div>
                </div>

                {/* Artisan Profile */}
                <div className="rounded-lg bg-[#ede1d5] p-5 border border-[#d8c8ba] flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a704b]">
                            MAKER SPOTLIGHT
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                                alt="Elena Vane, Potter"
                                className="h-12 w-12 rounded-full object-cover border border-white"
                            />
                            <div>
                                <h5 className="font-serif font-bold text-sm">Elena Vane</h5>
                                <p className="text-[11px] text-[#2d2520]/70">Ceramicist &bull; Devon, UK</p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-[#2d2520]/80 leading-relaxed italic">
                            "Every batch is wood-fired over 48 hours using local orchard trimmings. No two glaze blooms are identical."
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#d8c8ba]">
                        <a
                            href="#artisan-elena"
                            onClick={closeMenu}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d2520] hover:text-[#9a704b]"
                        >
                            Explore Elena's 18 Pieces <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EcommerceMegaMenuCollection
