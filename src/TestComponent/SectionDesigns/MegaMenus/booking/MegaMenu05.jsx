// WeekendEscapesMegaMenu

// MegaMenu05 · Booking & Reservations › Mega menus

// Description:
// A dark last-minute deals dropdown for a boutique stays / travel-booking site. A mono
// kicker "THIS WEEKEND ONLY • SPONTANEOUS SANCTUARIES" tops the serif headline "Save Up to
// 35% on Unbooked Dates", with "DEALS EXPIRE IN: 14h 22m 04s" on the right. Three deal
// cards (The Glass Monolith, Cotswolds Converted Mill, Kamakura Bamboo Retreat) show drive
// time, was/now price, available dates and an "Instant Book Weekend" button-link.

// Design:
// - p-8 panel with a 2px #e07d5b top border: a header that stacks on mobile and becomes an
//   end-aligned row at md:, then a card grid of one column on mobile and three at md:
// - Near-black teal #0e1d24 surface with #dae6ec text; terracotta #e07d5b kicker,
//   countdown, deal prices and solid CTA, which inverts to white with #0e1d24 text on hover
// - Serif text-2xl headline, bold serif text-base names, font-mono text-[10px] drive lines
//   and text-xs prices; cards are rounded-lg p-5 with a white/10 border on white/5
// - Text-only cards, each ending in a full-width rounded CTA

// What it does:
// - Each "Instant Book Weekend" link calls closeMenu and goes to #instant-book; nothing
//   else is interactive. The countdown is static text that never ticks; no state or effect
// - Drive and price lines are JS strings, so &bull; and &rarr; show as literal text (e.g.
//   "Was $650 &rarr; Now $420/nt"); the header's JSX &bull; renders fine
// - Used by FlashWeekendDealsGridNavbar: <MegaMenu category="booking" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-[#e07d5b] shadow-2xl bg-[#0e1d24]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WeekendEscapesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/booking/MegaMenu05';

// // Inside FlashWeekendDealsGridNavbar it opens from <MegaMenu category="booking" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-[#e07d5b] shadow-2xl bg-[#0e1d24]">
//         <WeekendEscapesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function WeekendEscapesMegaMenu({
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

export default WeekendEscapesMegaMenu
