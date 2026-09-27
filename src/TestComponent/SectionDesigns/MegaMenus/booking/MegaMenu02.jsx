// DestinationFinderMegaMenu

// MegaMenu02 · Booking & Reservations › Mega menus

// Description:
// A light, search-first dropdown for a boutique stays / travel-booking site. A white
// search widget shows WHERE "Kyoto, Japan", WHEN "Oct 14 — Oct 21" and GUESTS "2 Adults •
// Entire Stay" beside a "Search 420 Stays" button. A "Trending Now:" row below offers pill
// links to Lofoten Islands, Amalfi Coast, Scottish Highlands, Joshua Tree, Patagonia Fjords
// and Oaxaca Valley.

// Design:
// - p-8 panel with a #d8e2e6 top border: a rounded-xl white search card (shadow-md, #d8e2e6
//   border) whose grid is one column on mobile and four at sm:, then a wrapping pill row
// - Light cream #f7f5f0 surface with #1c2c34 text; terracotta #e07d5b search button (hover
//   #c96242) and pill hover fill; gray-400 labels, gray-900 values, gray-200/70 pills
// - text-[10px] bold uppercase tracked field labels over bold text-xs values; pills are
//   rounded-full text-xs and the button is rounded-lg with a search icon
// - On mobile the fields stack with gray-200 bottom dividers and a full-width button; from
//   sm: they sit in a row with right dividers and the button shrinks to auto width

// What it does:
// - The "Search 420 Stays" button and every trending pill call closeMenu; pills go to
//   #dest, and the button only closes the menu (no search runs)
// - WHERE is a readOnly input (cursor-pointer but not editable); WHEN and GUESTS are plain
//   text; no state or effect
// - Used by DestinationFinderNavbar: <MegaMenu category="booking" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-[#d8e2e6] shadow-xl bg-[#f7f5f0]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DestinationFinderMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/booking/MegaMenu02';

// // Inside DestinationFinderNavbar it opens from <MegaMenu category="booking" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-[#d8e2e6] shadow-xl bg-[#f7f5f0]">
//         <DestinationFinderMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DestinationFinderMegaMenu({
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

export default DestinationFinderMegaMenu
