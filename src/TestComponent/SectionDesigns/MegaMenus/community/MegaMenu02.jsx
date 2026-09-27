// CityChaptersMegaMenu

// MegaMenu02 · Social Networks & Communities › Mega menus

// Description:
// The light "IN-REAL-LIFE CHAPTERS • SALONS & WORKSHOPS" panel for a community site that
// runs in-person events. Under "Connect Beyond the Screen" and a "24 Global City Chapters"
// location tag it lists four meetups (Berlin, Tokyo, London, New York), each with date,
// event title, venue, spots left (Tokyo is "Waitlist only") and an "RSVP" link.

// Design:
// - Header stacks on mobile and becomes a row from md: (md:flex-row md:items-end); cards
//   in grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4, mapped from a static array
// - Cream #fcf8f5 surface, #2c1d18 text, #ebded7 hairlines (root border-t, header rule,
//   card borders); terracotta #a34c38 for the eyebrow, location tag, city/date row and
//   RSVP; white cards whose border turns terracotta on hover
// - Serif text-2xl heading; bold uppercase text-[10px] eyebrow (tracking-[.25em]);
//   font-mono text-[11px] city/date row; rounded-lg cards, no shadow of its own
// - Card footer sits above a border-gray-100 rule with black/60 spots text and an
//   underlined bold RSVP

// What it does:
// - Each "RSVP" link goes to #rsvp and calls closeMenu on click; the location tag, venues
//   and spot counts are static text
// - No state or effect; the card hover border is CSS only
// - Used by CityChaptersRightAlignedNavbar: <MegaMenu category="community" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-none border-b-2 border-[#a34c38] shadow-xl bg-[#fcf8f5]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CityChaptersMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/community/MegaMenu02';

// // Inside CityChaptersRightAlignedNavbar it opens from <MegaMenu category="community" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-b-2 border-[#a34c38] shadow-xl bg-[#fcf8f5]">
//         <CityChaptersMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineLocationMarker } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CityChaptersMegaMenu({
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
                'bg-[#fcf8f5] text-[#2c1d18] p-8 border-t border-[#ebded7]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#ebded7] pb-4 gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#a34c38]">
                        IN-REAL-LIFE CHAPTERS &bull; SALONS & WORKSHOPS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl">Connect Beyond the Screen</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#a34c38]">
                    <HiOutlineLocationMarker /> 24 Global City Chapters
                </div>
            </div>

            {/* 4 City Meetup Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        city: 'Berlin',
                        venue: 'Betahaus Kreuzberg',
                        date: 'THU OCT 15',
                        title: 'Creative Code & Craft Beer Salon',
                        spots: '6 spots left',
                    },
                    {
                        city: 'Tokyo',
                        venue: 'FabCafe Shibuya',
                        date: 'SAT OCT 17',
                        title: 'Generative Typography Night',
                        spots: 'Waitlist only',
                    },
                    {
                        city: 'London',
                        venue: 'Shoreditch Studios',
                        date: 'WED OCT 21',
                        title: 'Design Systems Roundtable',
                        spots: '12 spots left',
                    },
                    {
                        city: 'New York',
                        venue: 'A/D/O Greenpoint',
                        date: 'FRI OCT 23',
                        title: 'Independent Founders Mixer',
                        spots: '8 spots left',
                    },
                ].map((meetup) => (
                    <div
                        key={meetup.city}
                        className="rounded-lg border border-[#ebded7] bg-white p-4 flex flex-col justify-between hover:border-[#a34c38] transition-colors"
                    >
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#a34c38]">
                                <span className="font-bold">{meetup.city}</span>
                                <span>{meetup.date}</span>
                            </div>
                            <h5 className="mt-2 font-bold text-sm leading-snug">{meetup.title}</h5>
                            <p className="mt-1 text-xs text-black/50">{meetup.venue}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                            <span className="text-[11px] text-black/60">{meetup.spots}</span>
                            <a
                                href="#rsvp"
                                onClick={closeMenu}
                                className="font-bold text-[#a34c38] underline"
                            >
                                RSVP
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CityChaptersMegaMenu
