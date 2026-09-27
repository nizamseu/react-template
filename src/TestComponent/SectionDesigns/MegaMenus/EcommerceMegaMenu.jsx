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
// - variant picks one of five panel files in MegaMenus/ecommerce/: 1 → MegaMenu01 (EditorialLookbookDropMegaMenu),
//   2 → MegaMenu02 (NeoBrutalistDepartmentArchiveMegaMenu), 3 → MegaMenu03 (MaisonHauteCoutureAtelierMegaMenu),
//   4 → MegaMenu04 (CircularPreLovedMarketMegaMenu), 5 → MegaMenu05 (SundaySupplyArtisanProvisionsMegaMenu).
//   Any other value renders MegaMenu05.
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
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

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

import EditorialLookbookDropMegaMenu from './ecommerce/MegaMenu01';
import NeoBrutalistDepartmentArchiveMegaMenu from './ecommerce/MegaMenu02';
import MaisonHauteCoutureAtelierMegaMenu from './ecommerce/MegaMenu03';
import CircularPreLovedMarketMegaMenu from './ecommerce/MegaMenu04';
import SundaySupplyArtisanProvisionsMegaMenu from './ecommerce/MegaMenu05';

const menus = {
    1: EditorialLookbookDropMegaMenu,
    2: NeoBrutalistDepartmentArchiveMegaMenu,
    3: MaisonHauteCoutureAtelierMegaMenu,
    4: CircularPreLovedMarketMegaMenu,
    5: SundaySupplyArtisanProvisionsMegaMenu,
}

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
    const Menu = menus[variant] || menus[5]

    return (
        <Menu
            size={size}
            disabled={disabled}
            loading={loading}
            closeMenu={closeMenu}
            className={className}
            {...props}
        />
    )
}

export default EcommerceMegaMenuCollection