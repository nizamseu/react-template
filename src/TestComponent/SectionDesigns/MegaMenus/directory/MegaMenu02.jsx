// PowerSearchMegaMenu

// MegaMenu02 · Directories & Search Aggregators › Mega menus

// Description:
// A light mock search panel for a local business directory. A search bar reads "Search by
// neighborhood, specialty craft, or opening hours..." next to a "Filters (4 active)"
// button, followed by six ticked filter chips (Open After 10 PM, Dog Friendly Patio,
// Wheelchair Accessible and more) and three nearby London places (Monocle Coffee Roasters,
// Tate Modern Bookshop, Leila’s Shop & Provisions) with distance, hours and a star rating.

// Design:
// - Stacked: full-width search bar, a flex-wrap chip row, then place cards in 1 column on
//   mobile and 3 from md:
// - Pale green #f5f8f5 surface with #1c2c26 text and a #d5e0d7 top border; white search
//   bar, chips and cards with gray-200/300 borders; sage #527354 filter button,
//   emerald-700 opening hours
// - rounded-xl shadow-sm search bar, rounded-full chips, rounded-lg cards; text-xs body,
//   font-mono text-[10px] hours and bold font-mono ratings
// - Chips wrap onto extra lines on narrow screens; no dark: variants

// What it does:
// - Nothing is a link and closeMenu is never called: the input is readOnly with a fixed
//   value (cursor-pointer), the "Filters" button has no onClick, chips and cards are static
// - Place locations hold "&bull;" inside JS strings, so it renders as literal text; no
//   state or effects
// - Used by PowerSearchLimeNavbar: <MegaMenu category="directory" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-[#d5e0d7] shadow-xl bg-[#f5f8f5]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: accepted like the other panels, but nothing in this design calls it
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PowerSearchMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/directory/MegaMenu02';

// // Inside PowerSearchLimeNavbar it opens from <MegaMenu category="directory" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-[#d5e0d7] shadow-xl bg-[#f5f8f5]">
//         <PowerSearchMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PowerSearchMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    // eslint-disable-next-line no-unused-vars -- kept so it is not spread onto the <div>
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

export default PowerSearchMegaMenu
